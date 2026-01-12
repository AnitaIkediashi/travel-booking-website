import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { SearchParamsProps } from "@/types/flight_type";

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

    const segmentFilters: Prisma.SegmentWhereInput = {
      departure_airport_code: { contains: from },
      arrival_airport_code: { contains: to },
      departure_time: { startsWith: depart },
    };

    // 2. Conditionally add the return date filter
    if (trip === "round-trip") {
      segmentFilters.arrival_time = { startsWith: returnDate };
    }

    const dataResponse = await prisma.data.findFirst({
      include: {
        flight_offers: {
          include: {
            segments: {
              where: segmentFilters,
              include: {
                legs: {
                  include: {
                    carriers: true,
                  },
                },
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
      where: {
        AND: [
          {
            flight_offers: {
              some: {
                trip_type: trip,
                segments: {
                  some: segmentFilters,
                },
              },
            },
          },
          {
            cabin_class: { contains: cabin },
          },
        ],
      },
    });
    console.log("data response: ", JSON.stringify(dataResponse, null, 2));
  } catch (error) {
    console.error("Error querying flight data: ", error);
  }
};

queryFlightData({
  from: "JNB",
  to: "NBO",
  trip: "round-trip",
  depart: "2026-01-19",
  return: "2026-01-20",
  cabin: "Business",
});
// http://localhost:3000/flight-flow/flight-search/listing?from=JNB&to=NBO&trip=round-trip&depart=2026-01-19&return=2026-01-20&adults=1&children=0&cabin=Business