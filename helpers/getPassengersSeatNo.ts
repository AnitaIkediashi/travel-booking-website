import { prisma } from "@/lib/prisma";

export async function getPassengerSeats(bookingId: string | undefined) {
  const passengers = await prisma.passenger.findMany({
    where: { booking_id: bookingId },
    include: { seat: true },
    orderBy: { passenger_index: "asc" },
  });

  return passengers.map((p) => ({
    name: `${p.first_name} ${p.last_name}`,
    seatNo: p.seat?.seat_number ?? "Not assigned",
  }));
}
