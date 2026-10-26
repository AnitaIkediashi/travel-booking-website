import { FlightBookingSuccess } from "@/components/sections/flights/flight_booking_success";
import { queryFlightToken } from "@/helpers/query_flights";
import { decryptObject } from "@/utils/crypto";
import { redirect } from "next/navigation";

const classStyle =
  "pt-[137px] md:pb-[120px] pb-12 text-center font-semibold font-montserrat";

type FlightPayload = {
  flowType: "flight";
  passengerNames: string[];
  totalTravelers: number;
  from: string;
  to: string;
  depart: string;
  return: string | undefined;
  adults: number;
  child: number;
  infant: number;
  cabin: string;
  trip: string;
  token: string;
  paymentIntentId: string;
  liveSeatFeesTotal: number | undefined;
  bookingId: string | undefined;
};

const FlightBookingSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId: string }>;
}) => {
  const encryptedBookingId = (await searchParams).bookingId;

  if (!encryptedBookingId)
    return <div className={classStyle}>Invalid Booking</div>;

  const bookingResponse = decryptObject<FlightPayload>(
    decodeURIComponent(encryptedBookingId),
  );

  if (bookingResponse.flowType !== "flight") {
    return <div className={classStyle}>Unknown Booking Type</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (new Date(bookingResponse.depart) < today) {
    redirect("/flight-flow/flight-search/listing");
  }

  if (bookingResponse.return && new Date(bookingResponse.return) < today) {
    redirect("/flight-flow/flight-search/listing");
  }

  const flightData = await queryFlightToken({
    adults: bookingResponse.adults,
    child: bookingResponse.child,
    infant: bookingResponse.infant,
    token: bookingResponse.token,
  });

  return (
    <FlightBookingSuccess
      offers={flightData}
      totalTravelers={bookingResponse.totalTravelers}
      passengerNames={bookingResponse.passengerNames}
      paymentIntentId={bookingResponse.paymentIntentId}
      liveSeatFeesTotal={bookingResponse.liveSeatFeesTotal ?? 0}
      bookingId={bookingResponse.bookingId}
    />
  );
};

export default FlightBookingSuccessPage;
