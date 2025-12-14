import { faker } from "@faker-js/faker";

type AirportProps =  {
    name: string;
    code: string;
    imageUrl: string;
    city: string;
    country: string;
}

function populateFakeAirports(): AirportProps[] {
    return Array.from({length: faker.number.int({min: 3, max: 5})}, () => {
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
    })
}

const airportsArray: AirportProps[] = populateFakeAirports();

function populateFlightData() {
    return Array.from({length: faker.number.int({min: 5, max: 10})}, () => {
        const cabinClassArray = ["Economy", "Premium Economy", "Business", "First Class"];
        const durationMin = faker.number.int({min: 60, max: 300});
        const durationMax = durationMin + faker.number.int({min: 30, max: 180});
        const cabinClass = faker.helpers.arrayElement(cabinClassArray);
        return {
            duration_min: durationMin,
            duration_max: durationMax,
            cabin_class: cabinClass,
        }
    });
}