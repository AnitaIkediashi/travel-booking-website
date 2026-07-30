"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { passengerSchema, PassengerSchema, ContactInfoSchema, contactInfoSchema } from "../zod_schema";

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


export async function createBookingAction(formData: FormData) {
  const flightOfferId = formData.get("flightOfferId") as string;
  const totalTravelers = parseInt(formData.get("totalTravelers") as string);
  const redirectUrl = formData.get("redirectUrl") as string;

  const booking = await prisma.booking.create({
    data: {
      flight_offer_id: flightOfferId,
      total_travelers: totalTravelers,
      status: "IN_PROGRESS",
    },
  });

  redirect(`${redirectUrl}&bookingId=${booking.id}`);
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
  | { success: false; errors: z.core.$ZodErrorTree<PassengerSchema> }
> {
  const validated = passengerSchema.safeParse(passenger);
  if (!validated.success) {
    return {
      success: false,
      errors: z.treeifyError(validated.error),
    };
  }

  const data = {
    booking_id: bookingId || "",
    passenger_index: passengerIndex,
    first_name: validated.data.firstName,
    last_name: validated.data.lastName,
    gender: validated.data.gender,
    nationality: validated.data.nationality,
    date_of_birth: new Date(validated.data.dateOfBirth),
  };

  if (existingPassengerId) {
    await prisma.passenger.update({
      where: { id: existingPassengerId },
      data,
    });
    return { success: true, id: existingPassengerId }; 
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

  const validated = contactInfoSchema.safeParse(contactInfo);
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