import { Prisma } from "@/app/generated/prisma/client";

export type DestinationProp = {
  id: string;
  name: string;
  country: string;
  city: string;
  state: string;
};

export type HotelSearchParams = {
  searchParams: Promise<HotelSearchProps>
};

export type HotelSearchProps = {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};

export type HotelListsProps = {
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
};
