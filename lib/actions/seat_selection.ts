
"use server";

import { prisma } from "@/lib/prisma";

export async function getSeatsAndPassengers(
  bookingId: string,
  flightOfferId: string,
) {
  const [seats, passengers] = await Promise.all([
    prisma.seat.findMany({
      where: {
        seat_id: flightOfferId,
        is_booked: false,
        OR: [
          { booking_id: null },
          { held_until: { lt: new Date() } },
          { booking_id: bookingId },
        ],
      },
      orderBy: { seat_number: "asc" },
    }),
    prisma.passenger.findMany({
      where: { booking_id: bookingId },
      orderBy: { passenger_index: "asc" },
    }),
  ]);
  return { seats, passengers };
}

export async function holdSeat(
  bookingId: string,
  seatId: number,
  passengerId: string,
) {
  const result = await prisma.seat.updateMany({
    where: {
      id: seatId,
      is_booked: false,
      OR: [{ booking_id: null }, { held_until: { lt: new Date() } }],
    },
    data: {
      booking_id: bookingId,
      held_until: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  if (result.count === 0) {
    return { success: false, error: "Seat no longer available" };
  }

  await prisma.passenger.update({
    where: { id: passengerId },
    data: { seat_id: seatId },
  });

  return { success: true };
}

export async function releaseSeat(passengerId: string) {
  const passenger = await prisma.passenger.findUnique({
    where: { id: passengerId },
  });
  if (!passenger?.seat_id) return;

  await prisma.seat.update({
    where: { id: passenger.seat_id },
    data: { booking_id: null, held_until: null },
  });
  await prisma.passenger.update({
    where: { id: passengerId },
    data: { seat_id: null },
  });
}

export async function confirmAllSeatsAssigned(
  bookingId: string,
  totalTravelers: number,
) {
  const seatedCount = await prisma.passenger.count({
    where: { booking_id: bookingId, seat_id: { not: null } },
  });
  if (seatedCount < totalTravelers) return false;

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "HELD",
      hold_expires_at: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  return true;
}
