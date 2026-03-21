import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";
import cron from "node-cron";

console.log("🚀 SCRIPT INITIALIZED");

/**
 * Record utility type is used to define an object type with specific key-value pairs.
 * written in Record<Keys, Type>
 *
 * The flights creation is based on mimicked real world flights and their configurations.
 * The flights are based on
 * 1. Pricing
 * 2. Baggage allowance
 * 3. Seat availability
 * 4. Cabin class
 * 5. Duration
 * 6. flight schedules
 * 7. Segments and legs - which depends on the outbound and inbound airports
 * 8. Airlines operating the flights
 *
 * The flight day creates like 10 - 15 offers of different flight times for each cabin classes
 */

//helper function to calculate price multipliers and baggage allowance based on cabin class
const CABIN_CONFIGS: Record<
  string,
  { multiplier: number; baggage: number; seats: number }
> = {
  Economy: { multiplier: 1.0, baggage: 1, seats: 20 },
  "Premium Economy": { multiplier: 1.4, baggage: 2, seats: 12 },
  Business: { multiplier: 2.2, baggage: 3, seats: 8 },
  "First Class": { multiplier: 3.5, baggage: 3, seats: 4 },
};

function populateFakeAirports() {
  return Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () => {
    const airportName = faker.airline.airport().name;
    const airportCode = faker.airline.airport().iataCode;
    const imageUrl = faker.image.url({ width: 100, height: 100 });
    const city = faker.location.city();
    const country = faker.location.country();
    return {
      name: airportName,
      code: airportCode,
      imageUrl: imageUrl,
      city: city,
      country: country,
    };
  });
}

function populateFakeAirlines() {
  return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
    const airlineName = faker.airline.airline().name;
    const airlineCode = faker.airline.airline().iataCode;
    const airlineImageUrl = faker.image.url({ width: 100, height: 100 });

    return {
      name: airlineName,
      iata_code: airlineCode,
      logo: airlineImageUrl,
    };
  });
}

function populateFakeSegments(
  targetDate: Date,
  originCode: string,
  destinationCode: string,
) {
  const baseDate = new Date(targetDate);
  const randomHour = faker.number.int({ min: 1, max: 23 });

  const departureTime = new Date(baseDate);
  departureTime.setHours(
    randomHour,
    faker.helpers.arrayElement([0, 15, 30, 45]),
    0,
    0,
  );

  const durationMinutes = faker.number.int({ min: 90, max: 600 });
  const arrivalTime = new Date(
    departureTime.getTime() + durationMinutes * 60000,
  );

  return {
    departure_airport_code: originCode,
    arrival_airport_code: destinationCode,
    total_time: durationMinutes,
    departure_time: departureTime,
    arrival_time: arrivalTime,
    departure_time_iso: departureTime.toISOString(),
    arrival_time_iso: arrivalTime.toISOString(),
  };
}

function populateFakeLegsData(
  segmentStart: Date,
  segmentEnd: Date,
  cabinClass: string,
  originCode: string,
  destinationCode: string,
  validAirportCodes: string[],
) {
  // 1. First, find potential transit hubs
  // this depends if the flights needs like a mid airport to first land to - like a layover
  const possibleHubs = validAirportCodes.filter(
    (code) => code !== originCode && code !== destinationCode,
  );

  // 2. Decide numLegs:
  // If we have no hubs, it MUST be 1.
  // If we have hubs, randomly choose 1 or 2.
  const numLegs =
    possibleHubs.length > 0 ? faker.number.int({ min: 1, max: 2 }) : 1;

  const legs = [];
  // time difference between segment start and end
  const totalSegmentMs = segmentEnd.getTime() - segmentStart.getTime(); // milliseconds -ms

  // 3. Use the single numLegs variable to drive the branching logic
  if (numLegs === 1) {
    legs.push({
      total_time: Math.floor(totalSegmentMs / 60000),
      departure_time: segmentStart.toISOString(),
      arrival_time: segmentEnd.toISOString(),
      departure_code: originCode,
      arrival_code: destinationCode,
      cabin_class: cabinClass,
    });
  } else {
    // This block ONLY runs if numLegs is 2 AND possibleHubs exists
    const transitAirport = faker.helpers.arrayElement(possibleHubs);

    const layoverMs = faker.number.int({ min: 60, max: 150 }) * 60 * 1000; // milliseconds
    const flyingMs = totalSegmentMs - layoverMs;

    // think of the total flight time as 100% - we need to split it between the two legs, thats where the 45% and 55% comes in - we want the second leg to be slightly longer on average to mimic real world patterns
    const firstLegMs = flyingMs * 0.45;
    const secondLegMs = flyingMs * 0.55;

    const firstLegArrival = new Date(segmentStart.getTime() + firstLegMs);
    const secondLegDeparture = new Date(firstLegArrival.getTime() + layoverMs);

    // Leg 1: Origin -> Transit
    legs.push({
      total_time: Math.floor(firstLegMs / 60000),
      departure_time: segmentStart.toISOString(),
      arrival_time: firstLegArrival.toISOString(),
      departure_code: originCode,
      arrival_code: transitAirport,
      cabin_class: cabinClass,
    });

    // Leg 2: Transit -> Destination
    legs.push({
      total_time: Math.floor(secondLegMs / 60000),
      departure_time: secondLegDeparture.toISOString(),
      arrival_time: segmentEnd.toISOString(),
      departure_code: transitAirport,
      arrival_code: destinationCode,
      cabin_class: cabinClass,
    });
  }

  return legs;
}

function populateFakeTravelerPrice() {
  return [
    { traveler_reference: "1", traveler_type: "ADULT" },
    { traveler_reference: "2", traveler_type: "CHILD" },
    { traveler_reference: "3", traveler_type: "INFANT" },
  ];
}

/**
 * A database **transaction** refers to a sequence of read/write operations
 * that are guaranteed to either succeed or fail as a whole
 */

// // this to use to clear all data - soft reset
async function clearDatabase() {
  console.info("Emptying database...");

  // The order matters! Delete children before parents.
  // We use a transaction to ensure everything is cleared or nothing is.
  await prisma.$transaction([
    prisma.legs.deleteMany(),
    prisma.segment.deleteMany(),
    prisma.travelerPrice.deleteMany(),
    prisma.priceBreakdown.deleteMany(),
    prisma.flightOffers.deleteMany(),
    prisma.stop.deleteMany(),
    prisma.airlines.deleteMany(),
    prisma.minPrice.deleteMany(),
    prisma.flightTimes.deleteMany(),
    prisma.data.deleteMany(), // The main parent
    prisma.airport.deleteMany(),
  ]);

  console.info("Database cleared! ✨");
}

async function clearStaleData() {
  try {
    const now = new Date();
    const bufferTime = new Date(now.getTime() - 30 * 60 * 1000); //30 mins ago
    const MAX_FLIGHTS = 1500;

    console.info("🧹 Maintenance started...");

    // --- PART 1: DELETE TRULY STALE DATA (In the past) ---
    const staleDelete = await prisma.data.deleteMany({
      where: {
        flight_offers: {
          some: {
            segments: {
              some: {
                departure_time: {
                  lt: bufferTime, // Use Date object directly
                },
              },
            },
          },
        },
      },
    });

    if (staleDelete.count > 0) {
      console.info(`✅ Removed ${staleDelete.count} expired flights.`);
    }

    // --- PART 2: ROTATE FUTURE DATA IF FULL ---
    const currentCount = await prisma.data.count();

    if (currentCount >= MAX_FLIGHTS) {
      console.info(
        `⚠️ Capacity reached (${currentCount}/${MAX_FLIGHTS}). Rotating data...`,
      );

      // Find the IDs of the 200 flights based on the oldest flights created
      const flightsToRotate = await prisma.data.findMany({
        take: 500,
        orderBy: {
          createdAt: "asc", // "asc" puts the oldest timestamps at the top
        },
        select: { id: true },
      });

      await prisma.data.deleteMany({
        where: { id: { in: flightsToRotate.map((f) => f.id) } },
      });

      console.info(
        "♻️ Deleted 200 soonest flights to make room for new generation.",
      );
      return true; // Now returns true so main() can add new ones
    }

    return true;
  } catch (error) {
    console.error("❌ Error during stale data cleanup:", error);
    return false; // Return false to signal main() to skip generation
  }
}

// Add this helper to determine trip distribution
// 60% of generated offers will be round-trips

async function main() {
  const isHealthyAndHasRoom = await clearStaleData();
  if (!isHealthyAndHasRoom) return;

  const fakeAirports = populateFakeAirports();
  const currentFlightAirlines = populateFakeAirlines();
  const cabinClasses = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];

  console.info("Launching multi-day seed process...");

  const createdAirports = [];
  for (const airport of fakeAirports) {
    const created = await prisma.airport.upsert({
      where: { airport_code: airport.code },
      update: {
        airport_name: airport.name,
        city: airport.city,
        country: airport.country,
        image_url: airport.imageUrl,
      },
      create: {
        airport_code: airport.code,
        airport_name: airport.name,
        city: airport.city,
        country: airport.country,
        image_url: airport.imageUrl,
      },
    });
    createdAirports.push(created);
  }

  // Pick route
  const [depAirport, arrAirport] = faker.helpers.arrayElements(
    createdAirports,
    2,
  );
  const allAvailableCodes = createdAirports.map((a) => a.airport_code);

  const latestSegment = await prisma.segment.findFirst({
    orderBy: { departure_time: "desc" },
    select: { departure_time: true },
  });

  const today = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);

  let startDate = new Date();
  if (latestSegment) {
    const lastDate = new Date(latestSegment.departure_time);
    if (lastDate >= ninetyDaysFromNow) {
      console.info("✅ 90-day window is already full.");
      return;
    }
    startDate = new Date(lastDate);
    startDate.setDate(lastDate.getDate() + 1);
  }

  const diffTime = ninetyDaysFromNow.getTime() - startDate.getTime();
  const daysToGenerate = Math.max(
    0,
    Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
  );

  if (daysToGenerate === 0) return;

  for (let day = 0; day < daysToGenerate; day++) {
    const flightDate = new Date(startDate.getTime());
    flightDate.setDate(flightDate.getDate() + day);
    console.info(
      `📅 Processing Day ${day + 1}/${daysToGenerate}: ${flightDate.toDateString()}`,
    );

    await prisma.$transaction(
      async (tx) => {
        const createdData = await tx.data.create({
          data: {
            duration_min: 0,
            duration_max: 0,
            cabin_class: "Mixed",
          },
        });

        let globalMinDuration = 9999;
        let globalMaxDuration = 0;
        let absoluteCheapestPrice = 999999;
        let shortLayoverCount = 0;

        // FIX 1: Explicitly type durationStats to avoid 'any[]' error
        const durationStats: { min: number; max: number }[] = [];

        const numSchedules = faker.number.int({ min: 10, max: 15 });

        for (let i = 0; i < numSchedules; i++) {
          const isRoundTrip = Math.random() < 0.6;

          const outbound = populateFakeSegments(
            flightDate,
            depAirport.airport_code,
            arrAirport.airport_code,
          );
          let inbound = null;

          if (isRoundTrip) {
            const returnDate = new Date(flightDate);
            returnDate.setDate(
              returnDate.getDate() + faker.number.int({ min: 2, max: 10 }),
            );
            inbound = populateFakeSegments(
              returnDate,
              arrAirport.airport_code,
              depAirport.airport_code,
            );
          }

          // Stats tracking
          const outboundDuration = outbound.total_time;
          durationStats.push({
            min: outboundDuration,
            max: outboundDuration + 15,
          });

          if (outboundDuration < globalMinDuration)
            globalMinDuration = outboundDuration;
          if (outboundDuration > globalMaxDuration)
            globalMaxDuration = outboundDuration;

          const depHour = outbound.departure_time.getUTCHours();
          const timeMult = depHour >= 10 && depHour <= 17 ? 1.1 : 0.8;

          for (const cabin of cabinClasses) {
            const config = CABIN_CONFIGS[cabin];
            const sharedTravelerData = populateFakeTravelerPrice();
            const routeBaseAmount =
              faker.number.int({ min: 100, max: 300 }) *
              config.multiplier *
              timeMult;
            const finalBaseAmount = isRoundTrip
              ? routeBaseAmount * 1.8
              : routeBaseAmount;

            const offer = await tx.flightOffers.create({
              data: {
                flight_offer_id: createdData.id,
                token: faker.string.nanoid(60),
                flight_key: faker.string.uuid(),
                seat_availability: {
                  create: {
                    seats_left: faker.number.int({ min: 1, max: config.seats }),
                  },
                },
                branded_fareinfo: {
                  create: {
                    cabin_class: cabin,
                    features: {
                      create: [
                        {
                          feature_name: "WIFI",
                          category: "AMENITIES",
                          availability:
                            cabin === "Business" ? "INCLUDED" : cabin === "First Class" ? "INCLUDED" : "OPTIONAL",
                        },
                        {
                          feature_name: "MEAL",
                          category: "DINING",
                          availability: "INCLUDED",
                        },
                        {
                          feature_name: "SEAT TYPE",
                          category: "SEAT & SPACE",
                          availability: 
                            cabin === "Economy" ? "STANDARD" : cabin === "Premium Economy" ? "WIDE" : cabin === "Business" ? "LIE-FLAT" : "FULLY-RECLINED"
                        },
                        {
                          feature_name: "CONNECTIVITY",
                          category: "USB PORT & CONNECTIVITY",
                          availability: 
                            cabin === "Business" ? "INCLUDED" : cabin === "First Class" ? "INCLUDED" : "OPTIONAL"
                        },
                      ],
                    },
                  },
                },
                segments: {
                  create: [
                  // Outbound flight
                    {
                      departure_airport_code: outbound.departure_airport_code,
                      arrival_airport_code: outbound.arrival_airport_code,
                      total_time: outbound.total_time,
                      departure_time: outbound.departure_time_iso,
                      arrival_time: outbound.arrival_time_iso,
                      legs: {
                        create: populateFakeLegsData(
                          outbound.departure_time,
                          outbound.arrival_time,
                          cabin,
                          depAirport.airport_code,
                          arrAirport.airport_code,
                          allAvailableCodes,
                        ).map((leg) => ({
                          departure_airport_code: leg.departure_code,
                          arrival_airport_code: leg.arrival_code,
                          departure_time: leg.departure_time,
                          arrival_time: leg.arrival_time,
                          cabin_class: leg.cabin_class,
                          total_time: leg.total_time,
                        })),
                      },
                    },
                  // Inbound flight
                    ...(inbound
                      ? [
                          {
                            departure_airport_code:
                              inbound.departure_airport_code,
                            arrival_airport_code: inbound.arrival_airport_code,
                            total_time: inbound.total_time,
                            departure_time: inbound.departure_time_iso,
                            arrival_time: inbound.arrival_time_iso,
                            legs: {
                              create: populateFakeLegsData(
                                inbound.departure_time,
                                inbound.arrival_time,
                                cabin,
                                arrAirport.airport_code,
                                depAirport.airport_code,
                                allAvailableCodes,
                              ).map((leg) => ({
                                departure_airport_code: leg.departure_code,
                                arrival_airport_code: leg.arrival_code,
                                departure_time: leg.departure_time,
                                arrival_time: leg.arrival_time,
                                cabin_class: leg.cabin_class,
                                total_time: leg.total_time,
                              })),
                            },
                          },
                        ]
                      : []),
                  ],
                },
                traveler_price: {
                  create: sharedTravelerData.map((t) => ({
                    traveler_reference: t.traveler_reference,
                    traveler_type: t.traveler_type,
                  })),
                },
              },
              include: {
                traveler_price: true,
                segments: { include: { legs: true } },
              },
            });

            await tx.baggage.create({
              data: {
                baggage_id: createdData.id,
                type: "CHECKED",
                included: true,
                weight: cabin === 'Economy' ? 23 : 32,
                count: config.baggage,
                param_name: 'kg'
              },
            });

            await tx.baggage.create({
              data: {
                baggage_id: createdData.id,
                type: "CARRY_ON",
                included: true,
                weight: cabin === "Economy" ? 7 : 10,
                count: config.baggage,
                param_name: "kg",
              },
            });

            // 4. PRICE BREAKDOWN LOGIC
            let mainAdultTotal = 0;
            let mainAdultBase = 0;
            let mainAdultTax = 0;

            for (const tp of offer.traveler_price) {
              const typeMult =
                tp.traveler_type === "CHILD"
                  ? 0.8
                  : tp.traveler_type === "INFANT"
                    ? 0.15
                    : 1.0;
              const base = Math.floor(finalBaseAmount * typeMult);
              const tax = Math.floor(base * 0.15);
              const total = base + tax;

              if (tp.traveler_type === "ADULT") {
                mainAdultTotal = total;
                mainAdultBase = base;
                mainAdultTax = tax;
              }

              const tpPB = await tx.priceBreakdown.create({
                data: {
                  total: { create: { currency_code: "USD", amount: total } },
                  base_fare: { create: { currency_code: "USD", amount: base } },
                  tax: { create: { currency_code: "USD", amount: tax } },
                  discount: { create: { currency_code: "USD", amount: 0 } },
                },
              });

              await tx.travelerPrice.update({
                where: { id: tp.id },
                data: { price_id: tpPB.id },
              });
            }

            const offerPB = await tx.priceBreakdown.create({
              data: {
                total: {
                  create: { currency_code: "USD", amount: mainAdultTotal },
                },
                base_fare: {
                  create: { currency_code: "USD", amount: mainAdultBase },
                },
                tax: { create: { currency_code: "USD", amount: mainAdultTax } },
                discount: { create: { currency_code: "USD", amount: 0 } },
              },
            });

            await tx.flightOffers.update({
              where: { id: offer.id },
              data: { price_id: offerPB.id },
            });

            if (mainAdultTotal < absoluteCheapestPrice)
              absoluteCheapestPrice = mainAdultTotal;

            // 5. CARRIER & FLIGHT INFO
            for (const segment of offer.segments) {
              for (const leg of segment.legs) {
                const airline =
                  currentFlightAirlines[i % currentFlightAirlines.length];
                const digits = faker.airline.flightNumber({ length: 3 });

                const currentLegArrival = new Date(leg.arrival_time).getTime();
                const nextLegDeparture = new Date(leg.departure_time).getTime();

                const layoverMinutes =
                  (nextLegDeparture - currentLegArrival) / (1000 * 60);

                // If layover is less than 60 minutes, we count it as a "Short Layover"
                if (layoverMinutes > 0 && layoverMinutes < 60) {
                  shortLayoverCount++;
                }

                await tx.carriers.create({
                  data: {
                    carrier_id: leg.id,
                    name: airline.name,
                    logo: airline.logo,
                    code: airline.iata_code,
                  },
                });
                await tx.flightInfo.create({
                  data: {
                    flight_info_id: leg.id,
                    flight_number: `${airline.iata_code}${digits}`,
                  },
                });
              }
            }
          }
        }

        // 6. FINALIZING METADATA
        await tx.data.update({
          where: { id: createdData.id },
          data: {
            duration_min: globalMinDuration,
            duration_max: globalMaxDuration,
          },
        });

        await tx.shortLayoverConnection.create({
          data: {
            layover_id: createdData.id,
            count: shortLayoverCount,
          },
        });

        await tx.minPrice.create({
          data: {
            min_price_data_id: createdData.id,
            amount: absoluteCheapestPrice,
            currency_code: "USD",
          },
        });

        await tx.duration.createMany({
          data: durationStats.map((d) => ({
            ...d,
            duration_id: createdData.id,
          })),
        });

        // Add other summary items (Stops, etc.) 
        await tx.departureInterval.create({
          data: { interval_id: createdData.id, start: "06:00", end: "23:00" },
        });

        const flightTimes = await tx.flightTimes.create({
          data: { flight_times_id: createdData.id },
        });
        await tx.depart.create({
          data: { depart_id: flightTimes.id, start: "06:00", end: "23:00" },
        });
        await tx.arrival.create({
          data: { arrival_id: flightTimes.id, start: "08:00", end: "02:00" },
        });

        await tx.stop.create({
          data: { stop_id: createdData.id, no_of_stops: 0, count: 1 },
        });

        for (const air of currentFlightAirlines) {
          await tx.airlines.create({
            data: { airline_id: createdData.id, ...air },
          });
        }
      },
      { timeout: 90000 },
    );
  }
}

//automate flight data creation every day at every 1 hour
async function runFlightDataCreateAutomation() {
  const startTime = new Date();
  console.info(
    `Flight data creation automation started at ${startTime.toLocaleString()}`,
  );
  try {
    await main();
    const endTime = new Date();
    console.info(
      `Flight data creation automation ended at ${endTime.toLocaleString()}`,
    );
  } catch (error) {
    console.error(
      `❌ Flight data creation automation failed: ${error} on ${new Date().toLocaleString()}`,
    );
  }
}

runFlightDataCreateAutomation();
console.info(
  "⏳ Flight Data Automation is running. Waiting for the next scheduled hour...",
);

/**
 * 0 * * * * ---> Schedule flight data creation automation to run every hour.
 * The "Traffic Jam" Problem
Without this lock, if your 4:00 PM task takes 65 minutes to finish, the 5:00 PM task will start while the first one is still writing to the database.

This causes:

Database Deadlocks: Two processes trying to update the same row at once.

CPU Spikes: Your laptop struggling to run two heavy seeding processes simultaneously.

Data Corruption: Potentially creating duplicate records because the second run doesn't realize the first run hasn't finished yet.
 */

let isRunning = false; // that is why adding a lock to prevent overlapping runs

cron.schedule("0 * * * *", async () => {
  if (isRunning) {
    console.warn("⚠️ Automation skipped: Previous run is still in progress.");
    return;
  }

  isRunning = true;
  try {
    await runFlightDataCreateAutomation();
  } catch (err) {
    console.error("CRITICAL CRON ERROR:", err);
  } finally {
    isRunning = false; // Always release the lock
  }
});
