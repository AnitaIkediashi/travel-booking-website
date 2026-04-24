"use server";

import { encryptObject } from "@/utils/crypto";

export async function getSecureBookingUrl(payload: object) {
  try {
    const encryptedData = encryptObject(payload);
    return { success: true, bookingId: encryptedData };
  } catch (error) {
    return { success: false, error: `Encryption failed: ${error}` };
  }
}
