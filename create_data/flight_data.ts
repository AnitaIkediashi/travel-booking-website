import { AirportProps } from "@/types/flight_type";
import { fa, faker } from "@faker-js/faker";

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
      const count = faker.number.int({min: 5, max: 20})

      return {
        no_of_stops: stopNo,
        count: count,
      }
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
    return Array.from({length: faker.number.int({min:5, max: 10})}, () => {
        const token = faker.string.nanoid({min: 40, max: 80})
        const tripType = faker.helpers.arrayElement(["one-way", "round-trip"]);
        const flightKey = faker.string.uuid();
        return {
            token: token,
            trip_type: tripType,
            flight_key: flightKey,
        }
    })
}