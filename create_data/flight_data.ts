// import { CarrierDataProps } from "@/types/flight_type";
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
 * The flight day creates like 4 - 5 offers of different flight times for each cabin classes
 */

//helper function to calculate price multipliers and baggage allowance based on cabin class
const CABIN_CONFIGS: Record<
  string,
  { multiplier: number; baggage: number; seats: number }
> = {
  Economy: { multiplier: 1.0, baggage: 1, seats: 20 },
  "Premium Economy": { multiplier: 1.6, baggage: 2, seats: 12 },
  Business: { multiplier: 3.8, baggage: 3, seats: 8 },
  "First Class": { multiplier: 7.0, baggage: 3, seats: 4 },
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
  windowStart: Date,
  windowEnd: Date,
  tripType: string,
) {
  // 1. Generate a random date between start and end
  const rawOutboundDate = faker.date.between({
    from: windowStart,
    to: windowEnd,
  });

  const randomHour = faker.number.int({ min: 6, max: 22 });
  const randomMinute = faker.helpers.arrayElement([0, 15, 30, 45]);

  const departureTime = new Date(
    Date.UTC(
      rawOutboundDate.getUTCFullYear(),
      rawOutboundDate.getUTCMonth(),
      rawOutboundDate.getUTCDate(),
      randomHour,
      randomMinute,
      0,
    ),
  );

  const outboundDuration = faker.number.int({ min: 90, max: 720 });
  const arrivalTime = new Date(
    departureTime.getTime() + outboundDuration * 60 * 1000,
  );

  const segments = [
    {
      total_time: outboundDuration,
      departure_time: departureTime,
      arrival_time: arrivalTime,
      departure_time_iso: departureTime.toISOString(),
      arrival_time_iso: arrivalTime.toISOString(),
    },
  ];

  // 2. If it's a round-trip, add the return segment
  if (tripType === "round-trip") {
    const stayDays = faker.number.int({ min: 1, max: 40 });

    // Calculate Return Departure based on the Outbound Arrival
    const rawReturnDate = new Date(
      arrivalTime.getTime() + stayDays * 24 * 60 * 60 * 1000,
    );

    // NORMALIZE: Force the return flight to 12:00 PM UTC as well
    const returnDeparture = new Date(
      Date.UTC(
        rawReturnDate.getUTCFullYear(),
        rawReturnDate.getUTCMonth(),
        rawReturnDate.getUTCDate(),
        12,
        0,
        0,
      ),
    );

    const returnDuration = faker.number.int({ min: 90, max: 720 });
    const returnArrival = new Date(
      returnDeparture.getTime() + returnDuration * 60 * 1000,
    );

    segments.push({
      total_time: returnDuration,
      departure_time: returnDeparture,
      arrival_time: returnArrival,
      departure_time_iso: returnDeparture.toISOString(),
      arrival_time_iso: returnArrival.toISOString(),
    });
  }

  return segments;
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
  const possibleHubs = validAirportCodes.filter(
    (code) => code !== originCode && code !== destinationCode,
  );

  // 2. Decide numLegs:
  // If we have no hubs, it MUST be 1.
  // If we have hubs, randomly choose 1 or 2.
  const numLegs =
    possibleHubs.length > 0 ? faker.number.int({ min: 1, max: 2 }) : 1;

  const legs = [];
  const totalSegmentMs = segmentEnd.getTime() - segmentStart.getTime();

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

    const layoverMs = faker.number.int({ min: 60, max: 150 }) * 60 * 1000;
    const flyingMs = totalSegmentMs - layoverMs;
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
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const travelerReference = faker.number.int({ min: 1, max: 5 });
    const travelerType = faker.helpers.arrayElement([
      "adult",
      "child",
      "infant",
    ]);
    return {
      traveler_reference: travelerReference.toString(),
      traveler_type: travelerType.toUpperCase(),
    };
  });
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
  const now = new Date();
  const bufferTime = new Date(now.getTime() - 30 * 60 * 1000);
  const MAX_FLIGHTS = 50;

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

    // Find the IDs of the 10 flights departing soonest
    // We sort by departure_time ASC to get the ones closest to 'now'
    const flightsToRotate = await prisma.data.findMany({
      take: 10,
      orderBy: {
        flight_offers: {
          _count: "desc", // This is just a placeholder if you can't sort by nested departure_time
        },
      },
      // Better way: If your schema allows, find flights with the earliest segment departure
      select: { id: true },
    });

    await prisma.data.deleteMany({
      where: { id: { in: flightsToRotate.map((f) => f.id) } },
    });

    console.info(
      "♻️ Deleted 10 soonest flights to make room for new generation.",
    );
    return true; // Now returns true so main() can add new ones
  }

  return true;
}

async function main() {
  const isHealthyAndHasRoom = await clearStaleData();
  if (!isHealthyAndHasRoom) return;

  const fakeAirports = populateFakeAirports();
  console.info("🚀 Launching full-schema seed process...");

  await prisma.$transaction(
    async (tx) => {
      // 1. AIRPORTS SETUP
      const createdAirports = [];
      for (const airport of fakeAirports) {
        const created = await tx.airport.upsert({
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

      const [depAirport, arrAirport] = faker.helpers.arrayElements(
        createdAirports,
        2,
      );
      const allAvailableCodes = createdAirports.map((a) => a.airport_code);
      const masterTripType = faker.helpers.arrayElement([
        "one-way",
        "round-trip",
      ]);
      const cabinClasses = [
        "Economy",
        "Premium Economy",
        "Business",
        "First Class",
      ];
      const currentFlightAirlines = populateFakeAirlines();

      // 2. CREATE THE PARENT SEARCH RESULT (DATA)
      const createdData = await tx.data.create({
        data: {
          duration_min: 0,
          duration_max: 0,
          cabin_class: "Mixed",
        },
      });

      let globalMinDuration = 9999;
      let globalMaxDuration = 0;
      const durationStats: { min: number; max: number }[] = [];
      let absoluteCheapestPrice = 999999;

      let shortLayoverCount = 0;

      // 3. GENERATE 4-5 UNIQUE FLIGHT TIMES (SCHEDULES)
      const numSchedules = faker.number.int({ min: 4, max: 5 });

      for (let i = 0; i < numSchedules; i++) {
        const searchStart = new Date();
        searchStart.setHours(
          6 + i * 3,
          faker.helpers.arrayElement([0, 30]),
          0,
          0,
        );
        const searchEnd = new Date(searchStart);
        searchEnd.setMonth(searchStart.getMonth() + 1);

        const flightSchedule = populateFakeSegments(
          searchStart,
          searchEnd,
          masterTripType,
        );
        const totalTravelTime = flightSchedule.reduce(
          (sum, seg) => sum + seg.total_time,
          0,
        );

        durationStats.push({ min: totalTravelTime, max: totalTravelTime + 20 });
        if (totalTravelTime < globalMinDuration)
          globalMinDuration = totalTravelTime;
        if (totalTravelTime > globalMaxDuration)
          globalMaxDuration = totalTravelTime;

        // 4. FOR EACH TIME SLOT, CREATE 4 CABIN CLASSES
        for (const cabin of cabinClasses) {
          const config = CABIN_CONFIGS[cabin];
          const sharedTravelerData = populateFakeTravelerPrice();

          const timeMult =
            searchStart.getHours() >= 10 && searchStart.getHours() <= 17
              ? 1.25
              : 0.9;
          const routeBaseAmount =
            faker.number.int({ min: 200, max: 450 }) *
            config.multiplier *
            timeMult;

          const offer = await tx.flightOffers.create({
            data: {
              flight_offer_id: createdData.id,
              token: faker.string.nanoid(60),
              trip_type: masterTripType,
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
                          cabin === "Business" ? "INCLUDED" : "OPTIONAL",
                      },
                      {
                        feature_name: "MEAL",
                        category: "DINING",
                        availability: "INCLUDED",
                      },
                    ],
                  },
                },
              },
              segments: {
                create: flightSchedule.map((segment, idx) => {
                  const isReturn = idx === 1;
                  const sDep = isReturn
                    ? arrAirport.airport_code
                    : depAirport.airport_code;
                  const sArr = isReturn
                    ? depAirport.airport_code
                    : arrAirport.airport_code;
                  return {
                    departure_airport_code: sDep,
                    arrival_airport_code: sArr,
                    departure_time: segment.departure_time_iso,
                    arrival_time: segment.arrival_time_iso,
                    total_time: segment.total_time,
                    legs: {
                      create: populateFakeLegsData(
                        segment.departure_time,
                        segment.arrival_time,
                        cabin,
                        sDep,
                        sArr,
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
                  };
                }),
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

          // 5. PRICE BREAKDOWN
          let offerTotal = 0;
          for (const tp of offer.traveler_price) {
            const typeMult =
              tp.traveler_type === "CHILD"
                ? 0.8
                : tp.traveler_type === "INFANT"
                  ? 0.15
                  : 1.0;
            const base = Math.floor(routeBaseAmount * typeMult);
            const tax = Math.floor(base * 0.15);
            const total = base + tax;
            offerTotal += total;

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
              total: { create: { currency_code: "USD", amount: offerTotal } },
              base_fare: {
                create: {
                  currency_code: "USD",
                  amount: Math.floor(offerTotal * 0.85),
                },
              },
              tax: {
                create: {
                  currency_code: "USD",
                  amount: Math.floor(offerTotal * 0.15),
                },
              },
              discount: { create: { currency_code: "USD", amount: 0 } },
            },
          });
          await tx.flightOffers.update({
            where: { id: offer.id },
            data: { price_id: offerPB.id },
          });

          if (offerTotal < absoluteCheapestPrice)
            absoluteCheapestPrice = offerTotal;

          // 6. CARRIERS & REALISTIC FLIGHT NUMBERS
          for (const segment of offer.segments) {
            for (const leg of segment.legs) {
              const airline =
                currentFlightAirlines[i % currentFlightAirlines.length];
              
              const digits = faker.airline.flightNumber({ length: 3 });

              const currentLegArrival = new Date(
                leg.arrival_time,
              ).getTime();
              const nextLegDeparture = new Date(
                leg.departure_time,
              ).getTime();

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

      // 7. FINALIZING SCHEMA METADATA
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
        data: durationStats.map((d) => ({ ...d, duration_id: createdData.id })),
      });

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

      await tx.baggage.create({
        data: {
          baggage_id: createdData.id,
          type: "CHECKED",
          included: true,
          weight: 23,
        },
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
    { timeout: 120000 },
  );

  console.info(
    "🎉 Seed complete! Your database is now production-ready for testing.",
  );
}

// main()
//   .then(async () => {
//     console.info("creation successfully");
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error("An error occurred during creation: ", e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

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
 */

// cron.schedule("0 * * * *", () => {
//   runFlightDataCreateAutomation();
// });

let isRunning = false; // adding a lock to prevent overlapping runs

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
