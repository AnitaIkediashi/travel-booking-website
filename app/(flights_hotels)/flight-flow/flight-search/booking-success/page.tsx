import { FlightBookingSuccess } from "@/components/sections/flights/flight_booking_success";
import { queryFlightToken } from "@/helpers/query_flights";
import { decryptObject } from "@/utils/crypto";

const classStyle =
  "pt-[137px] md:pb-[120px] pb-12 text-center font-semibold font-montserrat";

type FlightPayload = {
  flowType: "flight";
  cardName: string;
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
};

type HotelPayload = {
  flowType: "hotel";
  cardName: string;
  destination: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  roomCount: number;
  adultCount: number;
  childrenCount: number;
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

  //   console.log("Decrypted Booking ID:", bookingId); // Debug log to check the decrypted booking ID

  if (bookingId.flowType === "flight") {
    const totalTravelers =
      bookingId.adults + bookingId.child + bookingId.infant;
    const flightData = await queryFlightToken(bookingId);
    return (
      <FlightBookingSuccess
        offers={flightData}
        totalTravelers={totalTravelers}
        cardName={bookingId.cardName}
      />
    );
  } else if (bookingId.flowType === "hotel") {
    return;
  }

  return <div className={classStyle}>Unknown Booking Type</div>;
};

export default BookingSuccessPage;
