/**
 * Generated types - they are are TypeScript types that are derived from your models.
 * They are denoted using Prisma namespace, e.g., Prisma.UserCreateInput.
 * These types help ensure type safety when interacting with the database.
 * NOTE: using include method: to add related records in the query result.
 * you can use include on deeply nested relations as well.
 */

import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { FlightSearchParamsProps } from "@/types/flight_type";

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

export const queryFlightData = async (queryParams: FlightSearchParamsProps) => {
  try {
    const {
      from,
      to,
      depart,
      return: returnDate, // had to rename because return is a reserved keyword
      trip,
      cabin,
      adults,
      child,
      infant,
    } = queryParams;

    const departRange = getDateRangeStrings(depart);
    const returnRange = getDateRangeStrings(returnDate);

    // Construct the conditions for the where clause
    const conditions: Prisma.DataWhereInput[] = [
      {
        flight_offers: {
          some: {
            trip_type: {
              contains: trip,
            },
            branded_fareinfo: {
              cabin_class: {
                contains: cabin,
                mode: "insensitive",
              },
            },
          },
        },
      },
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
    } else {
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
          where: {
            trip_type: { contains: trip },
            branded_fareinfo: {
              cabin_class: { contains: cabin, mode: "insensitive" },
            },
            segments: {
              some:
                trip === "round-trip"
                  ? { OR: [outboundFilter, inboundFilter] }
                  : outboundFilter,
            },
          },
          include: {
            branded_fareinfo: {
              include: {
                features: true,
              },
            },
            seat_availability: true,
            traveler_price: {
              omit: {
                traveler_reference: true,
              },
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
            price_breakdown: {
              include: {
                base_fare: true,
                discount: true,
                tax: true,
                total: true,
              },
            },
            segments: {
              orderBy: { departure_time: "asc" },
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
        stops: true,
        airlines: true,
        duration: true,
        baggage: true,
      },
    });

    //convert values to numbers
    const adultCount = Number(adults ?? 0);
    const childCount = Number(child ?? 0);
    const infantCount = Number(infant ?? 0);
    const finalData = dataResponse.map((item) => {
      const travelerBreakdown = item.flight_offers[0].traveler_price;
      travelerBreakdown.map((price) => {
        const type = price.traveler_type;
        // Determine the multiplier once per traveler type
        const count =
          type === "INFANT"
            ? infantCount
            : type === "CHILD"
              ? childCount
              : adultCount;

        let baseAmount = price.price_breakdown?.base_fare?.amount ?? 0;
        let discountAmount = price.price_breakdown?.discount?.amount ?? 0;
        let taxAmount = price.price_breakdown?.tax?.amount ?? 0;
        let totalAmount = price.price_breakdown?.total?.amount ?? 0;

        baseAmount = count * baseAmount;

        discountAmount = count * discountAmount;

        taxAmount = count * taxAmount;

        totalAmount = count * totalAmount;
        return {
          ...price, // Keep original top-level properties (like traveler_type)
          price_breakdown: {
            ...price.price_breakdown, // Keep other properties (like currency)
            base_fare: {
              ...price.price_breakdown?.base_fare,
              amount: baseAmount, // Overwrite with calculated value
            },
            discount: {
              ...price.price_breakdown?.discount,
              amount: discountAmount,
            },
            tax: {
              ...price.price_breakdown?.tax,
              amount: taxAmount,
            },
            total: {
              ...price.price_breakdown?.total,
              amount: totalAmount,
            },
          },
        };
      });
      return {
        ...item,
        flight_offers: [
          {
            ...item.flight_offers[0],
            traveler_price: travelerBreakdown, // Overwrite with our new calculations
          },
          ...item.flight_offers.slice(1), // Keep other flight offers if they exist
        ],
      }; 
    });
    // console.log("final response: ", JSON.stringify(finalData, null, 2));
    return finalData;
  } catch (error) {
    console.error("Error querying flight data: ", error);
    return [];
  }
};

export const queryFlightToken = async (
  queryParams: FlightSearchParamsProps,
) => {
  try {
    const flightData = await queryFlightData(queryParams);
    const filteredFlights = flightData[0].flight_offers.find(
      (offers) => offers.token === queryParams.token,
    );
    // console.log("filteredFlights: ", JSON.stringify(filteredFlights, null, 2));
    return filteredFlights
  } catch (error) {
    console.error('no such token available: ', error)
    return []
  }
};

// queryFlightData({
//   from: "CKG",
//   to: "FCO",
//   trip: "one-way",
//   adults: 1,
//   child: 0,
//   infant: 0,
//   cabin: "Economy",
//   depart: "2026-02-25"
// });
