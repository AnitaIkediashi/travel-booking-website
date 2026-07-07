import { FlightBookingSuccess } from "@/components/sections/flights/flight_booking_success";
import { queryFlightToken } from "@/helpers/query_flights";
import { decryptObject } from "@/utils/crypto";
import { redirect } from "next/navigation";

const classStyle =
  "pt-[137px] md:pb-[120px] pb-12 text-center font-semibold font-montserrat";

type FlightPayload = {
  flowType: "flight";
  // cardName: string;
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
  searchParams: Promise<{ bookingId: string }>; // Wrap in Promise
}) => {
  const encryptedBookingId = (await searchParams).bookingId;

  if (!encryptedBookingId)
    return <div className={classStyle}>Invalid Booking</div>;

  const bookingId = decryptObject<BookingPayload>(
    decodeURIComponent(encryptedBookingId),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //   console.log("Decrypted Booking ID:", bookingId); // Debug log to check the decrypted booking ID

  if (bookingId.flowType === "flight") {
    const departDate = new Date(bookingId.depart);
  
    if (departDate < today) {
      redirect("/flight-flow/flight-search/listing");
    }

    // Check return date too if it's a round trip
    if (bookingId.return) {
      const returnDate = new Date(bookingId.return);
      if (returnDate < today) {
        redirect("/flight-flow/flight-search/listing");
      }
    }
    const totalTravelers =
      bookingId.adults + bookingId.child + bookingId.infant;
    const flightData = await queryFlightToken({ token: bookingId.token });
    return (
      <FlightBookingSuccess
        offers={flightData}
        totalTravelers={totalTravelers}
        // cardName={bookingId.cardName}
        paymentIntentId={bookingId.paymentIntentId}
      />
    );
  } else if (bookingId.flowType === "hotel") {
    if (bookingId.checkInDate) {
      const checkInDate = new Date(bookingId.checkInDate);
      if (checkInDate < today) {
        redirect("/hotel-flow/hotel-search/listing");
      }
    }

    if (bookingId.checkOutDate) {
      const checkOutDate = new Date(bookingId.checkOutDate);
      if (checkOutDate < today) {
        redirect("/hotel-flow/hotel-search/listing");
      }
    }
    return;
  }

  return <div className={classStyle}>Unknown Booking Type</div>;
};

export default BookingSuccessPage;
