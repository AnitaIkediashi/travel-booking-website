
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";
import { FlightBookingSteps } from "./flight_booking_steps";

type FlightBookingProps = {
  offers: NewFlightOffer[] | undefined;
  totalTravelers: number;
  bookingId: string | undefined;
};

export const FlightBooking = async ({offers, totalTravelers, bookingId}: FlightBookingProps) => {
  if (!offers || offers.length === 0) return;

  const segments = offers[0].segments;

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


  return (
    <FlightBookingSteps
      offer={offers[0]}
      segments={segmentsWithCities}
      totalTravelers={totalTravelers}
      bookingId={bookingId}
    />
  );
}
