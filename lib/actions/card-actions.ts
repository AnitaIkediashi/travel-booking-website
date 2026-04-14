"use server";

import { currentYearCentury } from "@/helpers/currentYearCentury";
import { validateLuhn } from "@/utils/luhnCheck";
import { z } from "zod";
import { prisma } from "../prisma";
import Stripe from "stripe";

type PriceInfoProps = {
  total?: TotalPriceProps | null;
  base_fare?: BasePriceProps | null;
  tax?: TaxPriceProps | null;
  discount?: DiscountPriceProps | null;
  service_fee?: ServiceFeeProps | null;
};

type TotalPriceProps = {
  currency_code: string;
  amount: number;
};

type BasePriceProps = {
  amount: number;
};

type TaxPriceProps = {
  amount: number;
};

type ServiceFeeProps = {
  amount: number;
};

type DiscountPriceProps = {
  amount: number;
};

/**
 * 1. This file is intended to hold server actions related to card management, such as adding, updating, or deleting cards. These actions will interact with the database and handle the business logic for card operations.
 * 2. I am also going to be using Zod for input validation in these actions to ensure that the data being processed is valid and secure.
 * 3. I am using 'unknown' cos i might know the shape of the data yet
 * 4. Every Zod schema stores an array of refinements. Refinements are a way to perform custom validation that Zod doesn't provide a native API for. the .refine API only generates a single issue with a "custom" error code, but .superRefine() makes it possible to create multiple issues using any of Zod's internal issue types
 * 5. safeParse method is the non-throwing way to validate data in Zod: it returns an object that either contains the parsed data or a ZodError, so you can avoid try/catch.
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
  cardType: z.string().optional(),
});

export async function processCardAddition(
  rawData: unknown,
  priceInfo: unknown,
  flowType: "flight" | "hotel",
) {
  // 1. Re-validate on server (Security check)
  const validated = cardSchema.safeParse(rawData);

  const priceDetails = priceInfo as PriceInfoProps;

  const baseFare = priceDetails.base_fare?.amount || 0;
  const tax = priceDetails.tax?.amount || 0;
  const serviceFee = priceDetails.service_fee?.amount || 0;
  const discount = priceDetails.discount?.amount || 0;

  const totalAmount = baseFare + tax + serviceFee - discount;
  const currency = priceDetails.total?.currency_code.toLowerCase() || "usd";

  const successPath =
    flowType === "flight"
      ? "/flight-flow/flight-search/listing/flight-detail/booking"
      : "/hotel-flow/hotel-search/listing/hotel-detail/booking";

  const cancelPath =
    flowType === "flight"
      ? "/flight-flow/flight-search/listing/flight-detail/checkout"
      : "/hotel-flow/hotel-search/listing/hotel-detail/checkout";

  if (!validated.success) {
    const formattedErrors = validated.error.format(); //deprecated but still works.

    return {
      success: false,
      errors: formattedErrors,
    };
  }

  // 2. THE PROCESSING (Database, Stripe, etc.)
  const { cardNumber, expDate, cvc, cardName, country, saveCard, cardType } =
    validated.data;

  const formattedCardNumber = cardNumber.replace(/\s/g, ""); // Remove spaces for storage/processing

  try {
    //db logic
    let dbMessage = "";
    if (saveCard) {
      const existingCardInfo = await prisma.cardDetails.findFirst({
        where: {
          cardNumber: formattedCardNumber,
          expDate,
          cvc,
        },
      });
      if (existingCardInfo) {
        dbMessage = "Card already exists";
        console.log("Card already exists in database.");
      }
      await prisma.cardDetails.create({
        data: {
          cardNumber: formattedCardNumber,
          expDate: expDate,
          cvc: cvc,
          cardName: cardName,
          country: country,
          cardType: cardType,
        },
      });
      dbMessage = "Card saved successfully!";
      console.log("Card metadata saved to database.");
    }
    const session = await stripe.checkout.sessions.create({
      ui_mode: "elements",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Price details", // You can customize this
              description: `Base: $${baseFare} + Tax: $${tax} + Service Fee: $${serviceFee} - Discount: $${discount}`,
            },
            unit_amount: totalAmount * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}${cancelPath}`,
    });

    return {
      success: true,
      message: saveCard
        ? `${dbMessage} Redirecting to payment...`
        : "Redirecting to secure payment...",
      url: session.url,
    };

  } catch (error) {
    console.error("Payment Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
