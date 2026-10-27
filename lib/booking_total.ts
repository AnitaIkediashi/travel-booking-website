import { prisma } from "@/lib/prisma";

const toCents = (d: { toNumber(): number }) => Math.round(d.toNumber() * 100);

export async function getFlightTotal(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      passengers: { select: { id: true } },
      seats: { select: { extra_fee: true } },
      flightOffer: {
        include: {
          traveler_price: true,
          price_breakdown: { include: { currency: true } },
        },
      },
    },
  });

  if (!booking) throw new Error("Booking not found");
  if (!["IN_PROGRESS", "HELD"].includes(booking.status))
    throw new Error("Booking not payable");
  if (booking.hold_expires_at && booking.hold_expires_at < new Date())
    throw new Error("Hold expired");

  const counts: Record<string, number> = {
    ADULT: booking.adults,
    CHILD: booking.children,
    INFANT: booking.infants,
  };
  if (
    booking.passengers.length !==
    booking.adults + booking.children + booking.infants
  )
    throw new Error("Passenger count mismatch");

  const currency =
    booking.flightOffer.price_breakdown?.currency.code.toLowerCase();
  if (!currency) throw new Error("Offer has no price");

  // Same maths as queryFlightToken: rate per passenger type x count
  const fareCents = booking.flightOffer.traveler_price.reduce(
    (sum, t) =>
      sum + toCents(t.total_per_pax) * (counts[t.passenger_type] ?? 0),
    0,
  );
  const seatCents = booking.seats.reduce((s, x) => s + x.extra_fee * 100, 0);

  // Discounts: decide per-person or per-booking, then SUBTRACT here.
  return { fareCents, seatCents, amountCents: fareCents + seatCents, currency };
}

// Kept so the shared payment components keep working until hotel is reviewed.
export async function getHotelTotal(bookingId: string) {
  const b = await prisma.hotelBooking.findUnique({
    where: { id: bookingId },
    select: {
      status: true,
      hold_expires_at: true,
      room_fee_total: true,
      currency_code: true,
    },
  });
  if (!b) throw new Error("Booking not found");
  if (b.status !== "IN_PROGRESS") throw new Error("Booking not payable");
  if (b.hold_expires_at && b.hold_expires_at < new Date())
    throw new Error("Hold expired");
  if (b.room_fee_total == null) throw new Error("Booking has no price");
  return {
    amountCents: toCents(b.room_fee_total),
    currency: b.currency_code.toLowerCase(),
  };
}

export async function getBookingTotal(flowType: string, bookingId: string) {
  if (flowType === "flight") return getFlightTotal(bookingId);
  if (flowType === "hotel") return getHotelTotal(bookingId);
  throw new Error("Unknown flow type");
}
