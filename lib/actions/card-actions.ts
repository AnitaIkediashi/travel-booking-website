"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import Stripe from "stripe";
import { PriceInfoProps, SaveCardOnSignupPayload } from "@/types/card_type";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { cardSchema } from "../zod_schema";

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

export async function processPaymentIntent(
  rawData: unknown,
  priceInfo: PriceInfoProps,
) {
  // 1. Re-validate on server (Security check)
  const validated = cardSchema.safeParse(rawData);

  if (!validated.success) {
    console.error("error message prettify: ", z.prettifyError(validated.error));
    return {
      success: false,
      // errors: validated.error.format(), // deprecated
      errors: z.treeifyError(validated.error), // replaced the format() in the new version of zod
    };
  }

  try {
    const priceDetails = priceInfo;

    const baseFare = priceDetails.base_amount || 0;
    const tax = priceDetails.tax_amount || 0;
    const discount = priceDetails.discount_amount || 0;

    const totalAmount = baseFare + tax + discount;
    const currency = (priceDetails.currency_code ?? "usd").toLowerCase();

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
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, redirect: "/signin" };
  }

  const userId = session.user.id;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
      { expand: ["payment_method"] },
    );

    const pm = paymentIntent.payment_method as Stripe.PaymentMethod;

    if (paymentIntent.metadata.saveCard === "true" && pm.card) {
      const cardName = paymentIntent.metadata.cardName;
      const last4 = pm.card.last4;
      const expMonth = pm.card.exp_month;
      const expYear = pm.card.exp_year;

      // Duplicate check
      const existingCard = await prisma.cardDetails.findFirst({
        where: { cardName, last4, expMonth, expYear, userId },
      });

      if (existingCard) {
        return {
          success: false,
          message: "Card already exists",
          hasCardAlreadyCreated: true,
        };
      }

      // ── Create or get Stripe customer HERE ──────────────────
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true, email: true },
      });

      let stripeCustomerId = user?.stripeCustomerId;

      if (!stripeCustomerId && user) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId },
        });

        stripeCustomerId = customer.id;

        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customer.id },
        });
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(pm.id, {
        customer: stripeCustomerId!,
      });
      // ────────────────────────────────────────────────────────

      await prisma.cardDetails.create({
        data: {
          stripePaymentMethodId: pm.id,
          cardType: pm.card.brand,
          last4,
          expMonth,
          expYear,
          cardName,
          country: paymentIntent.metadata.country,
          userId,
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


export async function saveCardOnSignup(cardData: SaveCardOnSignupPayload) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, redirect: "/signin" };
  }

  const userId = session.user.id;

  try {
    // Duplicate check
    const existingCard = await prisma.cardDetails.findFirst({
      where: {
        last4: cardData.last4,
        expMonth: cardData.expMonth,
        expYear: cardData.expYear,
        userId,
      },
    });

    if (existingCard) {
      return {
        success: false,
        message: "Card already exists",
        hasCardAlreadyCreated: true,
      };
    }

    await prisma.cardDetails.create({
      data: {
        stripePaymentMethodId: cardData.stripePaymentMethodId,
        cardType: cardData.cardType,
        last4: cardData.last4,
        expMonth: cardData.expMonth,
        expYear: cardData.expYear,
        cardName: cardData.cardName,
        country: cardData.country,
        userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Save Card Error:", error);
    return {
      success: false,
      message: "An error occurred while saving the card",
    };
  }
}

export async function getCardInfo() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, cards: [] };
  }

  try {
    const cards = await prisma.cardDetails.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" }, // newest first
    });

    return { success: true, cards };
  } catch (error) {
    console.error("Get Card Error:", error);
    return { success: false, cards: [] };
  }
}

export async function processPaymentWithSavedCard(
  savedCardId: string,
  priceInfo: PriceInfoProps,
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, redirect: "/signin" };
  }

  try {
    const card = await prisma.cardDetails.findFirst({
      where: { id: savedCardId, userId: session.user.id },
    });

    if (!card) {
      return { success: false, message: "Card not found." };
    }

    // stripeCustomerId should already exist — created when card was saved
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return { success: false, message: "No Stripe customer found." };
    }

    const baseFare = priceInfo.base_amount || 0;
    const tax = priceInfo.tax_amount || 0;
    const discount = priceInfo.discount_amount || 0;
    const totalAmount = baseFare + tax + discount;
    const currency = (priceInfo.currency_code ?? "usd").toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency,
      customer: user.stripeCustomerId, // ← already exists ✓
      payment_method: card.stripePaymentMethodId,
      confirm: true,
      off_session: true,
      metadata: {
        cardName: card.cardName,
        country: card.country,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error("Saved card payment error:", error);
    return { success: false, message: "Payment failed. Please try again." };
  }
}
