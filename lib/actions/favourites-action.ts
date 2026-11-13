"use server";

import { FavouriteHotel, Stay } from "@/types/hotel_type";
import { getOrCreateOwnerId, getOwnerId } from "../owner";
import { prisma } from "../prisma";

export async function getFavouriteIds(): Promise<string[]> {
  const ownerId = await getOwnerId();
  if (!ownerId) return [];
  const rows = await prisma.hotelFavourite.findMany({
    where: { ownerId },
    select: { hotel_id: true },
  });
  return rows.map((r) => r.hotel_id);
}

export async function setFavourite(hotelId: string, saved: boolean) {
  if (typeof hotelId !== "string" || !hotelId) throw new Error("Invalid hotel");
  const ownerId = await getOrCreateOwnerId();

  if (saved) {
    await prisma.hotelFavourite.upsert({
      where: { ownerId_hotel_id: { ownerId, hotel_id: hotelId } },
      update: {},
      create: { ownerId, hotel_id: hotelId },
    });
  } else {
    await prisma.hotelFavourite.deleteMany({
      where: { ownerId, hotel_id: hotelId },
    });
  }
  return { saved };
}

export async function getFavouriteHotels(input: {
  stay: Stay;
  city?: string | null;
  limit?: number;
}): Promise<FavouriteHotel[]> {
  const ownerId = await getOwnerId();
  if (!ownerId) return [];

  const rows = await prisma.hotelFavourite.findMany({
    where: {
      ownerId,
      ...(input.city
        ? { hotel: { city: { equals: input.city, mode: "insensitive" } } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: input.limit,
    include: {
      hotel: {
        include: {
          reviews: { select: { rating: { select: { stars: true } } } },
          rooms: {
            where: { room_left: { gt: 0 } },
            include: { price_breakdown: { include: { currency: true } } },
          },
        },
      },
    },
  });

  return rows.map(({ hotel: h }) => {
    let price: FavouriteHotel["price"] = null;
    for (const room of h.rooms) {
      const p = room.price_breakdown;
      if (!p) continue;
      const base = Number(p.base_amount);
      const discount = Number(p.discount_amount ?? 0);
      const amount = base - discount;
      if (!price || amount < price.amount) {
        price = {
          amount,
          original: discount > 0 ? base : null,
          currency: p.currency.code,
        };
      }
    }

    const stars = h.reviews
      .map((r) => r.rating?.stars)
      .filter((s): s is number => typeof s === "number");
    const rating = stars.length
      ? stars.reduce((a, b) => a + b, 0) / stars.length
      : null;

    return {
      id: h.id,
      token: h.token,
      name: h.name,
      city: h.city,
      country: h.country,
      image: h.thumb_nails[0] ?? null,
      imageCount: h.thumb_nails.length,
      amenityCount: h.amenities.length,
      rating: rating === null ? null : Math.round(rating * 10) / 10,
      reviewCount: h.reviews.length,
      price,
    };
  });
}
