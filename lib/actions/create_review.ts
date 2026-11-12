"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { REVIEW_CATEGORIES } from "@/types/hotel_type";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Prisma } from "@/app/generated/prisma/client";
import { HOTEL_DETAIL_PATH } from "@/utils/page_routes";

type CreateReviewInput = {
  hotelId: string;
  category: string;
  feedback: string;
  stars: number;
};

type CreateReviewResult = { ok: true } | { ok: false; error: string };

export async function createReview(
  input: CreateReviewInput,
): Promise<CreateReviewResult> {
  // Never trust the client: check the session on the server too
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false, error: "You must be signed in to leave a review." };
  }

  const { hotelId, category, feedback, stars } = input;
  const trimmed = feedback.trim();

  if (!(REVIEW_CATEGORIES as readonly string[]).includes(category)) {
    return { ok: false, error: "Please choose a valid category." };
  }
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return { ok: false, error: "Please select a rating from 1 to 5." };
  }
  if (trimmed.length < 10 || trimmed.length > 1000) {
    return { ok: false, error: "Feedback must be 10–1000 characters." };
  }

  const hotel = await prisma.hotels.findUnique({
    where: { id: hotelId },
    select: { id: true, token: true },
  });
  if (!hotel) return { ok: false, error: "Hotel not found." };

  const userId = session.user.id;

  const existing = await prisma.reviews.findUnique({
    where: { user_id_hotel_id: { user_id: userId, hotel_id: hotelId } },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "You've already reviewed this hotel." };
  }

  try {
    await prisma.reviews.create({
      data: {
        hotel_id: hotelId,
        user_id: userId,
        customer_name: session.user.name ?? "Guest",
        category,
        feedback: trimmed,
        submit_time: new Date(),
        rating: { create: { stars, count: 1 } },
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return { ok: false, error: "You've already reviewed this hotel." };
    }
    console.error("createReview failed", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath(
    `${HOTEL_DETAIL_PATH}/${hotel.id}-${hotel.token}`,
  );
  return { ok: true };
}