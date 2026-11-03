import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { REVIEW_CATEGORIES } from "@/types/hotel_type";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

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

  try {
    await prisma.reviews.create({
      data: {
        hotel_id: hotelId,
        customer_name: session.user.name ?? "Guest",
        category,
        feedback: trimmed,
        submit_time: new Date(),
        // Rating is a 1:1 relation, so create it in the same transaction
        rating: { create: { stars, count: 1 } },
      },
    });
  } catch (e) {
    console.error("createReview failed", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  revalidatePath(
    `/hotel-flow/hotel-search/listing/hotel-detail/${hotel.id}-${hotel.token}`,
  );
  return { ok: true };
}