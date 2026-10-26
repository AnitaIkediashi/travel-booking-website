"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { sendHotelBookingConfirmationEmail } from "@/helpers/send_hotel_booking_confirmation";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getRoomQuote } from "@/helpers/query_hotels";
import { stripe } from "../stripe";
import { contactInfoSchema, passengerSchema } from "../zod_schema";
import z from "zod";

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

async function getEditableBooking(bookingId: string | undefined) {
  if (!bookingId) return null;
  const booking = await prisma.hotelBooking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true, hold_expires_at: true },
  });
  if (!booking || booking.status !== "IN_PROGRESS") return null;
  if (booking.hold_expires_at && booking.hold_expires_at < new Date())
    return null;
  return booking;
}

export async function getGuestsForBooking(bookingId: string | undefined) {
  if (!bookingId) return [];
  return prisma.guest.findMany({
    where: { booking_id: bookingId },
    orderBy: { guest_index: "asc" },
    select: {
      id: true,
      guest_index: true,
      first_name: true,
      last_name: true,
      gender: true,
      nationality: true,
      date_of_birth: true,
    },
  });
}

export async function getContactInfoForHotelBooking(
  bookingId: string | undefined,
) {
  if (!bookingId) return null;
  return prisma.hotelBooking.findUnique({
    where: { id: bookingId },
    select: { contact_email: true, contact_phoneNo: true },
  });
}

export async function saveHotelContactInfo(
  bookingId: string | undefined,
  rawData: { email: string; phoneNo: string },
) {
  // logged in: always use the account email, ignoring what was typed
  const session = await getServerSession(authOptions);
  const emailToUse = session?.user?.email ?? rawData.email;

  const validated = contactInfoSchema.safeParse({
    ...rawData,
    email: emailToUse,
  });
  if (!validated.success) {
    return { success: false as const, errors: z.treeifyError(validated.error) };
  }

  const booking = await getEditableBooking(bookingId);
  if (!booking)
    return { success: false as const, errors: "Reservation expired" };

  await prisma.hotelBooking.update({
    where: { id: booking.id },
    data: {
      contact_email: validated.data.email,
      contact_phoneNo: validated.data.phoneNo,
    },
  });
  return { success: true as const };
}

export async function saveGuest(
  bookingId: string | undefined,
  rawData: unknown,
  guestIndex: number,
  guestId?: string,
) {
  const validated = passengerSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false as const, errors: z.treeifyError(validated.error) };
  }
  const booking = await getEditableBooking(bookingId);
  if (!booking)
    return { success: false as const, errors: "Reservation expired" };

  const data = {
    first_name: validated.data.firstName,
    last_name: validated.data.lastName,
    gender: validated.data.gender,
    nationality: validated.data.nationality,
    date_of_birth: validated.data.dateOfBirth,
    guest_index: guestIndex,
  };

  // Find by id first, then by (booking, index) so a refresh can't create duplicates
  const existing = guestId
    ? await prisma.guest.findFirst({
        where: { id: guestId, booking_id: booking.id },
      })
    : await prisma.guest.findFirst({
        where: { booking_id: booking.id, guest_index: guestIndex },
      });

  const saved = existing
    ? await prisma.guest.update({ where: { id: existing.id }, data })
    : await prisma.guest.create({ data: { ...data, booking_id: booking.id } });

  return { success: true as const, id: saved.id };
}

export async function confirmHotelBookingAndNotify(
  bookingId: string,
  paymentIntentId: string,
) {
  try {
    const booking = await prisma.hotelBooking.findUnique({
      where: { id: bookingId },
      select: { id: true, status: true, room_fee_total: true },
    });
    if (!booking) return { success: false, message: "Booking not found" };
    if (booking.status === "CONFIRMED") {
      return { success: true, alreadyConfirmed: true }; // no duplicate email on retries
    }

    // Don't trust the client: verify the payment with Stripe
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    const expected = Math.round(Number(booking.room_fee_total ?? 0) * 100);
    if (pi.status !== "succeeded" || pi.amount !== expected) {
      console.error(
        "Payment verification failed",
        pi.status,
        pi.amount,
        expected,
      );
      return { success: false, message: "Payment not verified" };
    }

    // Only flip IN_PROGRESS -> CONFIRMED once, even with concurrent calls
    const updated = await prisma.hotelBooking.updateMany({
      where: { id: bookingId, status: "IN_PROGRESS" },
      data: { status: "CONFIRMED", hold_expires_at: null },
    });
    if (updated.count === 0) return { success: true, alreadyConfirmed: true };

    // never throws: logs and returns on failure, so a mail problem can't fail the booking
    await sendHotelBookingConfirmationEmail(bookingId);

    return { success: true };
  } catch (error) {
    console.error("confirmHotelBookingAndNotify error:", error);
    return { success: false, message: "Failed to confirm booking" };
  }
}
