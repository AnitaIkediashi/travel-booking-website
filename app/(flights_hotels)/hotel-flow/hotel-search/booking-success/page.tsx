import { decryptObject } from "@/utils/crypto";
import { prisma } from "@/lib/prisma";
import { HotelBookingSuccess } from "@/components/sections/hotels/hotel_booking_success";

const classStyle =
  "pt-[137px] md:pb-[120px] pb-12 text-center font-semibold font-montserrat";

type HotelPayload = {
  flowType: "hotel";
  bookingId: string | undefined;
  paymentIntentId: string;
};

const HotelBookingSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId: string }>;
}) => {
  const encrypted = (await searchParams).bookingId;
  if (!encrypted) return <div className={classStyle}>Invalid Booking</div>;

  const payload = decryptObject<HotelPayload>(decodeURIComponent(encrypted));

  if (payload.flowType !== "hotel" || !payload.bookingId) {
    return <div className={classStyle}>Unknown Booking Type</div>;
  }

  const booking = await prisma.hotelBooking.findUnique({
    where: { id: payload.bookingId },
    include: {
      guests: { orderBy: { guest_index: "asc" } },
      booking_rooms: { include: { room: { include: { hotel: true } } } },
    },
  });

  if (!booking || booking.status !== "CONFIRMED") {
    return <div className={classStyle}>Booking not found</div>;
  }

  return (
    <HotelBookingSuccess
      paymentIntentId={payload.paymentIntentId}
      booking={{
        id: booking.id,
        currencySymbol: booking.currency_symbol,
        total: Number(booking.room_fee_total ?? 0),
        contactEmail: booking.contact_email,
        guestNames: booking.guests.map((g) => `${g.first_name} ${g.last_name}`),
        hotel: booking.booking_rooms[0].room.hotel,
        rooms: booking.booking_rooms.map((br) => ({
          id: br.id,
          roomType: br.room.room_type,
          checkin: br.checkin_time,
          checkout: br.checkout_time,
        })),
      }}
    />
  );
};

export default HotelBookingSuccessPage;
