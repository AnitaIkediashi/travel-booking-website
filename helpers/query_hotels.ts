import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { HotelSearchProps, HotelListsProps } from "@/types/hotel_type";

const MS_PER_DAY = 86_400_000;

// CHANGE 1 (new helper): escapes % and _ so typed text isn't treated as ILIKE wildcards
const escapeLike = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export async function searchAvailableHotels(
  params: HotelSearchProps,
): Promise<HotelListsProps[]> {
  // CHANGE 2: destinationType and destinationValue added to the destructuring
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

  // CHANGE 3: replaces `const destCon = ...`
  // Builds the destination part of the WHERE clause.
  let destinationFilter: Prisma.Sql;

  if (destinationType && destinationValue) {
    // user picked a suggestion: exact match on that entity
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
    // user typed text and didn't pick anything: fuzzy fallback
    const destCon = `%${escapeLike(destination.trim())}%`;
    destinationFilter = Prisma.sql`(
      h.city    ILIKE ${destCon}
      OR h.state   ILIKE ${destCon}
      OR h.country ILIKE ${destCon}
      OR h.name    ILIKE ${destCon}
    )`;
  }

  return prisma.$queryRaw<HotelListsProps[]>(Prisma.sql`
    SELECT
      t.*,
      ${nights}::int AS nights,

      -- price for the whole party, per night
      (t.adult_price * ${adultCount}::int
        + COALESCE(t.child_price, 0) * ${childrenCount}::int)
        AS price_per_night,

      -- price for the whole party, whole stay
      (t.adult_price * ${adultCount}::int
        + COALESCE(t.child_price, 0) * ${childrenCount}::int)
        * ${nights}::int
        AS stay_total
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

        rpb.total_amount         AS room_total_amount,
        rpb.base_amount          AS room_base_amount,
        rpb.tax_amount           AS room_tax_amount,
        rpb.discount_amount      AS room_discount_amount,

        gp_adult.total_per_pax   AS adult_price,
        gp_child.total_per_pax   AS child_price,
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

      -- CHANGE 4: the old (city ILIKE ... OR name ILIKE ...) block is replaced
      WHERE ${destinationFilter}
        AND (r.total_rooms - COALESCE(bk.rooms_booked, 0)) >= ${roomCount}::int
    ) t
    ORDER BY t.hotel_name, stay_total ASC NULLS LAST
  `);
}
