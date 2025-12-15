import { AirportProps } from "@/types/flight_type";
import { fa, faker } from "@faker-js/faker";
import { ca } from "date-fns/locale";

function populateFakeAirports(): AirportProps[] {
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

const airportsArray: AirportProps[] = populateFakeAirports();

function populateFlightData() {
  return Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => {
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
  });
}

function populateDepartureIntervals() {
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

function populateShortLayover() {
  return {
    count: faker.number.int({ min: 1, max: 3 }),
  };
}

function populateMinPrice() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 100, max: 3000 }),
  };
}

function populateBaggage() {
  const baggageTypeArray = ["cabin", "checked", "personal"];
  const paramNamesArray = [
    "includedBaggage",
    "optionalBaggage",
    "personalItem",
  ];
  const includedBaggage = [true, false];

  return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
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

function populateStops() {
  Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () => {
    const stopNo = faker.number.int({ min: 0, max: 4 });
    const count = faker.number.int({ min: 5, max: 20 });

    return {
      no_of_stops: stopNo,
      count: count,
    };
  });
}

function populateAirlines() {
  Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => {
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

function populateDuration() {
  Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => {
    const min = faker.number.int({ min: 60, max: 300 });
    const max = min + faker.number.int({ min: 30, max: 180 });

    return {
      min: min,
      max: max,
    };
  });
}

function populateArrivalData() {
  return Array.from({ length: faker.number.int({ min: 2, max: 3 }) }, () => {
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

function populateDepartData() {
  return Array.from({ length: faker.number.int({ min: 2, max: 3 }) }, () => {
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

function populateFlightOffers() {
  return Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => {
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

function populateSegments() {
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  return Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => {
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

function populateLegsData() {
  const today = new Date();
  const twoMonthsLater = new Date(today);
  twoMonthsLater.setMonth(today.getMonth() + 2);
  const cabinClassArray = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];
  return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => {
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
    const cabinClass = faker.helpers.arrayElement(cabinClassArray);
    return {
      total_time: totalDuration,
      departure_time: departureTimeIso,
      arrival_time: arrivalTimeIso,
      cabin_class: cabinClass,
    };
  });
}

function populateCarriersData() {
  return Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => {
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

function populateFlightInfo() {
  return {
    flight_number: faker.airline.flightNumber({
      addLeadingZeros: true,
      length: 2,
    }),
  };
}

function populateCarrierInfoData() {
  return {
    operating_carrier: faker.airline.airline().name,
  };
}

function populateTotalPrice() {
  const baseAmount = populateBaseFarePrice().amount;
  const taxAmount = populateTaxPriceBreakdown().amount;
  const discountAmount = populateDiscountPrice().amount;
  const totalAmount = baseAmount + taxAmount - discountAmount;
  return {
    currency_code: "USD",
    amount: totalAmount,
  };
}

function populateBaseFarePrice() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 100, max: 2000 }),
  };
}

function populateTaxPriceBreakdown() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 100, max: 500 }),
  };
}

function populateDiscountPrice() {
  return {
    currency_code: "USD",
    amount: faker.number.int({ min: 0, max: 100 }),
  };
}

function populateTravelerPrice() {
  return Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => {
    const travelerReference = faker.number.int({ min: 1, max: 10 });
    const travelerType = faker.helpers.arrayElement([
      "adult",
      "child",
      "infant",
    ]);
    return {
      traveler_reference: travelerReference,
      traveler_type: travelerType.toUpperCase(),
    };
  });
}

function populateSeatAvailability() {
  return {
    seats_left: faker.number.int({ min: 1, max: 10 }),
  };
}

function populateBrandedFareInfo() {
  const cabinClassArray = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];
  return {
    cabin_class: faker.helpers.arrayElement(cabinClassArray),
  };
}

function populateFeatures() {
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
