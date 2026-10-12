
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";
import { FlightBookingSteps } from "./flight_booking_steps";
import { getBookingSeatFeesTotal } from "@/helpers/getBookingSeatsTotal";
import { prisma } from "@/lib/prisma";

type FlightBookingProps = {
  offers: NewFlightOffer | null;
  totalTravelers: number;
  bookingId: string | undefined;
};

export const FlightBooking = async ({offers, totalTravelers, bookingId}: FlightBookingProps) => {
  if (!offers || Object.keys(offers).length === 0) return;

  const segments = offers.segments;

  const segmentsWithCities = await Promise.all(
    segments.map(async (segment) => {
      const departData = await fetchCountryName(segment.departure_airport_code);
      const arrivalData = await fetchCountryName(segment.arrival_airport_code);

      return {
        ...segment,
        departCity: departData?.city || "",
        arrivalCity: arrivalData?.city || "",
      };
    }),
  );

  const seatFeesTotal = await getBookingSeatFeesTotal(bookingId);

  const pricebreakdown = offers.price_breakdown

  const currency_id = pricebreakdown?.currency_id

  const currencyObj = currency_id
    ? await prisma.currency.findUnique({ where: { id: currency_id } })
    : null;

  const currency_code = currencyObj?.code.toLowerCase()

  return (
    <FlightBookingSteps
      offer={offers}
      segments={segmentsWithCities}
      totalTravelers={totalTravelers}
      bookingId={bookingId}
      seatFeesTotal={seatFeesTotal}
      currencyCode={currency_code}
    />
  );
}
