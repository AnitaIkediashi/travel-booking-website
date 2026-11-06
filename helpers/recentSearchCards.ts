
import { Prisma } from "@/app/generated/prisma/client";
import { getOwnerId } from "@/lib/owner";
import { prisma } from "@/lib/prisma";

const MAX_AGE_DAYS = 30;
const KEEP = 10;
const SHOW = 4;

const ci = (value: string) => ({ equals: value, mode: "insensitive" as const });

function buildWhere(r: {
  destination: string;
  destinationType: string | null;
  destinationValue: string | null;
}): Prisma.HotelsWhereInput {
  const value = r.destinationValue ?? r.destination;

  switch (r.destinationType) {
    case "country":
      return { country: ci(value) };
    case "state":
      return { state: ci(value) };
    case "city":
      return { city: ci(value) };
    case "hotel":
      return { id: value };
    default:
      return {
        OR: [{ city: ci(value) }, { state: ci(value) }, { country: ci(value) }],
      };
  }
}

export async function getRecentSearchCards() {
  const ownerId = await getOwnerId();
  if (!ownerId) return [];

  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  // 1. Clear this person's stale rows
  await prisma.hotelRecentSearch.deleteMany({
    where: { ownerId, updatedAt: { lt: cutoff } },
  });

  // 2. Clear anything beyond their latest KEEP rows
  const overflow = await prisma.hotelRecentSearch.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    skip: KEEP,
    select: { id: true },
  });
  if (overflow.length) {
    await prisma.hotelRecentSearch.deleteMany({
      where: { id: { in: overflow.map((r) => r.id) } },
    });
  }

  // 3. Read the fresh rows
  const recent = await prisma.hotelRecentSearch.findMany({
    where: { ownerId, updatedAt: { gte: cutoff } },
    orderBy: { updatedAt: "desc" },
    take: SHOW,
  });

  // 4. Subtitle and image per destination
  const cards = await Promise.all(
    recent.map(async (r) => {
      const where = buildWhere(r);

      if (r.destinationType === "hotel") {
        const hotel = await prisma.hotels.findFirst({
          where,
          select: { city: true, country: true, thumb_nails: true },
        });
        return {
          ...r,
          places: null as number | null,
          subtitle: hotel ? `${hotel.city}, ${hotel.country}` : "",
          image: hotel?.thumb_nails?.[0] ?? null,
        };
      }

      const [places, sample] = await Promise.all([
        prisma.hotels.count({ where }),
        prisma.hotels.findFirst({
          where,
          select: { thumb_nails: true },
        }),
      ]);

      return {
        ...r,
        places: places as number | null,
        subtitle: `${places} places`,
        image: sample?.thumb_nails?.[0] ?? null,
      };
    }),
  );

  return cards.filter((c) => c.subtitle);
}
