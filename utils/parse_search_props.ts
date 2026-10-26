import { HotelSearchProps } from "@/types/hotel_type";

const toInt = (
  v: string | undefined,
  fallback: number,
  min: number,
  max: number,
) => {
  const n = parseInt(v ?? "", 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
};

export const parseSearchProps = (p: HotelSearchProps) => ({
  checkIn: p.checkIn,
  checkOut: p.checkOut,
  adults: toInt(p.adults, 1, 1, 10),
  children: toInt(p.children, 0, 0, 10),
  rooms: toInt(p.rooms, 1, 1, 5),
});
