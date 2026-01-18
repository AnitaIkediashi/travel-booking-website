import { CarrierDataProps } from "@/types/flight_type";
import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";
import cron from "node-cron";

console.log("🚀 SCRIPT INITIALIZED");

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

const fakeAirports = populateFakeAirports();

function populateFakeFlightData() {
  const cabinClassArray = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];
  const durationMin = faker.number.int({ min: 60, max: 300 });
  const durationMax = durationMin + faker.number.int({ min: 30, max: 180 });
  const cabinClass = faker.helpers.arrayElement(cabinClassArray);
  return {
    duration_min: durationMin,
    duration_max: durationMax,
    cabin_class: cabinClass,
  };
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

function populateFakeStops() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const stopNo = faker.number.int({ min: 1, max: 4 });
    const count = faker.number.int({ min: 5, max: 20 });

    return {
      no_of_stops: stopNo,
      count: count,
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

function populateFakeFlightOffers() {
  return Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => {
    const token = faker.string.nanoid({ min: 40, max: 80 });
    const tripType = faker.helpers.arrayElement(["one-way", "round-trip"]);
    const flightKey = faker.string.uuid();
    return {
      token: token,
      trip_type: tripType,
      flight_key: flightKey,
    };
  });
}

function populateFakeSegments(
  windowStart: Date,
  windowEnd: Date,
  tripType: string
) {
  // 1. Generate a random date between start and end
  const rawOutboundDate = faker.date.between({
    from: windowStart,
    to: windowEnd,
  });

  // NORMALIZE: Force the departure to 12:00 PM UTC
  // This prevents "timezone shifting" where a flight at 11:00 PM
  // might accidentally show up on the previous or next day.
  const departureTime = new Date(
    Date.UTC(
      rawOutboundDate.getUTCFullYear(),
      rawOutboundDate.getUTCMonth(),
      rawOutboundDate.getUTCDate(),
      12,
      0,
      0
    )
  );

  const outboundDuration = faker.number.int({ min: 90, max: 720 });
  const arrivalTime = new Date(
    departureTime.getTime() + outboundDuration * 60 * 1000
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
      arrivalTime.getTime() + stayDays * 24 * 60 * 60 * 1000
    );

    // NORMALIZE: Force the return flight to 12:00 PM UTC as well
    const returnDeparture = new Date(
      Date.UTC(
        rawReturnDate.getUTCFullYear(),
        rawReturnDate.getUTCMonth(),
        rawReturnDate.getUTCDate(),
        12,
        0,
        0
      )
    );

    const returnDuration = faker.number.int({ min: 90, max: 720 });
    const returnArrival = new Date(
      returnDeparture.getTime() + returnDuration * 60 * 1000
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
  cabinClass: string
) {
  const numLegs = faker.number.int({ min: 1, max: 2 });
  const legs = [];

  let currentStart = new Date(segmentStart);

  // Total segment duration in ms
  const totalSegmentMs = segmentEnd.getTime() - segmentStart.getTime();
  // Average duration per leg (minus some time for a layover)
  const legDurationMs = (totalSegmentMs * 0.7) / numLegs;

  for (let i = 0; i < numLegs; i++) {
    const arrival = new Date(currentStart.getTime() + legDurationMs);

    legs.push({
      total_time: Math.floor(legDurationMs / 60000),
      departure_time: currentStart.toISOString(),
      arrival_time: arrival.toISOString(),
      cabin_class: cabinClass,
    });

    // SET UP FOR NEXT LEG: Add a 45-120 minute layover
    const layoverMs = faker.number.int({ min: 45, max: 120 }) * 60 * 1000;
    currentStart = new Date(arrival.getTime() + layoverMs);

    // Safety check: Don't let the last leg arrival exceed segment end
    if (i === numLegs - 1) {
      legs[i].arrival_time = segmentEnd.toISOString();
    }
  }

  return legs;
}

function populateFakeCarriersData() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const carrierName = faker.airline.airline().name;
    const carrierCode = faker.airline.airline().iataCode;
    const carrierLogo = faker.image.url({ width: 100, height: 100 });
    return {
      name: carrierName,
      code: carrierCode,
      logo: carrierLogo,
    };
  });
}

function populateFakeFlightNumber() {
  return {
    flight_number: faker.airline.flightNumber({
      addLeadingZeros: true,
      length: 2,
    }),
  };
}

function populateFakeCarrierInfoData() {
  return {
    operating_carrier: faker.airline.airline().name,
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

function populateFakeSeatAvailability() {
  return {
    seats_left: faker.number.int({ min: 1, max: 10 }),
  };
}

function populateFakeFeatures() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const featureNames = faker.helpers.arrayElement([
      "CABIN_BAGGAGE",
      "PERSONAL_ITEM",
    ]);
    const categoryNames = faker.helpers.arrayElement([
      "BAGGAGE",
      "TICKET_TERMS",
      "AIRPORT_SERVICES",
    ]);
    const availability = faker.helpers.arrayElement([
      "INCLUDED",
      "NOT_INCLUDED",
      "OPTIONAL",
    ]);
    return {
      availability: availability,
      category: categoryNames,
      feature_name: featureNames,
    };
  });
}

// async function clearDatabase() {
//   console.info("Emptying database...");

//   // The order matters! Delete children before parents.
//   // We use a transaction to ensure everything is cleared or nothing is.
//   await prisma.$transaction([
//     prisma.legs.deleteMany(),
//     prisma.segment.deleteMany(),
//     prisma.travelerPrice.deleteMany(),
//     prisma.priceBreakdown.deleteMany(),
//     prisma.flightOffers.deleteMany(),
//     prisma.stop.deleteMany(),
//     prisma.airlines.deleteMany(),
//     prisma.minPrice.deleteMany(),
//     prisma.flightTimes.deleteMany(),
//     prisma.data.deleteMany(), // The main parent
//     prisma.airport.deleteMany(),
//   ]);

//   console.info("Database cleared! ✨");
// }

async function clearStaleData() {
  // 1. Create a "cutoff" time (30 minutes in the past)
  const now = new Date();
  const bufferTime = new Date(now.getTime() - 30 * 60 * 1000);
  const MAX_FLIGHTS = 50;

  console.info("🧹 Maintenance started...");

  // --- PART 1: DELETE STALE DATA ---
  // const staleDelete = await prisma.data.deleteMany({
  //   where: {
  //     flight_offers: {
  //       some: {
  //         segments: {
  //           some: {
  //             departure_time: {
  //               lt: now.toISOString(), // Deletes everything in the past
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  const staleDelete = await prisma.data.deleteMany({
    where: {
      flight_offers: {
        some: {
          segments: {
            some: {
              departure_time: {
                lt: bufferTime.toISOString(), // Use bufferTime here - like adding 30 mins grace period
              },
            },
          },
        },
      },
    },
  });

  if (staleDelete.count > 0) {
    console.info(
      `✅ Successfully removed ${staleDelete.count} expired flights.`
    );
  }

  // --- PART 2: CHECK TOTAL CAPACITY ---
  const currentCount = await prisma.data.count();

  if (currentCount >= MAX_FLIGHTS) {
    console.info(
      `⚠️ Database has ${currentCount} future flights. Capacity reached.`
    );
    return false; // Tells main() NOT to add more
  }

  return true; // Tells main() "Yes, we have room for more flights"
}

async function main() {
  // 💡 Step 0: Clear the database before creating new data
  console.info("Starting seed process...");

  //  1. Run maintenance (deletes stale data AND checks the count)
  const isHealthyAndHasRoom = await clearStaleData();

  //  2. Decide whether to proceed based on the result above
  if (!isHealthyAndHasRoom) {
    // If clearStaleData returned 'false', it means we reached the 50-flight limit.
    // We stop here.
    return;
  }

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
      const flightInputData = populateFakeFlightData();
      const [depAirport, arrAirport] = faker.helpers.arrayElements(
        createdAirports,
        2
      ); //select two airports

      const fakeFlightNumber = populateFakeFlightNumber();

      // Define the 2-month window once
      const searchStart = new Date();
      const searchEnd = new Date();
      searchEnd.setMonth(searchStart.getMonth() + 2);

      // 6. PRE-GENERATE OFFERS to know the Trip Type
      const fakeOffers = populateFakeFlightOffers();
      const currentTripType = fakeOffers[0].trip_type; // Use the first offer's type as the master type

      // 7. Create Main Data Record with non-multiplying nested relations
      const createdData = await tx.data.create({
        data: {
          duration_min: flightInputData.duration_min,
          duration_max: flightInputData.duration_max,
          cabin_class: flightInputData.cabin_class,
          flight_offers: {
            create: populateFakeFlightOffers().map((offer) => ({
              token: offer.token,
              trip_type: offer.trip_type,
              flight_key: offer.flight_key,
              seat_availability: {
                create: populateFakeSeatAvailability(),
              },
              branded_fareinfo: {
                create: {
                  cabin_class: flightInputData.cabin_class,
                  features: {
                    create: populateFakeFeatures().map((feature) => ({
                      feature_name: feature.feature_name,
                      category: feature.category,
                      availability: feature.availability,
                    })),
                  },
                },
              },
              segments: {
                create: populateFakeSegments(
                  searchStart,
                  searchEnd,
                  currentTripType
                ).map((segment, index) => {
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
                    departure_airports: { connect: { airport_code: segDep } },
                    arrival_airports: { connect: { airport_code: segArr } },
                    departure_time: segment.departure_time_iso,
                    arrival_time: segment.arrival_time_iso,
                    total_time: segment.total_time,
                    legs: {
                      create: populateFakeLegsData(
                        segment.departure_time,
                        segment.arrival_time,
                        flightInputData.cabin_class
                      ).map((leg) => ({
                        departure_airport: {
                          connect: { airport_code: segDep },
                        },
                        arrival_airport: { connect: { airport_code: segArr } },
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
                create: populateFakeTravelerPrice().map((traveler) => ({
                  traveler_reference: traveler.traveler_reference,
                  traveler_type: traveler.traveler_type,
                })),
              },
            })),
          },
        },
        include: {
          flight_offers: {
            include: {
              segments: { include: { legs: true } },
              traveler_price: true,
            },
          },
        },
      });

      // --- 8. POST-CREATION: UN-NESTED DATA LINKING ---

      // A. Link Carriers and FlightInfo/CarrierInfo to Legs
      const allLegs = createdData.flight_offers.flatMap((offer) =>
        offer.segments.flatMap((segment) => segment.legs)
      );

      const carriersToCreate: CarrierDataProps[] = [];
      const carrierInfoToCreate = [];

      for (const leg of allLegs) {
        // Handle Many-to-One: Carriers
        const fakeCarrierData = populateFakeCarriersData();
        fakeCarrierData.forEach((carrier) => {
          carriersToCreate.push({
            carrier_id: leg.id,
            name: carrier.name,
            logo: carrier.logo,
            code: carrier.code,
          });
        });

        // Handle One-to-One: FlightInfo
        const newFlightInfo = await tx.flightInfo.create({
          data: {
            flight_info_id: leg.id,
            flight_number: fakeFlightNumber.flight_number,
          },
        });

        // Handle One-to-One: CarrierInfo (Linked to FlightInfo)
        const carrierData = populateFakeCarrierInfoData();
        carrierInfoToCreate.push({
          operating_carrier: carrierData.operating_carrier,
          carrier_info_id: newFlightInfo.id,
        });
      }

      // B. Unique price breakdown for different traveler types
      for (const offer of createdData.flight_offers) {
        // 1. Determine the "Adult" base price for this specific offer
        const isRoundTrip = offer.trip_type === "round-trip";
        const adultBaseAmount =
          faker.number.int({ min: 200, max: 800 }) * (isRoundTrip ? 1.8 : 1.0);

        // 2. Loop through each traveler in this offer to give them a specific price
        for (const tp of offer.traveler_price) {
          let multiplier = 1.0; // Default for ADULT

          if (tp.traveler_type === "CHILD") multiplier = 0.75; // Children are 75% price
          if (tp.traveler_type === "INFANT") multiplier = 0.1; // Infants are 10% price

          const finalBase = Math.floor(adultBaseAmount * multiplier);
          const finalTax = Math.floor(finalBase * 0.15);
          const finalTotal = finalBase + finalTax;

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

          // 5. Optional: Set the main Offer price to the ADULT price for display
          if (tp.traveler_type === "ADULT") {
            await tx.flightOffers.update({
              where: { id: offer.id },
              data: { price_id: travelerPB.id },
            });
          }
        }
      }

      // --- C. EXECUTE BULK INSERTS ---
      await tx.carriers.createMany({ data: carriersToCreate });
      await tx.carrierInfo.createMany({ data: carrierInfoToCreate });

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

      await tx.stop.createMany({
        data: populateFakeStops().map((item) => ({
          ...item,
          stop_id: createdData.id,
        })),
      });

      const firstStop = await tx.stop.findFirst({
        where: { stop_id: createdData.id },
      });

      await tx.airlines.createMany({
        data: populateFakeAirlines().map((item) => ({
          ...item,
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
    },
    {
      timeout: 10000, // 10 seconds
    }
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
    `Flight data creation automation started at ${startTime.toLocaleString()}`
  );
  try {
    await main();
    const endTime = new Date();
    console.info(
      `Flight data creation automation ended at ${endTime.toLocaleString()}`
    );
  } catch (error) {
    console.error(
      `❌ Flight data creation automation failed: ${error} on ${new Date().toLocaleString()}`
    );
  }
}

runFlightDataCreateAutomation();
console.info(
  "⏳ Flight Data Automation is running. Waiting for the next scheduled hour..."
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
