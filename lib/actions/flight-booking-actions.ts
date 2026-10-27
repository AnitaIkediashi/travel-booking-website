"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  passengerSchema,
  PassengerSchema,
  ContactInfoSchema,
  contactInfoSchema,
} from "../zod_schema";
import { sendFlightBookingConfirmationEmail } from "@/helpers/send_booking_confirmation";
import { stripe } from "../stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { getFlightTotal } from "../booking_total";

export type ContactInfoInput = {
  email: string;
  phoneNo: string;
};

type SaveContactInfoResult =
  | { success: true }
  | {
      success: false;
      errors: z.core.$ZodErrorTree<ContactInfoSchema> | string;
    };

const LISTING = "/flight-flow/flight-search/listing";
const BOOKING = "/flight-flow/flight-search/listing/flight-detail/booking";

export async function createBookingAction(formData: FormData) {
  const str = (k: string) => String(formData.get(k) ?? "");
  const num = (k: string) => Number(formData.get(k) ?? 0);

  const token = str("token");
  const adults = num("adults");
  const child = num("child");
  const infant = num("infant");
  const total = adults + child + infant;

  const countsValid =
    [adults, child, infant].every((n) => Number.isInteger(n) && n >= 0) &&
    total >= 1 &&
    total <= 9 &&
    infant <= adults; // remove if your search allows it

  if (!token || !countsValid) redirect(LISTING);

  const offer = await prisma.flightOffers.findUnique({
    where: { token },
    select: { id: true },
  });
  if (!offer) redirect(LISTING);

  const booking = await prisma.booking.create({
    data: {
      flight_offer_id: offer.id,
      total_travelers: total,
      adults,
      children: child,
      infants: infant,
      status: "IN_PROGRESS",
    },
  });

  const params = new URLSearchParams({
    from: str("from"),
    to: str("to"),
    depart: str("depart"),
    trip: str("trip"),
    cabin: str("cabin"),
    adults: String(adults),
    child: String(child),
    infant: String(infant),
    token,
    bookingId: booking.id,
  });
  if (str("trip") === "round-trip" && str("return")) {
    params.set("return", str("return"));
  }

  redirect(`${BOOKING}?${params.toString()}`);
}

type PassengerInput = {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  nationality: string;
  dateOfBirth: string;
};

export async function savePassenger(
  bookingId: string | undefined,
  passenger: PassengerInput,
  passengerIndex: number,
  existingPassengerId?: string,
): Promise<
  | { success: true; id: string }
  | { success: false; errors: z.core.$ZodErrorTree<PassengerSchema> | string }
> {
  const validated = passengerSchema.safeParse(passenger);
  if (!validated.success) {
    return { success: false, errors: z.treeifyError(validated.error) };
  }

  if (!bookingId) return { success: false, errors: "Missing booking ID" };

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true, total_travelers: true },
  });
  if (!booking || !["IN_PROGRESS", "HELD"].includes(booking.status)) {
    return { success: false, errors: "Booking not editable" };
  }
  if (passengerIndex < 0 || passengerIndex >= booking.total_travelers) {
    return { success: false, errors: "Invalid passenger index" };
  }

  const data = {
    booking_id: bookingId,
    passenger_index: passengerIndex,
    first_name: validated.data.firstName,
    last_name: validated.data.lastName,
    gender: validated.data.gender,
    nationality: validated.data.nationality,
    date_of_birth: new Date(validated.data.dateOfBirth),
  };

  if (existingPassengerId) {
    const res = await prisma.passenger.updateMany({
      where: { id: existingPassengerId, booking_id: bookingId },
      data,
    });
    if (res.count === 0)
      return { success: false, errors: "Passenger not found" };
    return { success: true, id: existingPassengerId };
  }

  // a refresh or double click shouldn't create a second passenger at the same index
  const existing = await prisma.passenger.findFirst({
    where: { booking_id: bookingId, passenger_index: passengerIndex },
    select: { id: true },
  });
  if (existing) {
    await prisma.passenger.update({ where: { id: existing.id }, data });
    return { success: true, id: existing.id };
  }

  const created = await prisma.passenger.create({ data });
  return { success: true, id: created.id };
}

export async function getPassengersForBooking(bookingId: string | undefined) {
  return prisma.passenger.findMany({
    where: { booking_id: bookingId },
    orderBy: { passenger_index: "asc" },
  });
}

export async function saveContactInfo(
  bookingId: string | undefined,
  contactInfo: ContactInfoInput,
): Promise<SaveContactInfoResult> {
  if (!bookingId) {
    return { success: false, errors: "Missing booking ID" };
  }

  // if logged in, always use the account email, ignoring whatever was typed
  const session = await getServerSession(authOptions);
  const emailToUse = session?.user?.email ?? contactInfo.email;

  const validated = contactInfoSchema.safeParse({
    ...contactInfo,
    email: emailToUse,
  });

  if (!validated.success) {
    return { success: false, errors: z.treeifyError(validated.error) };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      contact_email: validated.data.email,
      contact_phone: validated.data.phoneNo,
    },
  });

  return { success: true };
}

export async function getContactInfoForBooking(bookingId: string | undefined) {
  if (!bookingId) return null;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { contact_email: true, contact_phone: true },
  });

  return booking;
}

export async function confirmBookingAndNotify(
  bookingId: string,
  paymentIntentId: string,
) {
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, payment_intent_id: true },
    });
    if (!booking) return { success: false, message: "Booking not found" };

    if (booking.status === "CONFIRMED") {
      return booking.payment_intent_id === paymentIntentId
        ? { success: true, alreadyConfirmed: true }
        : { success: false, message: "Booking already paid" };
    }

    let valid = false;
    try {
      const { amountCents, currency } = await getFlightTotal(bookingId);
      valid =
        pi.status === "succeeded" &&
        pi.metadata.bookingId === bookingId &&
        pi.amount_received === amountCents &&
        pi.currency === currency;
    } catch (e) {
      console.error("Total check failed:", e);
    }

    if (!valid) {
      // refund only a payment that was made for THIS booking
      if (pi.status === "succeeded" && pi.metadata.bookingId === bookingId) {
        await stripe.refunds.create({ payment_intent: pi.id });
      }
      return { success: false, message: "Payment could not be verified" };
    }

    const result = await prisma.booking.updateMany({
      where: { id: bookingId, status: { in: ["IN_PROGRESS", "HELD"] } },
      data: { status: "CONFIRMED", payment_intent_id: pi.id },
    });
    if (result.count === 0) return { success: true, alreadyConfirmed: true };

    await sendFlightBookingConfirmationEmail(bookingId);
    return { success: true };
  } catch (error) {
    console.error("confirmBookingAndNotify error:", error);
    return { success: false, message: "Failed to confirm booking" };
  }
}