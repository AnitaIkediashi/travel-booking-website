"use server";

import { getOrCreateOwnerId } from "../owner";
import { prisma } from "../prisma";

export async function saveHotelRecentSearch(input: {
  destination: string;
  destinationType?: string;
  destinationValue?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
}) {
  if (!input.destination) return;
  const ownerId = await getOrCreateOwnerId();

  await prisma.hotelRecentSearch.upsert({
    where: { ownerId_destination: { ownerId, destination: input.destination } },
    update: { ...input },
    create: { ownerId, ...input },
  });
}
