import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { HotelSearchProps, HotelListsProps, HotelDetail, QuoteInput, RoomQuote } from "@/types/hotel_type";

const MS_PER_DAY = 86_400_000;
const round2 = (n: number) => Math.round(n * 100) / 100;

const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

const REVIEW_LIMIT = 50;

export async function searchAvailableHotels(
  params: HotelSearchProps,
  options: { includeSoldOut?: boolean } = {},
): Promise<HotelListsProps[]> {
  const {
    destination,
    destinationType,
    destinationValue,
    checkIn,
    checkOut,
    adults,
    children,
    rooms,
  } = params;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const adultCount = Number(adults ?? 0);
  const childrenCount = Number(children ?? 0);
  const roomCount = Math.max(Number(rooms ?? 1), 1);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (
    !destination?.trim() ||
    isNaN(checkInDate.getTime()) ||
    isNaN(checkOutDate.getTime()) ||
    !Number.isInteger(adultCount) ||
    !Number.isInteger(childrenCount) ||
    adultCount < 1 || // at least one adult must travel
    childrenCount < 0 ||
    checkInDate < today ||
    checkOutDate <= checkInDate
  ) {
    return [];
  }

  const nights = Math.round(
    (checkOutDate.getTime() - checkInDate.getTime()) / MS_PER_DAY,
  );

  let destinationFilter: Prisma.Sql;

  if (destinationType && destinationValue) {
    switch (destinationType) {
      case "hotel":
        destinationFilter = Prisma.sql`h.id = ${destinationValue}`;
        break;
      case "city":
        destinationFilter = Prisma.sql`LOWER(h.city) = LOWER(${destinationValue})`;
        break;
      case "state":
        destinationFilter = Prisma.sql`LOWER(h.state) = LOWER(${destinationValue})`;
        break;
      case "country":
        destinationFilter = Prisma.sql`LOWER(h.country) = LOWER(${destinationValue})`;
        break;
      default:
        return [];
    }
  } else {
    const destCon = `%${escapeLike(destination.trim())}%`;
    destinationFilter = Prisma.sql`(
      h.city    ILIKE ${destCon}
      OR h.state   ILIKE ${destCon}
      OR h.country ILIKE ${destCon}
      OR h.name    ILIKE ${destCon}
    )`;
  }

  const availabilityFilter = options.includeSoldOut
    ? Prisma.empty
    : Prisma.sql`AND (r.total_rooms - COALESCE(bk.rooms_booked, 0)) >= ${roomCount}::int`;

  return prisma.$queryRaw<HotelListsProps[]>(Prisma.sql`
    SELECT
      t.*,
      ${nights}::int AS nights,

      ROUND(
        (t.adult_price * ${adultCount}::int
          + COALESCE(t.child_price, 0) * ${childrenCount}::int)::numeric,
        2
      )::float AS price_per_night,

      ROUND(
        ((t.adult_price * ${adultCount}::int
          + COALESCE(t.child_price, 0) * ${childrenCount}::int)
          * ${nights}::int)::numeric,
        2
      )::float AS stay_total
    FROM (
      SELECT
        h.id                     AS hotel_id,
        h.name                   AS hotel_name,
        h.thumb_nails            AS hotel_thumb_nails,
        h.amenities              AS hotel_amenities,
        h.latitude,
        h.longitude,
        h.description,
        h.token,
        h.city,
        h.state,
        h.country,

        r.id                     AS room_id,
        r.room_type,
        r.bed_count,
        r.total_rooms,
        r.amenities              AS room_amenities,
        r.features               AS room_features,
        r.size_sqft              AS room_size,
        r.description            AS room_description,

        COALESCE(bk.rooms_booked, 0)                   AS rooms_booked,
        (r.total_rooms - COALESCE(bk.rooms_booked, 0)) AS room_left,

        COALESCE(rv.review_count, 0)                   AS review_count,
        rv.avg_rating                                  AS avg_rating,

        rpb.total_amount::float       AS room_total_amount,
        rpb.base_amount::float        AS room_base_amount,
        rpb.tax_amount::float         AS room_tax_amount,
        rpb.discount_amount::float    AS room_discount_amount,

        gp_adult.total_per_pax::float AS adult_price,
        gp_child.total_per_pax::float AS child_price,
        c.symbol                 AS currency_symbol,
        c.code                   AS currency_code
      FROM rooms r
      JOIN hotels h ON h.id = r.hotel_id

      -- rooms of this type already taken during the requested stay
      LEFT JOIN LATERAL (
        SELECT COUNT(br.id)::int AS rooms_booked
        FROM booking_rooms br
        JOIN hotel_booking hb ON hb.id = br.booking_id
        WHERE br.room_id = r.id
          AND br.checkin_time  < ${checkOutDate}
          AND br.checkout_time > ${checkInDate}
          AND (
            hb.status = 'CONFIRMED'
            OR (hb.status = 'IN_PROGRESS' AND hb.hold_expires_at > NOW())
          )
      ) bk ON true

      -- hotel-level review summary
      LEFT JOIN LATERAL (
        SELECT COUNT(rev.id)::int            AS review_count,
               ROUND(AVG(rt.stars), 1)::float AS avg_rating
        FROM reviews rev
        LEFT JOIN ratings rt ON rt.review_id = rev.id
        WHERE rev.hotel_id = h.id
      ) rv ON true

      LEFT JOIN room_price_breakdown rpb ON rpb.rooms_id = r.id
      LEFT JOIN currency c ON c.id = rpb.currency_id
      LEFT JOIN guest_prices gp_adult
             ON gp_adult.room_id = r.id
            AND gp_adult.currency_id = rpb.currency_id
            AND gp_adult.guest_type = 'adult'
      LEFT JOIN guest_prices gp_child
             ON gp_child.room_id = r.id
            AND gp_child.currency_id = rpb.currency_id
            AND gp_child.guest_type = 'child'

      WHERE ${destinationFilter}
      ${availabilityFilter}
    ) t
    ORDER BY t.hotel_name, stay_total ASC NULLS LAST
  `);
}

export async function getHotelDetail(
  params: HotelSearchProps,
): Promise<HotelDetail | null> {
  const { hotelId, token } = params;
  if (!hotelId) return null;

  const [rows, reviewRows] = await Promise.all([
    searchAvailableHotels(
      { ...params, destinationType: "hotel", destinationValue: hotelId },
      { includeSoldOut: true },
    ),
    prisma.reviews.findMany({
      where: { hotel_id: hotelId },
      orderBy: { submit_time: "desc" },
      take: REVIEW_LIMIT,
      include: { rating: true },
    }),
  ]);

  if (rows.length === 0) return null;

  const first = rows[0];
  if (token && first.token !== token) return null;

  return {
    hotel: {
      hotel_id: first.hotel_id,
      hotel_name: first.hotel_name,
      hotel_thumb_nails: first.hotel_thumb_nails,
      hotel_amenities: first.hotel_amenities,
      latitude: first.latitude,
      longitude: first.longitude,
      description: first.description,
      token: first.token,
      city: first.city,
      state: first.state,
      country: first.country,
      review_count: first.review_count,
      avg_rating: first.avg_rating,
    },
    nights: first.nights,
    rooms: rows.map((row: HotelListsProps) => ({
      room_id: row.room_id,
      room_type: row.room_type,
      bed_count: row.bed_count,
      total_rooms: row.total_rooms,
      room_left: row.room_left,
      room_amenities: row.room_amenities,
      room_features: row.room_features,
      room_size: row.room_size,
      room_description: row.room_description,
      currency_symbol: row.currency_symbol,
      currency_code: row.currency_code,
      adult_price: row.adult_price,
      child_price: row.child_price,
      room_base_amount: row.room_base_amount,
      room_tax_amount: row.room_tax_amount,
      room_discount_amount: row.room_discount_amount,
      room_total_amount: row.room_total_amount,
      price_per_night: row.price_per_night,
      stay_total: row.stay_total,
    })),
    reviews: reviewRows.map((r) => ({
      id: r.id,
      author: r.customer_name,
      category: r.category,
      comment: r.feedback,
      rating: r.rating ? Number(r.rating.stars) : null,
      submitted_at: r.submit_time.toISOString(),
      image: r.image,
    })),
  };
}

export async function getRoomQuote({
  roomId,
  checkIn,
  checkOut,
  adults,
  children,
}: QuoteInput): Promise<RoomQuote | null> {
  const nights = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY,
  );
  if (nights < 1) return null;

  const rows = await prisma.$queryRaw<
    {
      symbol: string;
      code: string;
      adult_total: number;
      adult_base: number;
      adult_tax: number;
      child_total: number | null;
      child_base: number | null;
      child_tax: number | null;
    }[]
  >(Prisma.sql`
    SELECT
      c.symbol,
      c.code,
      ga.total_per_pax::float AS adult_total,
      ga.base_amount::float   AS adult_base,
      ga.tax_amount::float    AS adult_tax,
      gc.total_per_pax::float AS child_total,
      gc.base_amount::float   AS child_base,
      gc.tax_amount::float    AS child_tax
    FROM rooms r
    JOIN room_price_breakdown rpb ON rpb.rooms_id = r.id
    JOIN currency c ON c.id = rpb.currency_id
    JOIN guest_prices ga
      ON ga.room_id = r.id
     AND ga.currency_id = rpb.currency_id
     AND ga.guest_type = 'adult'
    LEFT JOIN guest_prices gc
      ON gc.room_id = r.id
     AND gc.currency_id = rpb.currency_id
     AND gc.guest_type = 'child'
    WHERE r.id = ${roomId}
  `);

  const row = rows[0];
  if (!row) return null;

  const perNight = (adult: number, child: number | null) =>
    adult * adults + (child ?? 0) * children;

  const price_per_night = perNight(row.adult_total, row.child_total);

  return {
    nights,
    currency_symbol: row.symbol,
    currency_code: row.code,
    price_per_night: round2(price_per_night),
    base: round2(perNight(row.adult_base, row.child_base) * nights),
    tax: round2(perNight(row.adult_tax, row.child_tax) * nights),
    total: round2(price_per_night * nights),
  };
}
