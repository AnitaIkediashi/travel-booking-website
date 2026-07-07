"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { passengerSchema, PassengerSchema } from "../zod_schema";

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
  idType: "PASSPORT" | "NATIONAL_ID";
  idNumber: string;
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
    id_type: validated.data.idType,
    id_number: validated.data.idNumber,
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