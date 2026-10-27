import { FlightBookingSuccess } from "@/components/sections/flights/flight_booking_success";
import { queryFlightToken } from "@/helpers/query_flights";
import { decryptObject } from "@/utils/crypto";
import { prisma } from "@/lib/prisma";

const classStyle =
  "pt-[137px] md:pb-[120px] pb-12 text-center font-semibold font-montserrat";

type SuccessToken = {
  bookingId: string;
  flowType: "flight" | "hotel";
  iat: number;
};

const FlightBookingSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId: string }>;
}) => {
  const encrypted = (await searchParams).bookingId;
  if (!encrypted) return <div className={classStyle}>Invalid Booking</div>;

  // any failure (malformed, tampered, wrong key) gets the same response
  let payload: SuccessToken;
  try {
    payload = decryptObject<SuccessToken>(decodeURIComponent(encrypted));
  } catch {
    return <div className={classStyle}>Invalid Booking</div>;
  }

  if (payload.flowType !== "flight" || !payload.bookingId) {
    return <div className={classStyle}>Unknown Booking Type</div>;
  }

  const booking = await prisma.booking.findFirst({
    where: { id: payload.bookingId, status: "CONFIRMED" },
    include: {
      passengers: {
        orderBy: { passenger_index: "asc" },
        select: { first_name: true, last_name: true },
      },
      seats: { select: { extra_fee: true } },
      flightOffer: { select: { token: true } },
    },
  });

  if (!booking) return <div className={classStyle}>Booking not found</div>;

  const flightData = await queryFlightToken({
    adults: booking.adults,
    child: booking.children,
    infant: booking.infants,
    token: booking.flightOffer.token,
  });

  const passengerNames = booking.passengers.map((p) =>
    `${p.first_name} ${p.last_name}`.trim(),
  );
  const seatFees = booking.seats.reduce((sum, s) => sum + s.extra_fee, 0);

  return (
    <FlightBookingSuccess
      offers={flightData}
      totalTravelers={booking.total_travelers}
      passengerNames={passengerNames}
      paymentIntentId={booking.payment_intent_id ?? ""}
      liveSeatFeesTotal={seatFees}
      bookingId={booking.id}
    />
  );
};

export default FlightBookingSuccessPage;
