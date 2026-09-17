import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { HotelSearchProps } from "@/types/hotel_type";

export async function searchAvailableHotels(params: HotelSearchProps) {
  const { destination, checkIn, checkOut, adults, children, rooms } = params;

  const destCon = `%${destination}%`
}
