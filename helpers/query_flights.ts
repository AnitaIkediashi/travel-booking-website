import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { SearchParamsProps } from "@/types/flight_type";

const getDateRangeStrings = (dateString: string | undefined) => {
  if (!dateString) return undefined;

  const start = new Date(dateString);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(dateString);
  end.setUTCHours(23, 59, 59, 999);

  // console.log(`start: ${start.toISOString()} end: ${end.toISOString()}`);

  return {
    gte: start.toISOString(),
    lt: end.toISOString(),
  };
};

export const queryFlightData = async (queryParams: SearchParamsProps) => {
  try {
    const {
      from,
      to,
      depart,
      return: returnDate, // had to rename because return is a reserved keyword
      trip,
      cabin,
    } = queryParams;

    const departRange = getDateRangeStrings(depart);
    const returnRange = getDateRangeStrings(returnDate);

    // Construct the conditions for the where clause
    const conditions: Prisma.DataWhereInput[] = [
      { cabin_class: { contains: cabin } },
    ];

    const oneWayFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: {
        equals: from,
      },
      arrival_airport_code: {
        equals: to,
      },
      departure_time: departRange,
    };

    const roundTripFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: {
        equals: from,
        mode: "insensitive",
      },
      arrival_airport_code: {
        equals: to,
        mode: "insensitive",
      },
      departure_time: departRange,
      arrival_time: returnRange,
    };

    if (trip === "round-trip") {
      conditions.push({
        flight_offers: {
          some: {
            segments: {
              some: roundTripFilter,
            },
          },
        },
      });
    } else {
      conditions.push({
        flight_offers: {
          some: {
            segments: {
              some: oneWayFilter,
            },
          },
        },
      });
    }

    const dataResponse = await prisma.data.findMany({
      where: { AND: conditions },
      include: {
        flight_offers: {
          include: {
            segments: {
              where: trip === 'round-trip' ? roundTripFilter : oneWayFilter,
              include: {
                legs: { include: { carriers: true } },
              },
            },
          },
        },
        flight_times: {
          include: {
            arrival: true,
            depart: true,
          },
        },
        stops: true,
        min_price: true,
        short_layover_connection: true,
        airlines: true,
        duration: true,
        departure_intervals: true,
      },
    });
    console.log("data response: ", JSON.stringify(dataResponse, null, 2));
    return dataResponse;
  } catch (error) {
    console.error("Error querying flight data: ", error);
  }
};
