"use server";
import { currentYearCentury } from "@/helpers/currentYearCentury";
import { validateLuhn } from "@/utils/luhnCheck";
/**
 * 1. This file is intended to hold server actions related to card management, such as adding, updating, or deleting cards. These actions will interact with the database and handle the business logic for card operations.
 * 2. I am also going to be using Zod for input validation in these actions to ensure that the data being processed is valid and secure.
 */
import { z } from "zod";

// define the schema
const cardSchema = z.object({
  cardNumber: z.string().refine((val) => validateLuhn(val.replace(/\s/g, "")), {
    message: "Invalid card number",
  }),
  expDate: z
    .string()
    .min(1, "Expiration date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)")
    .superRefine((val, ctx) => {
      // 1. Split and parse values
      const [monthStr, yearStr] = val.split("/");
      const month = parseInt(monthStr, 10);
      const year = parseInt(currentYearCentury + yearStr, 10);

      // 2. Get current date context
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // 3. Custom Month Logic (though regex handles 01-12,
      // you can add extra logic here if needed)
      if (month < 1 || month > 12) {
        ctx.addIssue({
          code: "custom",
          message: "Month must be 01-12",
        });
        return; // Stop further checks if this fails
      }

      // 4. Expiration Logic
      if (
        year < currentYear ||
        (year === currentYear && month < currentMonth)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Card has expired",
        });
      }
    }),
  cvc: z
    .string()
    .min(1, "CVC is required")
    .length(3, "CVC must be exactly 3 digits")
    .regex(/^\d+$/, "CVC must only contain numbers"),
  cardName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name is too short"),
  country: z.string().min(1, "Select a country"),
  saveCard: z.boolean().optional(),
});


export async function processCardAddition(rawData: unknown) {
  // 1. Re-validate on server (Security check)
  const validated = cardSchema.safeParse(rawData);

  if (!validated.success) {
    const formattedErrors = validated.error.format();

    return {
      success: false,
      errors: formattedErrors,
    };
  }

  // 2. THE PROCESSING (Database, Stripe, etc.)
  console.log("Processing secure data on server:", validated.data);
  // await db.save(validated.data);
  return { success: true };
}
