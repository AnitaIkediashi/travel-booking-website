import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { SearchParamsProps } from "@/types/flight_type";

const getDateRangeStrings = (dateString: string | undefined) => {
  if (!dateString) return undefined;

  const start = new Date(dateString);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(dateString);
  end.setUTCHours(23, 59, 59, 999);

  console.log(`start: ${start.toISOString()} end: ${end.toISOString()}`);

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
      {flight_offers: {some: {
        trip_type: {
          contains: trip
        }
      }}}
    ];

    const outboundFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: {
        equals: from,
        mode: "insensitive",
      },
      arrival_airport_code: {
        equals: to,
        mode: "insensitive",
      },
      departure_time: departRange,
    };

    const inboundFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: {
        equals: to,
        mode: "insensitive",
      },
      arrival_airport_code: {
        equals: from,
        mode: "insensitive",
      },
      departure_time: returnRange,
    };

    if (trip === "round-trip") {
      conditions.push({
        flight_offers: {
          some: {
            OR: [
              { segments: { some: outboundFilter } },
              { segments: { some: inboundFilter } },
            ],
          },
        },
      });
    } 
    else {
      conditions.push({
        flight_offers: {
          some: {
            segments: {
              some: outboundFilter,
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
            branded_fareinfo: {
              include: {
                features: true,
              },
            },
            price_breakdown: {
              include: {
                base_fare: true,
                discount: true,
                tax: true,
                total: true,
              },
            },
            seat_availability: true,
            traveler_price: {
              include: {
                price_breakdown: {
                  include: {
                    base_fare: true,
                    discount: true,
                    tax: true,
                    total: true,
                  },
                },
              },
            },
            segments: {
              where:
                trip === "round-trip"
                  ? { OR: [outboundFilter, inboundFilter] }
                  : outboundFilter,
              include: {
                legs: {
                  orderBy: { departure_time: "asc" },
                  include: {
                    carriers: true,
                    flight_info: {
                      include: {
                        carrier_info: true,
                      },
                    },
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
        baggage: true,
      },
    });
    console.log("data response: ", JSON.stringify(dataResponse, null, 2));
    return dataResponse;
  } catch (error) {
    console.error("Error querying flight data: ", error);
  }
};

// queryFlightData({
//   depart: "2026-02-18",
//   return: "2026-02-27",
//   cabin: 'Business',
//   from: 'NRT',
//   to: 'CHC',
//   adults: 1,
//   children: 0,
//   trip: 'round-trip'
// });

// queryFlightData({
//   depart: "2026-01-31",
//   cabin: 'Premium',
//   from: 'CHC',
//   to: 'CBR',
//   adults: 1,
//   children: 0,
//   trip: 'one-way'
// });
