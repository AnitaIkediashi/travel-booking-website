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
              equals: trip,
            },
            branded_fareinfo: {
              cabin_class: {
                equals:
                  cabin === "Premium"
                    ? "Premium Economy"
                    : cabin === "First"
                      ? "First Class"
                      : cabin,
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
          omit: {
            price_id: true,
          },
          where: {
            trip_type: { equals: trip },
            branded_fareinfo: {
              cabin_class: {
                equals:
                  cabin === "Premium"
                    ? "Premium Economy"
                    : cabin === "First"
                      ? "First Class"
                      : cabin,
                mode: "insensitive",
              },
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
              omit: {
                id: true,
                branded_fareinfo_id: true,
              },
              include: {
                features: {
                  omit: {
                    id: true,
                    feature_id: true,
                  },
                },
              },
            },
            seat_availability: {
              omit: {
                id: true,
                seat_availability_id: true,
              },
            },
            traveler_price: {
              omit: {
                traveler_reference: true,
                id: true,
                traveler_price_id: true,
              },
              include: {
                price_breakdown: {
                  omit: {
                    id: true,
                  },
                  include: {
                    base_fare: {
                      omit: {
                        id: true,
                        base_price_id: true,
                      },
                    },
                    discount: {
                      omit: {
                        id: true,
                        discount_id: true,
                      },
                    },
                    tax: {
                      omit: {
                        id: true,
                        tax_id: true,
                      },
                    },
                    total: {
                      omit: {
                        id: true,
                        total_price_id: true,
                      },
                    },
                  },
                },
              },
            },
            price_breakdown: {
              omit: {
                id: true,
              },
              include: {
                base_fare: {
                  omit: {
                    id: true,
                    base_price_id: true,
                  },
                },
                discount: {
                  omit: {
                    id: true,
                    discount_id: true,
                  },
                },
                tax: {
                  omit: {
                    id: true,
                    tax_id: true,
                  },
                },
                total: {
                  omit: {
                    id: true,
                    total_price_id: true,
                  },
                },
              },
            },
            segments: {
              omit: {
                id: true,
                segment_id: true,
              },
              orderBy: { departure_time: "asc" },
              include: {
                legs: {
                  omit: {
                    id: true,
                    leg_id: true,
                  },
                  orderBy: { departure_time: "asc" },
                  include: {
                    carriers: {
                      omit: {
                        id: true,
                        carrier_id: true,
                      },
                    },
                    flight_info: {
                      omit: {
                        id: true,
                        flight_info_id: true,
                      },
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
      // 1. Loop through EVERY flight offer (not just [0])
      const updatedFlightOffers = item.flight_offers.map((offer) => {
        // 2. Calculate prices for each traveler type within this specific offer
        const updatedTravelerPrices = offer.traveler_price.map((price) => {
          const type = price.traveler_type;

          // Determine the count based on user search input
          const count =
            type === "INFANT"
              ? infantCount
              : type === "CHILD"
                ? childCount
                : adultCount;

          // Extract original amounts
          const base = price.price_breakdown?.base_fare?.amount ?? 0;
          const tax = price.price_breakdown?.tax?.amount ?? 0;
          const disc = price.price_breakdown?.discount?.amount ?? 0;
          const total = price.price_breakdown?.total?.amount ?? 0;

          // Return the traveler price object with multiplied totals
          return {
            ...price,
            price_breakdown: {
              ...price.price_breakdown,
              base_fare: {
                ...price.price_breakdown?.base_fare,
                amount: base * count,
              },
              tax: { ...price.price_breakdown?.tax, amount: tax * count },
              discount: {
                ...price.price_breakdown?.discount,
                amount: disc * count,
              },
              total: { ...price.price_breakdown?.total, amount: total * count },
            },
          };
        });

        // 3. Return the offer with its specific recalculated prices
        return {
          ...offer,
          traveler_price: updatedTravelerPrices,
        };
      });

      // 4. Return the full data item with all flight offers updated
      return {
        ...item,
        flight_offers: updatedFlightOffers,
      };
    });
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
    const filteredFlights = flightData.flatMap((data) =>
      data.flight_offers.filter((offer) => offer.token === queryParams.token),
    );
    return filteredFlights;
  } catch (error) {
    console.error("no such token available: ", error);
    return [];
  }
};

export const fetchCountryName = async (airportCode: string | undefined) => {
  try {
    if(airportCode === '' || !airportCode) return null;

    const airport = await prisma.airport.findUnique({
      where: { airport_code: airportCode },
      select: { city: true, country: true},
    });
    return {
      city: airport?.city ?? null,
      country: airport?.country ?? null,
    }
  } catch (error) {
    console.error("Error fetching country name: ", error);
    return null;
  }
}
