"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import Stripe from "stripe";
import { PriceInfoProps } from "@/types/card_type";

/**
 * 1. This file is intended to hold server actions related to card management, such as adding, updating, or deleting cards. These actions will interact with the database and handle the business logic for card operations.
 * 2. I am also going to be using Zod for input validation in these actions to ensure that the data being processed is valid and secure.
 * 3. I am using 'unknown' cos i might know the shape of the data yet
 * 4. Every Zod schema stores an array of refinements. Refinements are a way to perform custom validation that Zod doesn't provide a native API for. the .refine API only generates a single issue with a "custom" error code, but .superRefine() makes it possible to create multiple issues using any of Zod's internal issue types
 * 5. safeParse method is the non-throwing way to validate data in Zod: it returns an object that either contains the parsed data or a ZodError, so you can avoid try/catch.
 * 6. For the Stripe integration, I use the Payment Intents API rather than the Checkout Session API because the checkout flow is fully customized on my side instead of relying on Stripe’s default checkout. This allows me to include elements like tax, discounts, and service fees directly in the total amount. The Payment Intents API is used to collect and process payments immediately, while a PaymentIntent object manages the entire payment lifecycle—from creation to completion—and handles any required authentication steps along the way.
 * Note:  PaymentIntent requires a customer-configured Account or Customer object - authenticated 
 * 7. By adding the **expand property**, you are telling Stripe: "Don't just give me the ID string; go fetch the full object and embed it right here." With expansion, your result becomes a nested object:
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // secret key for the server 'sk'

// define the schema
const cardSchema = z.object({
  cardName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name is too short"),
  country: z.string().min(1, "Select a country"),
  saveCard: z.boolean().optional(),
  cardType: z.string().optional(),
});

export async function processPaymentIntent(
  rawData: unknown,
  priceInfo: PriceInfoProps,
) {
  // 1. Re-validate on server (Security check)
  const validated = cardSchema.safeParse(rawData);

  if (!validated.success) {
    console.error("error message: ", z.prettifyError(validated.error));
    return {
      success: false,
      errors: validated.error.format(),
    };
  }

  try {
    const priceDetails = priceInfo;

    const baseFare = priceDetails.base_fare?.amount || 0;
    const tax = priceDetails.tax?.amount || 0;
    const serviceFee = priceDetails.service_fee?.amount || 0;
    const discount = priceDetails.discount?.amount || 0;

    const totalAmount = baseFare + tax + serviceFee - discount;
    const currency = (priceDetails.total?.currency_code ?? "usd").toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
      currency,
      // If saveCard is true, Stripe prepares the card for future "off-session" use
      setup_future_usage: validated.data.saveCard ? "off_session" : undefined,
      metadata: {
        cardName: validated.data.cardName,
        country: validated.data.country,
        saveCard: String(validated.data.saveCard),
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Payment Error:", error);
    return { success: false, message: "Internal Server Error" };
  }
}

export async function saveCardToDatabase(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      {
        expand: ["payment_method"], // you want to fetch extra keywords such as the payment methods
      },
    );

    const pm = paymentIntent.payment_method as Stripe.PaymentMethod;

    // Check if the user opted to save and we have card details
    if (paymentIntent.metadata.saveCard === "true" && pm.card) {
      const cardName = paymentIntent.metadata.cardName;
      const last4 = pm.card.last4;
      const expMonth = pm.card.exp_month;
      const expYear = pm.card.exp_year;

      // 1. Check if a card with these exact details already exists for this user
      const existingCard = await prisma.cardDetails.findFirst({
        where: {
          cardName: cardName,
          last4: last4,
          expMonth: expMonth,
          expYear: expYear,
          // userid: currentUser.id (you would need to get the current user's ID from your auth context/session) - soon
        },
      });

      // 2. If it exists, return the specific flag to the UI
      if (existingCard) {
        return {
          success: false,
          message: "Card already exists",
          hasCardAlreadyCreated: true,
        };
      }

      // 3. Otherwise, proceed with creation
      await prisma.cardDetails.create({
        data: {
          stripePaymentMethodId: pm.id,
          cardType: pm.card.brand,
          last4: last4,
          expMonth: expMonth,
          expYear: expYear,
          cardName: cardName,
          country: paymentIntent.metadata.country,
        },
      });

      return { success: true };
    }

    return { success: false, message: "Save card option not selected" };
  } catch (error) {
    console.error("Migration Error:", error);
    return {
      success: false,
      message: "An error occurred while saving the card",
    };
  }
}
