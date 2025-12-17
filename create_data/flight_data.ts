import { CarrierDataProps } from "@/types/flight_type";
import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";

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

function populateFakeSegments() {
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const totalDuration = faker.number.int({ min: 60, max: 600 });
    const departureTime = faker.date.between({
      from: today,
      to: twoMonthsLater,
    });
    const arrivalTime = new Date(
      departureTime.getTime() + totalDuration * 60 * 1000
    );
    const departureTimeIso = departureTime.toISOString();
    const arrivalTimeIso = arrivalTime.toISOString();
    return {
      total_time: totalDuration,
      departure_time: departureTimeIso,
      arrival_time: arrivalTimeIso,
    };
  });
}

function populateFakeLegsData() {
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  const data = populateFakeFlightData();
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const totalDuration = faker.number.int({ min: 60, max: 600 });
    const departureTime = faker.date.between({
      from: today,
      to: twoMonthsLater,
    });
    const arrivalTime = new Date(
      departureTime.getTime() + totalDuration * 60 * 1000
    );
    const departureTimeIso = departureTime.toISOString();
    const arrivalTimeIso = arrivalTime.toISOString();

    return {
      total_time: totalDuration,
      departure_time: departureTimeIso,
      arrival_time: arrivalTimeIso,
      cabin_class: data.cabin_class,
    };
  });
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

function populateFakeTotalPrice() {
  const baseAmount = populateFakeBaseFarePrice().amount;
  const taxAmount = populateFakeTaxPriceBreakdown().amount;
  const discountAmount = populateFakeDiscountPrice().amount;
  const totalAmount = baseAmount + taxAmount - discountAmount;
  return {
    currency_code: "USD",
    amount: totalAmount,
  };
}

function populateFakeBaseFarePrice() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 100, max: 2000 }),
  };
}

function populateFakeTaxPriceBreakdown() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 100, max: 500 }),
  };
}

function populateFakeDiscountPrice() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 0, max: 100 }),
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

async function clearDatabase() {
  console.info("🗑️ Clearing existing database data...");
  //note: delete from child first to parent last

  // Use a transaction to ensure all deletes happen quickly and atomically
  await prisma.$transaction([
    // 1. Delete deeply nested models first (Keep the other fixes from prior answers here!)
    prisma.carrierInfo.deleteMany(),
    prisma.flightInfo.deleteMany(),
    prisma.features.deleteMany(), // Ensure this is before BrandedFareInfo
    prisma.brandedFareInfo.deleteMany(),
    prisma.carriers.deleteMany(),
    prisma.arrival.deleteMany(),
    prisma.depart.deleteMany(),
    prisma.flightTimes.deleteMany(), // 2. Delete the price breakdown component models

    prisma.totalPrice.deleteMany(),
    prisma.baseFare.deleteMany(),
    prisma.tax.deleteMany(),
    prisma.discount.deleteMany(), // 3. Delete intermediate models

    prisma.priceBreakdown.deleteMany(),
    prisma.travelerPrice.deleteMany(),
    prisma.legs.deleteMany(),
    prisma.segment.deleteMany(),
    prisma.seatAvailability.deleteMany(), // <-- Moved up here (Child before parent FlightOffers)
    prisma.flightOffers.deleteMany(), // <-- Parent // 4. Delete top-level helper models

    prisma.departureInterval.deleteMany(),
    prisma.shortLayoverConnection.deleteMany(),
    prisma.minPrice.deleteMany(),
    prisma.stop.deleteMany(),
    prisma.airlines.deleteMany(),
    prisma.duration.deleteMany(),
    prisma.baggage.deleteMany(), // 5. Delete the main parent model

    prisma.data.deleteMany(), // 6. Delete static look-up data (Airports)

    prisma.airport.deleteMany(),
  ]);

  console.info("✅ Database data cleared successfully.");
}

async function main() {
  // 💡 Step 0: Clear the database before creating new data
  await clearDatabase();
  console.info("Starting seed process...");

  // 1. Create Airports
  const createdAirports = [];
  for (const airport of fakeAirports) {
    const created = await prisma.airport.create({
      data: {
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

  // 2. Prepare Flight Data
  const flightInputData = populateFakeFlightData();
  const [depAirport, arrAirport] = faker.helpers.arrayElements(
    createdAirports,
    2
  );
  const fakeFlightNumber = populateFakeFlightNumber();

  // 3. Create Main Data Record with non-multiplying nested relations
  const createdData = await prisma.data.create({
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
            create: populateFakeSegments().map((segment) => ({
              departure_airports: {
                connect: { airport_code: depAirport.airport_code },
              },
              arrival_airports: {
                connect: { airport_code: arrAirport.airport_code },
              },
              departure_time: segment.departure_time,
              arrival_time: segment.arrival_time,
              total_time: segment.total_time,
              legs: {
                create: populateFakeLegsData().map((leg) => ({
                  departure_airport: {
                    connect: { airport_code: depAirport.airport_code },
                  },
                  arrival_airport: {
                    connect: { airport_code: arrAirport.airport_code },
                  },
                  departure_time: leg.departure_time,
                  arrival_time: leg.arrival_time,
                  cabin_class: leg.cabin_class,
                  total_time: leg.total_time,
                })),
              },
            })),
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

  // --- 4. POST-CREATION: UN-NESTED DATA LINKING ---

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
    const newFlightInfo = await prisma.flightInfo.create({
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

  // B. Handle PriceBreakdown for FlightOffers
  for (const offer of createdData.flight_offers) {
    const pb = await prisma.priceBreakdown.create({
      data: { price_breakdown_id: offer.id },
    });

    await prisma.$transaction([
      prisma.totalPrice.create({
        data: { ...populateFakeTotalPrice(), total_price_id: pb.id },
      }),
      prisma.baseFare.create({
        data: { ...populateFakeBaseFarePrice(), base_price_id: pb.id },
      }),
      prisma.tax.create({
        data: { ...populateFakeTaxPriceBreakdown(), tax_id: pb.id },
      }),
    ]);

    // C. Handle PriceBreakdown for TravelerPrices within this offer
    for (const tp of offer.traveler_price) {
      const tpPb = await prisma.priceBreakdown.create({
        data: { traveler_price_id: tp.id },
      });

      await prisma.$transaction([
        prisma.totalPrice.create({
          data: { ...populateFakeTotalPrice(), total_price_id: tpPb.id },
        }),
        prisma.baseFare.create({
          data: { ...populateFakeBaseFarePrice(), base_price_id: tpPb.id },
        }),
        prisma.tax.create({
          data: { ...populateFakeTaxPriceBreakdown(), tax_id: tpPb.id },
        }),
        prisma.discount.create({
          data: { ...populateFakeDiscountPrice(), discount_id: tpPb.id },
        }),
      ]);
    }
  }

  // --- 5. EXECUTE BULK INSERTS ---
  await prisma.carriers.createMany({ data: carriersToCreate });
  await prisma.carrierInfo.createMany({ data: carrierInfoToCreate });

  // --- 6. ADD AUXILIARY DATA (Baggage, Stops, Airlines, FlightTimes) ---
  await prisma.shortLayoverConnection.create({
    data: { ...populateFakeShortLayover(), layover_id: createdData.id },
  });

  await prisma.departureInterval.createMany({
    data: populateFakeDepartureIntervals().map((item) => ({
      ...item,
      interval_id: createdData.id,
    })),
  });

  await prisma.baggage.createMany({
    data: populateFakeBaggage().map((item) => ({
      ...item,
      baggage_id: createdData.id,
    })),
  });

  await prisma.duration.createMany({
    data: populateFakeDuration().map((item) => ({
      ...item,
      duration_id: createdData.id,
    })),
  });

  await prisma.stop.createMany({
    data: populateFakeStops().map((item) => ({
      ...item,
      stop_id: createdData.id,
    })),
  });

  const firstStop = await prisma.stop.findFirst({
    where: { stop_id: createdData.id },
  });

  await prisma.airlines.createMany({
    data: populateFakeAirlines().map((item) => ({
      ...item,
      airline_id: createdData.id,
    })),
  });

  const firstAirline = await prisma.airlines.findFirst({
    where: { airline_id: createdData.id },
  });

  if (firstStop && firstAirline) {
    await prisma.minPrice.create({
      data: {
        ...populateFakeMinPrice(),
        min_price_data_id: createdData.id,
        min_price_airline_id: firstAirline.id,
        min_price_stop_id: firstStop.id,
      },
    });
  }

  // 7. Create FlightTimes and their children
  const flightTimesCount = faker.number.int({ min: 1, max: 3 });
  for (let i = 0; i < flightTimesCount; i++) {
    const createdFlightTime = await prisma.flightTimes.create({
      data: { flight_times_id: createdData.id },
    });

    await prisma.arrival.createMany({
      data: populateFakeArrivalData().map((arrival) => ({
        ...arrival,
        arrival_id: createdFlightTime.id,
      })),
    });

    await prisma.depart.createMany({
      data: populateFakeDepartData().map((depart) => ({
        ...depart,
        depart_id: createdFlightTime.id,
      })),
    });
  }

  console.info("✅ Database seeding completed successfully.");
}

main()
  .then(async () => {
    console.info("creation successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("An error occurred during creation: ", e);
    await prisma.$disconnect();
    process.exit(1);
  });
