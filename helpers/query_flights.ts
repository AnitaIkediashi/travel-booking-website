import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { SearchParamsProps } from "@/types/flight_type";

const getDateRangeStrings = (dateString: string | undefined) => {
  if (!dateString) return undefined;

  // 1. Manually split the string to avoid any local timezone parsing
  // Input: "2026-01-16" -> [2026, 01, 16]
  const [year, month, day] = dateString.split("-").map(Number);

  // 2. Create the START of the window (00:00:00.000 UTC)
  // Note: Month is 0-indexed in JS (January is 0)
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  // 3. Create the END of the window (Exactly 24 hours later)
  // We use +1 instead of +2 to strictly search that specific calendar day
  const end = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0));

  console.log("--- Search Window ---");
  console.log("Searching for flights between (UTC):");
  console.log("Start:", start.toISOString()); // e.g. 2026-01-16T00:00:00.000Z
  console.log("End:  ", end.toISOString()); // e.g. 2026-01-17T00:00:00.000Z

  return {
    gte: start,
    lt: end,
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

    // 1. Define Outbound Logic - one-way by default
    // SegmentWhereInput - This contains the generated type object for the properties added to the model
    const outboundFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: { equals: from, mode: "insensitive" },
      arrival_airport_code: { equals: to, mode: "insensitive" },
      departure_time: departRange,
    };

    // 2. Define Inbound Logic (Swapped Airports) - when it comes to round-trip
    const inboundFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: { equals: to, mode: "insensitive" },
      arrival_airport_code: { equals: from, mode: "insensitive" },
      departure_time: returnRange,
    };

    // Construct the conditions for the where clause
    const conditions: Prisma.DataWhereInput[] = [
      { cabin_class: { contains: cabin } },
      {
        flight_offers: {
          some: {
            trip_type: trip,
            segments: { some: outboundFilter }, // Must have outbound
          },
        },
      },
    ];

    // If round-trip, the SAME Data record must ALSO have a flight_offer with the return segment
    if (trip === "round-trip" && returnRange) {
      conditions.push({
        flight_offers: {
          some: {
            segments: { some: inboundFilter }, // Must also have inbound
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
              where:
                trip === "round-trip"
                  ? { OR: [outboundFilter, inboundFilter] }
                  : outboundFilter,
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

queryFlightData({
  from: "TPE",
  to: "AMS",
  trip: "round-trip",
  depart: "2026-01-16",
  return: "2026-02-17",
  cabin: "Premium Economy",
});
