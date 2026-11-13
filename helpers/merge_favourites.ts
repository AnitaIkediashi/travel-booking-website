import { prisma } from "@/lib/prisma";

export async function mergeGuestFavourites(guestId: string, userId: string) {
  const guest = await prisma.hotelFavourite.findMany({
    where: { ownerId: guestId },
  });
  if (!guest.length) return;

  await prisma.$transaction([
    prisma.hotelFavourite.createMany({
      data: guest.map((g) => ({
        ownerId: userId,
        hotel_id: g.hotel_id,
        createdAt: g.createdAt,
      })),
      skipDuplicates: true,
    }),
    prisma.hotelFavourite.deleteMany({ where: { ownerId: guestId } }),
  ]);
}
