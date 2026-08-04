import { prisma } from "@/lib/prisma";

export async function getBookingSeatFeesTotal(bookingId: string | undefined) {
  if (!bookingId) return 0;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { seat_fees_total: true },
  });

  console.log("seat_fees_total from DB:", booking?.seat_fees_total);

  return Number(booking?.seat_fees_total ?? 0);
}
