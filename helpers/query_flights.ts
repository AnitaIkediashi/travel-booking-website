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

    // 1. Define Outbound Logic - one-way by default
    // SegmentWhereInput - This contains the generated type object for the properties added to the model
    const outboundFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: { equals: from },
      arrival_airport_code: { equals: to },
      departure_time: { startsWith: depart },
    };

    // 2. Define Inbound Logic (Swapped Airports) - when it comes to round-trip
    const inboundFilter: Prisma.SegmentWhereInput = {
      departure_airport_code: { equals: to },
      arrival_airport_code: { equals: from },
      departure_time: { startsWith: returnDate },
    };

    // 3. Combine them based on Trip Type
    const combinedSegmentFilter: Prisma.SegmentWhereInput =
      trip === "round-trip"
        ? { OR: [outboundFilter, inboundFilter] }
        : outboundFilter;

    const dataResponse = await prisma.data.findFirst({
      include: {
        flight_offers: {
          include: {
            segments: {
              where: combinedSegmentFilter,
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
                  some: outboundFilter,
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
    // console.log('data response: ', JSON.stringify(dataResponse, null, 2))
    return dataResponse;
  } catch (error) {
    console.error("Error querying flight data: ", error);
  }
};