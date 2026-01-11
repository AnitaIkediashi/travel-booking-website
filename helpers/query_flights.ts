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
      adults,
      children,
    } = queryParams;

    const dataResponse = await prisma.data.findFirst({
      include: {
        flight_offers: {
          include: {
            segments: {
              include: {
                legs: true,
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
        baggage: true,
        min_price: true,
        short_layover_connection: true,
        airlines: true,
        duration: true,
        departure_intervals: true
      },
    });
    console.log('data response: ', JSON.stringify(dataResponse, null, 2))
  } catch (error) {
    console.error("Error querying flight data: ", error);
  }
};

queryFlightData({
    from: 'SSA',
    to: 'PTA'
})
