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
  try {
    return await prisma.$transaction(async (tx) => {
      const passenger = await tx.passenger.findUnique({
        where: { id: passengerId },
        select: { seat_id: true },
      });

      // release this passenger's previous seat, if any
      if (passenger?.seat_id && passenger.seat_id !== seatId) {
        await tx.seat.update({
          where: { id: passenger.seat_id },
          data: { booking_id: null, held_until: null },
        });
      }

      // if another passenger in this booking already holds the seat being clicked, unassign them first
      await tx.passenger.updateMany({
        where: {
          booking_id: bookingId,
          seat_id: seatId,
          id: { not: passengerId },
        },
        data: { seat_id: null },
      });

      const result = await tx.seat.updateMany({
        where: {
          id: seatId,
          is_booked: false,
          OR: [
            { booking_id: null },
            { held_until: { lt: new Date() } },
            { booking_id: bookingId },
          ],
        },
        data: {
          booking_id: bookingId,
          held_until: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      if (result.count === 0) {
        throw new Error("Seat no longer available");
      }

      await tx.passenger.update({
        where: { id: passengerId },
        data: { seat_id: seatId },
      });

      return { success: true as const };
    });
  } catch (err) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Could not hold seat",
    };
  }
}

export async function releaseSeat(passengerId: string) {
  const passenger = await prisma.passenger.findUnique({
    where: { id: passengerId },
  });
  if (!passenger?.seat_id) return;

  await prisma.$transaction([
    prisma.seat.update({
      where: { id: passenger.seat_id },
      data: { booking_id: null, held_until: null },
    }),
    prisma.passenger.update({
      where: { id: passengerId },
      data: { seat_id: null },
    }),
  ]);
}

export async function confirmAllSeatsAssigned(
  bookingId: string,
  totalTravelers: number,
) {
  const passengers = await prisma.passenger.findMany({
    where: { booking_id: bookingId, seat_id: { not: null } },
    include: { seat: true },
  });

  if (passengers.length < totalTravelers) return false;

  const seatFeesTotal = passengers.reduce(
    (sum, p) => sum + (p.seat?.extra_fee ?? 0),
    0,
  );

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "HELD",
      hold_expires_at: new Date(Date.now() + 10 * 60 * 1000),
      seat_fees_total: seatFeesTotal,
    },
  });
  return true;
}
