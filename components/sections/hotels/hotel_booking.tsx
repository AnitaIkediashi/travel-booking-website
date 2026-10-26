import { NoData } from "@/components/reusable/no_data";
import { prisma } from "@/lib/prisma";
import { HotelBookingSteps } from "./hotel_booking_steps";

type HotelBookingProps = {
  bookingId: string | undefined;
};

export const HotelBooking = async ({ bookingId }: HotelBookingProps) => {
  const booking = await prisma.hotelBooking.findUnique({
    where: { id: bookingId },
    include: {
      booking_rooms: { include: { room: { include: { hotel: true } } } },
    },
  });
  if (!booking || booking.booking_rooms.length === 0) {
    return <NoData content="No records found" goBack={true} />;
  }

  const { room } = booking.booking_rooms[0];
  const { hotel } = room;

  const expired =
    booking.status !== "IN_PROGRESS" ||
    (booking.hold_expires_at && booking.hold_expires_at < new Date());

  if (expired) {
    return (
      <section className="pt-[137px] pb-12 font-montserrat text-center">
        <p className="text-lg font-bold">This reservation has expired</p>
        <p className="mt-2 text-sm opacity-75">
          Please go back and search again.
        </p>
      </section>
    );
  }

  // Decimal -> number (Decimal can't cross the server/client boundary)
  const base = Number(booking.room_base_total ?? 0);
  const tax = Number(booking.room_tax_total ?? 0);
  const total = Number(booking.room_fee_total ?? 0); // base + tax - discount
  const discount = Math.max(0, Math.round((base + tax - total) * 100) / 100);

  return (
    <HotelBookingSteps
      hotel={hotel}
      room={room}
      booking={{
        id: booking.id,
        totalGuests: booking.total_guests,
        currencyCode: booking.currency_code,
        currencySymbol: booking.currency_symbol,
        rooms: booking.booking_rooms.map((br) => ({
          id: br.id,
          roomType: br.room.room_type,
          bedCount: br.room.bed_count,
          sizeSqft: br.room.size_sqft,
          checkin: br.checkin_time,
          checkout: br.checkout_time,
        })),
        pricing: { base, tax, discount, total },
      }}
    />
  );
};
