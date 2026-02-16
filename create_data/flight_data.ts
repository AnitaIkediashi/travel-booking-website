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

function populateFakeFlightNumber() {
  return {
    flight_number: faker.airline.flightNumber({
      addLeadingZeros: true,
      length: 2,
    }),
  };
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
  console.info("🌱 Starting deep-seed of multi-schedule flight data...");

  await prisma.$transaction(
    async (tx) => {
      // 1. SETUP AIRPORTS
      const createdAirports = [];
      for (const airport of fakeAirports) {
        const created = await tx.airport.upsert({
          where: { airport_code: airport.code },
          update: {
            airport_name: airport.name,
            image_url: airport.imageUrl,
            city: airport.city,
            country: airport.country,
          },
          create: {
            airport_code: airport.code,
            airport_name: airport.name,
            image_url: airport.imageUrl,
            city: airport.city,
            country: airport.country,
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

      // 2. CREATE THE MAIN DATA RECORD
      // We create the parent first so we can link everything to it
      const createdData = await tx.data.create({
        data: {
          duration_min: 0, // Will update or calculate based on offers
          duration_max: 0,
          cabin_class: "Mixed",
        },
      });

      let globalMinDuration = 9999;
      let globalMaxDuration = 0;
      const currentFlightAirlines = populateFakeAirlines();
      const flightNumberBase = populateFakeFlightNumber().flight_number;

      // 3. LOOP: CREATE 4 TO 5 DIFFERENT TIME SLOTS (THE "PLANES")
      const numSchedules = faker.number.int({ min: 4, max: 5 });

      for (let i = 0; i < numSchedules; i++) {
        // Create a unique time for this specific flight schedule
        // Flight 1 at 6am, Flight 2 at 10am, etc.
        const searchStart = new Date();
        searchStart.setHours(
          6 + i * 4,
          faker.helpers.arrayElement([0, 30]),
          0,
          0,
        );
        const searchEnd = new Date(searchStart);
        searchEnd.setMonth(searchStart.getMonth() + 2);

        const flightSchedule = populateFakeSegments(
          searchStart,
          searchEnd,
          masterTripType,
        );

        const outboundDuration = flightSchedule[0].total_time;
        if (outboundDuration < globalMinDuration)
          globalMinDuration = outboundDuration;
        if (outboundDuration > globalMaxDuration)
          globalMaxDuration = outboundDuration;

        // 4. LOOP: CREATE ALL CABIN CLASSES FOR THIS SPECIFIC TIME
        for (const cabin of cabinClasses) {
          const config = CABIN_CONFIGS[cabin];
          const sharedTravelerData = populateFakeTravelerPrice();

          // Price Multiplier based on Time: Mid-day flights (10am-4pm) are 20% more expensive
          const depHour = searchStart.getHours();
          const timeMultiplier = depHour >= 10 && depHour <= 16 ? 1.2 : 0.9;
          const routeBaseAmount =
            faker.number.int({ min: 150, max: 350 }) *
            config.multiplier *
            timeMultiplier *
            (masterTripType === "round-trip" ? 1.8 : 1.0);

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
                        feature_name: "CHECKED_BAGGAGE",
                        category: "BAGGAGE",
                        availability:
                          config.baggage > 0 ? "INCLUDED" : "NOT_INCLUDED",
                      },
                      {
                        feature_name: "WI-FI",
                        category: "AMENITIES",
                        availability:
                          cabin === "Business" ? "INCLUDED" : "OPTIONAL",
                      },
                    ],
                  },
                },
              },
              segments: {
                create: flightSchedule.map((segment, idx) => {
                  const isReturn = idx === 1;
                  const segDep = isReturn
                    ? arrAirport.airport_code
                    : depAirport.airport_code;
                  const segArr = isReturn
                    ? depAirport.airport_code
                    : arrAirport.airport_code;

                  return {
                    departure_airports: { connect: { airport_code: segDep } },
                    arrival_airports: { connect: { airport_code: segArr } },
                    departure_time: segment.departure_time_iso,
                    arrival_time: segment.arrival_time_iso,
                    total_time: segment.total_time,
                    legs: {
                      create: populateFakeLegsData(
                        segment.departure_time,
                        segment.arrival_time,
                        cabin,
                        segDep,
                        segArr,
                        allAvailableCodes,
                      ).map((leg) => ({
                        departure_airport: {
                          connect: { airport_code: leg.departure_code },
                        },
                        arrival_airport: {
                          connect: { airport_code: leg.arrival_code },
                        },
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

          // 5. HANDLE PRICING BREAKDOWN (Calculated per Traveler)
          let offerTotalAmount = 0;
          let offerTotalBase = 0;
          let offerTotalTax = 0;

          for (const tp of offer.traveler_price) {
            const typeMult =
              tp.traveler_type === "CHILD"
                ? 0.75
                : tp.traveler_type === "INFANT"
                  ? 0.1
                  : 1.0;
            const finalBase = Math.floor(routeBaseAmount * typeMult);
            const finalTax = Math.floor(finalBase * 0.15);
            const finalTotal = finalBase + finalTax;

            offerTotalBase += finalBase;
            offerTotalTax += finalTax;
            offerTotalAmount += finalTotal;

            const tpPB = await tx.priceBreakdown.create({
              data: {
                total: { create: { currency_code: "USD", amount: finalTotal } },
                base_fare: {
                  create: { currency_code: "USD", amount: finalBase },
                },
                tax: { create: { currency_code: "USD", amount: finalTax } },
                discount: { create: { currency_code: "USD", amount: 0 } },
              },
            });
            await tx.travelerPrice.update({
              where: { id: tp.id },
              data: { price_id: tpPB.id },
            });
          }

          // Finalize Offer Price
          const offerPB = await tx.priceBreakdown.create({
            data: {
              total: {
                create: { currency_code: "USD", amount: offerTotalAmount },
              },
              base_fare: {
                create: { currency_code: "USD", amount: offerTotalBase },
              },
              tax: { create: { currency_code: "USD", amount: offerTotalTax } },
              discount: { create: { currency_code: "USD", amount: 0 } },
            },
          });
          await tx.flightOffers.update({
            where: { id: offer.id },
            data: { price_id: offerPB.id },
          });

          // 6. CARRIERS & STOPS (The metadata)
          for (const segment of offer.segments) {
            for (const leg of segment.legs) {
              const airline =
                currentFlightAirlines[i % currentFlightAirlines.length];
              await tx.carriers.create({
                data: {
                  carrier_id: leg.id,
                  name: airline.name,
                  logo: airline.logo,
                  code: airline.iata_code,
                },
              });
              const fInfo = await tx.flightInfo.create({
                data: {
                  flight_info_id: leg.id,
                  flight_number: flightNumberBase,
                },
              });
              await tx.carrierInfo.create({
                data: {
                  operating_carrier: airline.name,
                  carrier_info_id: fInfo.id,
                },
              });
            }
          }
        }
      }

      // 7. FINALIZE PARENT METADATA
      await tx.data.update({
        where: { id: createdData.id },
        data: {
          duration_min: globalMinDuration,
          duration_max: globalMaxDuration,
        },
      });

      // Add Stop count info for filters
      await tx.stop.create({
        data: {
          no_of_stops: faker.number.int({ min: 0, max: 1 }),
          count: 1,
          stop_id: createdData.id,
        },
      });
    },
    { timeout: 90000 },
  );

  console.info("✅ Multi-schedule seeding completed successfully.");
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
