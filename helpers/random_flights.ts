import { prisma } from "@/lib/prisma";

export const randomizeLocations = async () => {
  const response = await prisma.airport.findMany({
    select: {
      city: true,
      country: true,
      image_url: true,
      airport_code: true,
    },
  });
  // Shuffle the array here if you want it truly random
  return response.sort(() => Math.random() - 0.5).slice(0, 9);
};

export const randomCountriesAndPrice = async () => {
  const dataResponse = await prisma.data.findMany({
    take: 6,
    select: {
      flight_offers: {
        take: 1,
        select: {
          segments: {
            take: 1,
            select: {
              departure_airport_code: true,
            },
          },
        },
      },
      min_price: {
        select: {
          amount: true,
          currency_code: true,
        },
      },
    },
  });

  // Use .map() to create an array of Promises
  const dataArr = await Promise.all(
    dataResponse.map(async (item) => {
      const airportCode =
        item.flight_offers[0]?.segments[0]?.departure_airport_code;
      const price = item.min_price?.amount;
      const currencyCode = item.min_price?.currency_code;

      // Now we can safely await here
      const airportResponse = await prisma.airport.findFirst({
        where: {
          airport_code: airportCode, // Use the code variable here
        },
        select: {
          country: true,
          image_url: true,
        },
      });

      // Return the combined object for this item
      return {
        airportCode,
        price,
        currencyCode,
        country: airportResponse?.country,
        imageUrl: airportResponse?.image_url,
      };
    })
  );
  return dataArr.sort(() => Math.random() - 0.5).slice(0, 4);
};