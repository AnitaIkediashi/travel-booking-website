import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { HotelSearchProps } from "@/types/hotel_type";

function getDateRangeCondition(dateString: string | undefined) {
  if (!dateString) return undefined;
  const start = new Date(dateString);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(dateString);
  end.setUTCHours(23, 59, 59, 999);

  return ` ${start} AND ${end}`;
}

export async function searchAvailableHotels(params: HotelSearchProps) {
  const { destination, checkIn, checkOut, adults, children, rooms } = params;

  const checkInDate = new Date(checkIn);

  const checkOutDate = new Date(checkOut);

  const adultCount = Number(adults ?? 0);
  const childrenCount = Number(children ?? 0);
  const roomCount = Number(rooms ?? 0);

  const currentDate = new Date();

  currentDate.setUTCHours(0, 0, 0, 0);

  const isPastDate = checkInDate < currentDate;

  const isValidParam =
    destination &&
    checkIn &&
    checkOut &&
    (adultCount > 0 || childrenCount > 0 || roomCount > 0) &&
    !isPastDate;

  if (!isValidParam) {
    return [];
  }

  if (checkOutDate <= checkInDate) {
    return [];
  }

  const destCon = `%${destination}%`;

  const checkInRange = getDateRangeCondition(checkIn);
  const checkOutRange = getDateRangeCondition(checkOut);

  const query = await prisma.$queryRaw<
    {
      room_id: string;
      room_type: string;
      bed_count: number;
      total_rooms: number;
      rooms_booked: bigint;
      hotel_id: string;
      hotel_name: string;
      hotel_thumb_nails: string[];
      hotel_amenities: string[];
      room_amenities: string[];
      room_left: number;
      room_features: string[];
      room_size: number;
      latitude: string;
      longitude: string;
      description: string;
      token: string;
      city: string;
      country: string;
      review_count: number;
      star_count: number;
      room_total_amount: Prisma.Decimal | null;
      room_base_amount: Prisma.Decimal | null;
      room_tax_amount: Prisma.Decimal | null;
      room_discount_amount: Prisma.Decimal | null;
      per_guest_total_amount: Prisma.Decimal | null;
      per_guest_base_amount: Prisma.Decimal | null;
      per_guest_tax_amount: Prisma.Decimal | null;
      per_guest_discount_amount: Prisma.Decimal | null;
      currency_symbol: string | null;
      customer_name: string;
      review_category: string;
      customer_feedback: string;
      customer_submit_time: string;
      customer_image: string | null;
      rule_checkin_time: string;
      rule_checkout_time: string;
      rule_category: string;
      rule_description: string;
      room_description: string;
    }[]
  >(
    Prisma.sql`
    SELECT
    
    `,
  );
}
