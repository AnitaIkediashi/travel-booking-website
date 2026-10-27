import { BookingWrapper } from "@/components/sections/flights/booking_wrapper";
import { FlightBooking } from "@/components/sections/flights/flight_booking";
import { queryFlightToken } from "@/helpers/query_flights";
import { prisma } from "@/lib/prisma";
import { FlightSearchParams } from "@/types/flight_type";
import { redirect } from "next/navigation";

const FlightBookingPage = async ({ searchParams }: FlightSearchParams) => {
  const searchProps = await searchParams;

  const {
    from,
    to,
    depart,
    return: returnDate,
    adults,
    cabin,
    child,
    infant,
    token,
    trip,
    bookingId
  } = searchProps;

  // if (!depart) return []; // to check it depart exists or not

  // const currentDate = new Date();

  // currentDate.setHours(0, 0, 0, 0);

  // const departDate = new Date(depart);

  // const isPastDate = departDate < currentDate;

  // const isReturnDateValid =
  //   trip === "round-trip" && returnDate && new Date(returnDate) < departDate;

  // const adultCount = +(adults ?? 0);
  // const childCount = +(child ?? 0);
  // const infantCount = +(infant ?? 0);
  // const totalTravelers = adultCount + childCount + infantCount;

  // const isValidQuery =
  //   from &&
  //   to &&
  //   depart &&
  //   trip &&
  //   cabin &&
  //   token &&
  //   !isPastDate &&
  //   !isReturnDateValid &&
  //   (adultCount > 0 || childCount > 0 || infantCount > 0);

  // if (!isValidQuery) {
  //   redirect("/flight-flow/flight-search/listing");
  // }

  // const newParams = {
  //   adults: adultCount,
  //   child: childCount,
  //   infant: infantCount,
  //   token,
  // };

  // const flightData = await queryFlightToken(newParams);

  if (!depart) redirect("/flight-flow/flight-search/listing"); // was: return []

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0); // was setHours, to match queryFlightData

  const departDate = new Date(depart);
  const isPastDate = departDate < currentDate;
  const isReturnDateInvalid =
    trip === "round-trip" && returnDate && new Date(returnDate) < departDate;

  // the stored booking decides the counts, not the editable URL
  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { adults: true, children: true, infants: true },
      })
    : null;

  const adultCount = booking?.adults ?? +(adults ?? 0);
  const childCount = booking?.children ?? +(child ?? 0);
  const infantCount = booking?.infants ?? +(infant ?? 0);
  const totalTravelers = adultCount + childCount + infantCount;

  const isValidQuery =
    from &&
    to &&
    depart &&
    trip &&
    cabin &&
    token &&
    !isPastDate &&
    !isReturnDateInvalid &&
    totalTravelers > 0;

  if (!isValidQuery) redirect("/flight-flow/flight-search/listing");

  const flightData = await queryFlightToken({
    adults: adultCount,
    child: childCount,
    infant: infantCount,
    token,
  });

  return (
    <BookingWrapper
    type="flight"
      flightChild={
        <FlightBooking
          offers={flightData}
          totalTravelers={totalTravelers}
          bookingId={bookingId}
        />
      }
    />
  );
};

export default FlightBookingPage;
