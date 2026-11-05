import { prisma } from "@/lib/prisma";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type RandomLocation =
  | {
      kind: "flight";
      city: string;
      country: string;
      image_url: string | null;
      airport_code: string;
    }
  | {
      kind: "hotel";
      city: string;
      country: string;
      image_url: string | null;
    };

export const randomizeLocations = async (
  limit = 9,
): Promise<RandomLocation[]> => {
  const [airports, hotels] = await Promise.all([
    prisma.airport.findMany({
      select: {
        city: true,
        country: true,
        image_url: true,
        airport_code: true,
      },
    }),
    prisma.hotels.findMany({
      select: { city: true, country: true, thumb_nails: true },
      distinct: ["city", "country"],
    }),
  ]);

  const combined: RandomLocation[] = [
    ...airports.map((a) => ({ kind: "flight" as const, ...a })),
    ...hotels.map((h) => ({
      kind: "hotel" as const,
      city: h.city,
      country: h.country,
      image_url:
        h.thumb_nails.length > 0
          ? h.thumb_nails[Math.floor(Math.random() * h.thumb_nails.length)]
          : null,
    })),
  ];

  return shuffle(combined).slice(0, limit);
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
          price_breakdown: {
            select: {
              total_amount: true,
              currency_id: true,
            },
          },
        },
      },
    },
  });

  // Use .map() to create an array of Promises
  const dataArr = await Promise.all(
    dataResponse.map(async (item) => {
      const airportCode =
        item.flight_offers[0]?.segments[0]?.departure_airport_code;
      const price = item.flight_offers[0]?.price_breakdown?.total_amount;
      const currencyCode = item.flight_offers[0]?.price_breakdown?.currency_id;

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
    }),
  );
  return dataArr.sort(() => Math.random() - 0.5).slice(0, 4);
};
