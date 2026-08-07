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

type HotelPayload = {
  flowType: "hotel";
  // cardName: string;
  destination: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  roomCount: number;
  adultCount: number;
  childrenCount: number;
  paymentIntentId: string;
};

type BookingPayload = FlightPayload | HotelPayload;

const BookingSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId: string }>; 
}) => {
  const encryptedBookingId = (await searchParams).bookingId;

  if (!encryptedBookingId)
    return <div className={classStyle}>Invalid Booking</div>;

  const bookingResponse = decryptObject<BookingPayload>(
    decodeURIComponent(encryptedBookingId),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //   console.log("Decrypted Booking ID:", bookingId); // Debug log to check the decrypted booking ID

  if (bookingResponse.flowType === "flight") {
    const departDate = new Date(bookingResponse.depart);

    if (departDate < today) {
      redirect("/flight-flow/flight-search/listing");
    }

    // Check return date too if it's a round trip
    if (bookingResponse.return) {
      const returnDate = new Date(bookingResponse.return);
      if (returnDate < today) {
        redirect("/flight-flow/flight-search/listing");
      }
    }

    const newParams = {
      adults: bookingResponse.adults,
      child: bookingResponse.child,
      infant: bookingResponse.infant,
      token: bookingResponse.token,
    };

    const flightData = await queryFlightToken(newParams);
    
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
  } else if (bookingResponse.flowType === "hotel") {
    if (bookingResponse.checkInDate) {
      const checkInDate = new Date(bookingResponse.checkInDate);
      if (checkInDate < today) {
        redirect("/hotel-flow/hotel-search/listing");
      }
    }

    if (bookingResponse.checkOutDate) {
      const checkOutDate = new Date(bookingResponse.checkOutDate);
      if (checkOutDate < today) {
        redirect("/hotel-flow/hotel-search/listing");
      }
    }
    return;
  }

  return <div className={classStyle}>Unknown Booking Type</div>;
};

export default BookingSuccessPage;
