import { FavouriteHotel, Stay } from "@/types/hotel_type";
import { HOTEL_DETAIL_PATH } from "./page_routes";

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Read the current search from URL params, falling back to tonight (like trip.com). */
export function resolveStay(
  get: (key: string) => string | null | undefined,
): Stay {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const num = (key: string, fallback: number, min: number) => {
    const raw = get(key);
    const n = Number(raw);
    return raw && Number.isFinite(n) && n >= min ? n : fallback;
  };

  return {
    checkIn: get("checkIn") || iso(today),
    checkOut: get("checkOut") || iso(tomorrow),
    adults: num("adults", 1, 1),
    children: num("children", 0, 0),
    rooms: num("rooms", 1, 1),
  };
}

const fmtDay = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(y, m - 1, day));
};

/** "Thu, Nov 12 - Fri, Nov 13 · 1 room, 1 adult, 0 children" */
export function formatStayLine(s: Stay) {
  return (
    `${fmtDay(s.checkIn)} - ${fmtDay(s.checkOut)} · ` +
    `${s.rooms} ${s.rooms === 1 ? "room" : "rooms"}, ` +
    `${s.adults} ${s.adults === 1 ? "adult" : "adults"}, ` +
    `${s.children} ${s.children === 1 ? "child" : "children"}`
  );
}

export function buildDetailHref(
  h: Pick<FavouriteHotel, "id" | "token" | "name">,
  s: Stay,
) {
  const qs = new URLSearchParams({
    hotelId: h.id,
    destination: h.name,
    checkIn: s.checkIn,
    checkOut: s.checkOut,
    adults: String(s.adults),
    children: String(s.children),
    rooms: String(s.rooms),
    token: h.token,
  });
  return `${HOTEL_DETAIL_PATH}/${h.id}-${h.token}?${qs.toString()}`;
}
