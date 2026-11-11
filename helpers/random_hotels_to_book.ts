import { prisma } from "@/lib/prisma";

export async function randomHotelsToBook(count = 4) {
  // 1. Pick random hotel ids (only hotels that actually have a priced, available room)
  const picked = await prisma.$queryRaw<{ id: string }[]>`
    SELECT h.id
    FROM hotels h
    WHERE EXISTS (
      SELECT 1
      FROM rooms r
      JOIN room_price_breakdown p ON p.rooms_id = r.id
      WHERE r.hotel_id = h.id AND r.room_left > 0
    )
    ORDER BY random()
    LIMIT ${count}
  `;

  if (picked.length === 0) return [];

  // 2. Load those hotels with the price data needed for "from" pricing
  const hotels = await prisma.hotels.findMany({
    where: { id: { in: picked.map((h) => h.id) } },
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
      thumb_nails: true,
      rooms: {
        where: { room_left: { gt: 0 }, price_breakdown: { isNot: null } },
        select: {
          price_breakdown: {
            select: {
              total_amount: true,
              currency: { select: { symbol: true } },
            },
          },
        },
      },
    },
  });

  // 3. Reduce rooms -> a single starting price (Decimal -> number so it's serializable)
  return hotels.map(({ rooms,thumb_nails, ...hotel }) => {
    const cheapest = rooms
      .map((r) => r.price_breakdown!)
      .sort((a, b) => a.total_amount.comparedTo(b.total_amount))[0];

    return {
      ...hotel,
      thumbnail: thumb_nails.length
        ? thumb_nails[Math.floor(Math.random() * thumb_nails.length)]
        : null,
      startingPrice: cheapest ? Number(cheapest.total_amount) : null,
      currencySymbol: cheapest?.currency.symbol ?? null,
    };
  });
}
