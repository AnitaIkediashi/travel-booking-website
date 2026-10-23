"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getRoomQuote } from "@/helpers/query_hotels";

const HOLD_MINUTES = 15;

type CreateBookingInput = {
  roomId: string;
  checkIn: string; // "YYYY-MM-DD"
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};

export async function createHotelBooking(input: CreateBookingInput) {
  const { roomId } = input;
  const adults = Math.min(Math.max(Math.trunc(input.adults) || 1, 1), 10);
  const children = Math.min(Math.max(Math.trunc(input.children) || 0, 0), 10);
  const rooms = Math.min(Math.max(Math.trunc(input.rooms) || 1, 1), 5);

  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (!roomId) return { error: "Missing room" };
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { error: "Invalid dates" };
  }
  if (checkIn < today || checkOut <= checkIn) {
    return { error: "Please choose valid check-in and check-out dates" };
  }

  // Never trust a price from the client. Recompute on the server.
  const quote = await getRoomQuote({
    roomId,
    checkIn,
    checkOut,
    adults,
    children,
  });
  if (!quote) return { error: "This room can't be priced for those dates" };

  let bookingId: string;

  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        const room = await tx.rooms.findUnique({
          where: { id: roomId },
          select: { total_rooms: true },
        });
        if (!room) throw new Error("ROOM_NOT_FOUND");

        // Same rule as the search query: confirmed/completed stays plus unexpired holds
        const taken = await tx.bookingRooms.count({
          where: {
            room_id: roomId,
            checkin_time: { lt: checkOut },
            checkout_time: { gt: checkIn },
            booking: {
              OR: [
                { status: { in: ["CONFIRMED", "COMPLETED"] } },
                { status: "IN_PROGRESS", hold_expires_at: { gt: new Date() } },
              ],
            },
          },
        });

        if (room.total_rooms - taken < rooms) throw new Error("SOLD_OUT");

        return tx.hotelBooking.create({
          data: {
            status: "IN_PROGRESS",
            total_guests: adults + children,
            adults,
            children,
            hold_expires_at: new Date(Date.now() + HOLD_MINUTES * 60_000),
            currency_symbol: quote.currency_symbol,
            currency_code: quote.currency_code,
            room_base_total: quote.base,
            room_tax_total: quote.tax,
            room_fee_total: quote.total,
            booking_rooms: {
              create: Array.from({ length: rooms }, () => ({
                room_id: roomId,
                checkin_time: checkIn,
                checkout_time: checkOut,
              })),
            },
          },
          select: { id: true },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    bookingId = booking.id;
  } catch (e) {
    if (e instanceof Error && e.message === "SOLD_OUT") {
      return { error: "Sorry, that room just sold out for your dates." };
    }
    if (e instanceof Error && e.message === "ROOM_NOT_FOUND") {
      return { error: "Room not found" };
    }
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2034"
    ) {
      return { error: "Another booking was in progress. Please try again." };
    }
    console.error(e);
    return { error: "Could not start your booking" };
  }

  // redirect() throws internally, so it stays outside the try/catch
  redirect(`/hotel-flow/hotel-search/hotel-detail/booking?bookingId=${bookingId}`);
}
