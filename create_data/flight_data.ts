import { CarrierDataProps } from "@/types/flight_type";
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

function populateFakeDepartureIntervals() {
  return Array.from({ length: faker.number.int({ min: 2, max: 3 }) }, () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    };
    const currentTime = new Date();
    const startTime = new Date(currentTime);
    startTime.setHours(0, 0, 0, 0); // set to start of the day
    const endTime = new Date(currentTime);
    endTime.setHours(23, 59, 59, 999); // set to end of the day
    const temp_start = faker.date.between({ from: startTime, to: endTime });

    const start = temp_start.toLocaleTimeString("en-US", options);
    const temp_end = faker.date.between({ from: temp_start, to: endTime });
    const end = temp_end.toLocaleTimeString("en-US", options);

    return {
      start: start,
      end: end,
    };
  });
}

function populateFakeShortLayover() {
  return {
    count: faker.number.int({ min: 1, max: 3 }),
  };
}

function populateFakeMinPrice() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 100, max: 3000 }),
  };
}

function populateFakeBaggage() {
  const baggageTypeArray = ["cabin", "checked", "personal"];
  const paramNamesArray = [
    "includedBaggage",
    "optionalBaggage",
    "personalItem",
  ];
  const includedBaggage = [true, false];

  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const count = faker.number.int({ min: 5, max: 30 });
    const baggageType =
      count <= 10
        ? baggageTypeArray[0]
        : count <= 20
          ? baggageTypeArray[1]
          : baggageTypeArray[2];
    const paramName = faker.helpers.arrayElement(paramNamesArray);
    const isIncluded = faker.helpers.arrayElement(includedBaggage);
    return {
      param_name: paramName,
      weight: count,
      type: baggageType.toUpperCase(),
      included: isIncluded,
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

function populateFakeDuration() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const min = faker.number.int({ min: 60, max: 300 });
    const max = min + faker.number.int({ min: 30, max: 180 });

    return {
      min: min,
      max: max,
    };
  });
}

function populateFakeArrivalData() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    };
    const currentTime = new Date();
    const startTime = new Date(currentTime);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(currentTime);
    endTime.setHours(23, 59, 59, 999);
    const temp_start = faker.date.between({ from: startTime, to: endTime });

    const start = temp_start.toLocaleTimeString("en-US", options);
    const temp_end = faker.date.between({ from: temp_start, to: endTime });
    const end = temp_end.toLocaleTimeString("en-US", options);

    return {
      start: start,
      end: end,
    };
  });
}

function populateFakeDepartData() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    };
    const currentTime = new Date();
    const startTime = new Date(currentTime);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(currentTime);
    endTime.setHours(23, 59, 59, 999);
    const temp_start = faker.date.between({ from: startTime, to: endTime });

    const start = temp_start.toLocaleTimeString("en-US", options);
    const temp_end = faker.date.between({ from: temp_start, to: endTime });
    const end = temp_end.toLocaleTimeString("en-US", options);

    return {
      start: start,
      end: end,
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
  // 💡 Step 0: Clear the database before creating new data
  // console.info("Starting seed process...");

  //  1. Run maintenance (deletes stale data AND checks the count)
  const isHealthyAndHasRoom = await clearStaleData();

  //  2. Decide whether to proceed based on the result above
  if (!isHealthyAndHasRoom) {
    // If clearStaleData returned 'false', it means we reached the 50-flight limit.
    // We stop here.
    return;
  }
  const fakeAirports = populateFakeAirports();

  // await clearDatabase();

  console.info("🌱 Database has room. Generating new flight data...");

  // 3. Use Transaction for "All or Nothing" safety
  await prisma.$transaction(
    async (tx) => {
      // 4. Create fake Airports
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

      if (createdAirports.length < 2) {
        throw new Error("Not enough airports created for a valid flight path.");
      }

      // 5. Prepare Flight Data - only one data is generated for each flight searched

      const [depAirport, arrAirport] = faker.helpers.arrayElements(
        createdAirports,
        2,
      ); //select two airports

      const allAvailableCodes = createdAirports.map((a) => a.airport_code);

      // 5. Determine the Master Trip Type for this entire Flight Data record
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

      // create multiple flight schedules for the same route
      const schedulesToCreate = faker.number.int({ min: 3, max: 5 });
      for (let i = 0; i < schedulesToCreate; i++) {
        const fakeFlightNumber = populateFakeFlightNumber();
        // Define the 2-month window once
        const searchStart = new Date();
        const searchEnd = new Date();
        searchEnd.setMonth(searchStart.getMonth() + 2);

        const flightSchedule = populateFakeSegments(
          searchStart,
          searchEnd,
          masterTripType,
        );

        const allDurations = flightSchedule.map((s) => s.total_time);
        const duration_min = Math.min(...allDurations);
        const duration_max = Math.max(...allDurations);

        const sharedTravelerData = populateFakeTravelerPrice();

        const currentFlightAirlines = populateFakeAirlines();
        // 6. Create Main Data Record with non-multiplying nested relations
        const createdData = await tx.data.create({
          data: {
            duration_min,
            duration_max,
            cabin_class: "Mixed", // this is optional now
            flight_offers: {
              create: cabinClasses.map((cabin) => {
                const config = CABIN_CONFIGS[cabin];
                return {
                  token: faker.string.nanoid({ min: 40, max: 80 }),
                  trip_type: masterTripType,
                  flight_key: faker.string.uuid(),
                  seat_availability: {
                    create: {
                      seats_left: faker.number.int({
                        min: 1,
                        max: config.seats,
                      }),
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
                    create: flightSchedule.map((segment, index) => {
                      // --- AIRPORT SWAP LOGIC ---
                      // If index 0: Departure -> Arrival
                      // If index 1 (Return): Arrival -> Departure
                      const isReturn = index === 1;
                      const segDep = isReturn
                        ? arrAirport.airport_code
                        : depAirport.airport_code;
                      const segArr = isReturn
                        ? depAirport.airport_code
                        : arrAirport.airport_code;

                      return {
                        departure_airports: {
                          connect: { airport_code: segDep },
                        },
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
                    create: sharedTravelerData.map((traveler) => ({
                      traveler_reference: traveler.traveler_reference,
                      traveler_type: traveler.traveler_type,
                    })),
                  },
                };
              }),
            },
          },
          include: {
            flight_offers: {
              include: {
                segments: { include: { legs: true } },
                traveler_price: true,
                branded_fareinfo: true,
              },
            },
          },
        });

        // --- 8. POST-CREATION: UN-NESTED DATA LINKING ---

        const carriersToCreate: CarrierDataProps[] = [];
        let totalStopsForData = 0;

        for (const offer of createdData.flight_offers) {
          for (const [segIdx, segment] of offer.segments.entries()) {
            const segmentAirline =
              currentFlightAirlines[segIdx % currentFlightAirlines.length];

            // 2. Calculate actual stops (Legs - 1)
            totalStopsForData += segment.legs.length - 1;

            for (const leg of segment.legs) {
              carriersToCreate.push({
                carrier_id: leg.id,
                name: segmentAirline.name,
                logo: segmentAirline.logo,
                code: segmentAirline.iata_code,
              });

              const fInfo = await tx.flightInfo.create({
                data: {
                  flight_info_id: leg.id,
                  flight_number: fakeFlightNumber.flight_number,
                },
              });

              await tx.carrierInfo.create({
                data: {
                  operating_carrier: segmentAirline.name,
                  carrier_info_id: fInfo.id,
                },
              });
            }
          }
          // 1. Determine the "Adult" base price for this specific offer
          const cabinInfo =
            CABIN_CONFIGS[offer.branded_fareinfo?.cabin_class || "Economy"] ||
            CABIN_CONFIGS["Economy"];
          const isRoundTrip = offer.trip_type === "round-trip";
          const routeBaseAmount =
            faker.number.int({ min: 200, max: 500 }) *
            cabinInfo.multiplier *
            (isRoundTrip ? 1.8 : 1.0);

          // --- NEW: Track totals for the entire offer ---
          let offerTotalBase = 0;
          let offerTotalTax = 0;
          let offerTotalAmount = 0;

          // 2. Loop through each traveler in this offer
          for (const tp of offer.traveler_price) {
            let multiplier = 1.0; // Default for ADULT

            if (tp.traveler_type === "CHILD") multiplier = 0.75;
            if (tp.traveler_type === "INFANT") multiplier = 0.1;

            const finalBase = Math.floor(routeBaseAmount * multiplier);
            const finalTax = Math.floor(finalBase * 0.15);
            const finalTotal = finalBase + finalTax;

            // --- NEW: Accumulate the totals ---
            offerTotalBase += finalBase;
            offerTotalTax += finalTax;
            offerTotalAmount += finalTotal;

            // 3. Create a UNIQUE PriceBreakdown for THIS traveler
            const travelerPB = await tx.priceBreakdown.create({
              data: {
                total: { create: { currency_code: "USD", amount: finalTotal } },
                base_fare: {
                  create: { currency_code: "USD", amount: finalBase },
                },
                tax: { create: { currency_code: "USD", amount: finalTax } },
                discount: { create: { currency_code: "USD", amount: 0 } },
              },
            });

            // 4. Link this traveler to their specific price
            await tx.travelerPrice.update({
              where: { id: tp.id },
              data: { price_id: travelerPB.id },
            });
          }

          // --- 5. Create the TOTAL PriceBreakdown for the Flight Offer ---
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

          // 6. Link the entire offer to its combined price
          await tx.flightOffers.update({
            where: { id: offer.id },
            data: { price_id: offerPB.id },
          });
        }

        // --- C. EXECUTE BULK INSERTS ---

        // Sync the 'Stop' table with actual generated stops
        await tx.stop.create({
          data: {
            no_of_stops: totalStopsForData,
            count: faker.number.int({ min: 1, max: 10 }), // Statistical weight
            stop_id: createdData.id,
          },
        });

        const firstStop = await tx.stop.findFirst({
          where: { stop_id: createdData.id },
        });

        // Use the same consistent Airlines for the filter table
        await tx.airlines.createMany({
          data: currentFlightAirlines.map((a) => ({
            name: a.name,
            iata_code: a.iata_code,
            logo: a.logo,
            airline_id: createdData.id,
          })),
        });

        const firstAirline = await tx.airlines.findFirst({
          where: { airline_id: createdData.id },
        });

        if (firstStop && firstAirline) {
          await tx.minPrice.create({
            data: {
              ...populateFakeMinPrice(),
              min_price_data_id: createdData.id,
              min_price_airline_id: firstAirline.id,
              min_price_stop_id: firstStop.id,
            },
          });
        }

        await tx.carriers.createMany({ data: carriersToCreate });

        // --- D. ADD AUXILIARY DATA (Baggage, Stops, Airlines, FlightTimes) ---
        await tx.shortLayoverConnection.create({
          data: { ...populateFakeShortLayover(), layover_id: createdData.id },
        });

        await tx.departureInterval.createMany({
          data: populateFakeDepartureIntervals().map((item) => ({
            ...item,
            interval_id: createdData.id,
          })),
        });

        await tx.baggage.createMany({
          data: populateFakeBaggage().map((item) => ({
            ...item,
            baggage_id: createdData.id,
          })),
        });

        await tx.duration.createMany({
          data: populateFakeDuration().map((item) => ({
            ...item,
            duration_id: createdData.id,
          })),
        });

        // E. Create FlightTimes and their children
        const flightTimesCount = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < flightTimesCount; i++) {
          const createdFlightTime = await tx.flightTimes.create({
            data: { flight_times_id: createdData.id },
          });

          await tx.arrival.createMany({
            data: populateFakeArrivalData().map((arrival) => ({
              ...arrival,
              arrival_id: createdFlightTime.id,
            })),
          });

          await tx.depart.createMany({
            data: populateFakeDepartData().map((depart) => ({
              ...depart,
              depart_id: createdFlightTime.id,
            })),
          });
        }
      }
    },
    {
      timeout: 30000, // 30 seconds
    },
  );
  console.info("✅ Database seeding completed successfully.");
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
