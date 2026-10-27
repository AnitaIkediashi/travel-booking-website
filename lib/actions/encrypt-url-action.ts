"use server";

import { encryptObject } from "@/utils/crypto";
import { prisma } from "@/lib/prisma";

export async function getSecureBookingUrl(
  bookingId: string,
  flowType: "flight" | "hotel",
) {
  try {
    const confirmed =
      flowType === "hotel"
        ? await prisma.hotelBooking.findFirst({
            where: { id: bookingId, status: "CONFIRMED" },
            select: { id: true },
          })
        : await prisma.booking.findFirst({
            where: { id: bookingId, status: "CONFIRMED" },
            select: { id: true },
          });

    if (!confirmed) return { success: false, error: "Booking not confirmed" };

    return {
      success: true,
      bookingId: encryptObject({ bookingId, flowType, iat: Date.now() }),
    };
  } catch (error) {
    console.error("Secure URL error:", error);
    return { success: false, error: "Could not create booking link" };
  }
}
