"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  // append bookingId to whatever the existing search params URL is
  redirect(`${redirectUrl}&bookingId=${booking.id}`);
}
