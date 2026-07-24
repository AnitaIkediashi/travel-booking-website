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

const flightOfferDetailInclude = {
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
  traveler_price: {
    omit: {
      id: true,
      flight_offer_id: true,
    },
  },
  price_breakdown: {
    omit: {
      id: true,
      flight_offer_id: true,
    },
  },
  segments: {
    omit: {
      id: true,
      segment_id: true,
      marketingCarrierId: true,
      operatingCarrierId: true,
    },
    orderBy: { departure_time: "asc" as const },
    include: {
      seat_availability: {
        omit: {
          id: true,
          seat_availability_id: true,
        },
      },
      flight_info: {
        omit: {
          id: true,
          flight_info_id: true,
        },
      },
      marketingCarrier: {
        omit: {
          id: true,
          carrier_id: true,
        },
      },
      operatingCarrier: {
        omit: {
          id: true,
          carrier_id: true,
        },
      },
      legs: {
        omit: {
          id: true,
          leg_id: true,
          departure_gate_id: true,
          arrival_gate_id: true,
        },
        orderBy: { departure_time: "asc" as const },
        include: {
          departure_gate: {
            omit: { id: true },
          },
          arrival_gate: {
            omit: { id: true },
          },
        },
      },
    },
  },
} satisfies Prisma.FlightOffersInclude;

export const queryFlightData = async (queryParams: FlightSearchParamsProps) => {
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

  //convert values to numbers
  const adultCount = Number(adults ?? 0);
  const childCount = Number(child ?? 0);
  const infantCount = Number(infant ?? 0);

  if (!depart) return []; // to check it depart exists or not

  const currentDate = new Date();
  // FIX: use setUTCHours to match how `depart`/`departDate` are parsed
  // (bare "yyyy-mm-dd" strings are parsed as UTC midnight). Using local
  // setHours() here could flag a valid "today" date as past depending on
  // the server's timezone offset.
  currentDate.setUTCHours(0, 0, 0, 0);

  const departDate = new Date(depart);

  const isPastDate = departDate < currentDate;
  // consider for trip type if one-way or round-trip, for the validation if queryParams is empty instead of returning all data.

  const isValidQuery =
    from &&
    to &&
    depart &&
    trip &&
    cabin &&
    !isPastDate &&
    (trip === "one-way" || (trip === "round-trip" && returnDate)) &&
    (adultCount > 0 || childCount > 0 || infantCount > 0);

  if (!isValidQuery) {
    return [];
  }

  if (trip === "round-trip" && returnDate) {
    const retDateObj = new Date(returnDate);
    if (retDateObj < departDate) {
      console.warn("\x1b[33m%s\x1b[0m", "Return date is before departure date");
      return [];
    }
  }

  try {
    const departRange = getDateRangeStrings(depart);
    const returnRange = getDateRangeStrings(returnDate);

    const mappedCabin =
      cabin === "Premium"
        ? "Premium Economy"
        : cabin === "First"
          ? "First Class"
          : cabin;

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
      cabin_class: {
        equals: mappedCabin,
        mode: "insensitive",
      },
      slice_index: 0, // 0 = Outbound
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
      cabin_class: {
        equals: mappedCabin,
        mode: "insensitive",
      },
      slice_index: 1, // 1 = Inbound
    };

    // trip_type is now a real enum on FlightOffers, so trip-type matching
    // is checked directly against it instead of being inferred purely
    // from which segments exist/don't exist.
    const tripTypeCondition: Prisma.FlightOffersWhereInput =
      trip === "round-trip"
        ? {
            trip_type: "ROUND_TRIP",
            AND: [
              { segments: { some: outboundFilter } },
              { segments: { some: inboundFilter } },
            ],
          }
        : {
            trip_type: "ONE_WAY",
            segments: { some: outboundFilter },
          };

    // Build ONE combined condition and reuse it for both the outer `where`
    // (which Data rows to fetch) and the inner include's `where` (which
    // offers within that Data row to include) so they always agree on
    // what counts as a match.
    const offerMatchCondition: Prisma.FlightOffersWhereInput = {
      AND: [
        {
          branded_fareinfo: {
            cabin_class: {
              equals: mappedCabin,
              mode: "insensitive",
            },
          },
        },
        tripTypeCondition,
      ],
    };

    const dataResponse = await prisma.data.findMany({
      where: {
        flight_offers: {
          some: offerMatchCondition,
        },
      },
      include: {
        flight_offers: {
          omit: {
            price_id: true,
            flight_offer_id: true,
          },
          where: offerMatchCondition, // same condition reused — outer and inner always agree
          include: flightOfferDetailInclude,
        },
      },
    });

    const finalData = dataResponse.map((item) => {
      // 1. Loop through EVERY flight offer (not just [0])
      const updatedFlightOffers = item.flight_offers.map((offer) => {
        let offerWideTotal = 0;
        let offerWideBase = 0;
        let offerWideTax = 0;

        const updatedTravelerPrices = offer.traveler_price.map((price) => {
          const type = price.passenger_type;
          const count =
            type === "INFANT"
              ? infantCount
              : type === "CHILD"
                ? childCount
                : adultCount;

          const base = Number(price.base_fare) * count;
          const tax = Number(price.tax_amount) * count;
          const total = Number(price.total_per_pax) * count;

          // Accumulate the global offer total
          offerWideBase += base;
          offerWideTax += tax;
          offerWideTotal += total;

          return {
            ...price,
            base_fare: base,
            tax_amount: tax,
            total_per_pax: total,
          };
        });

        return {
          ...offer,
          traveler_price: updatedTravelerPrices,
          // OVERWRITE the main price_breakdown with the calculated sum.
          // discount_amount isn't recalculated (there's no per-passenger
          // discount logic here), but it still needs converting out of
          // Prisma.Decimal into a plain number like the other three fields,
          // or it'd be the odd one out — a Decimal instance that doesn't
          // survive a JSON/server-to-client boundary the way a number does.
          price_breakdown: {
            ...offer.price_breakdown,
            base_amount: offerWideBase,
            tax_amount: offerWideTax,
            total_amount: offerWideTotal,
            discount_amount: offer.price_breakdown?.discount_amount
              ? Number(offer.price_breakdown.discount_amount)
              : 0,
          },
        };
      });

      // Return the full data item with all flight offers updated
      return {
        ...item,
        flight_offers: updatedFlightOffers,
      };
    });

    // console.log('flight data>> ', JSON.stringify(finalData, null, 2))
    return finalData;
  } catch (error) {
    console.error("Error querying flight data: ", error);
    return [];
  }
};

export const queryFlightToken = async ({
  token,
}: {
  token: string | undefined;
}) => {
  if (!token) return null;
  try {
    const flightOffer = await prisma.flightOffers.findFirst({
      where: {
        token: {
          equals: token,
        },
      },
      include: flightOfferDetailInclude,
    });

    if (!flightOffer) return null;
    
    return {
      ...flightOffer,
      traveler_price: flightOffer.traveler_price.map((price) => ({
        ...price,
        base_fare: Number(price.base_fare),
        tax_amount: Number(price.tax_amount),
        total_per_pax: Number(price.total_per_pax),
      })),
      price_breakdown: flightOffer.price_breakdown
        ? {
            ...flightOffer.price_breakdown,
            total_amount: Number(flightOffer.price_breakdown.total_amount),
            base_amount: Number(flightOffer.price_breakdown.base_amount),
            tax_amount: Number(flightOffer.price_breakdown.tax_amount),
            discount_amount: flightOffer.price_breakdown.discount_amount
              ? Number(flightOffer.price_breakdown.discount_amount)
              : 0,
          }
        : null,
    };
  } catch (error) {
    console.error("no such token available: ", error);
    return null;
  }
};

export const fetchCountryName = async (airportCode: string | undefined) => {
  try {
    if (airportCode === "" || !airportCode) return null;

    const airport = await prisma.airport.findUnique({
      where: { airport_code: airportCode },
      select: { city: true, country: true },
    });
    return {
      city: airport?.city ?? null,
      country: airport?.country ?? null,
    };
  } catch (error) {
    console.error("Error fetching country name: ", error);
    return null;
  }
};
