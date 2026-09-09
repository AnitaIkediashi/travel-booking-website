import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";

// ============================================================
// CONFIG
// ============================================================

// Total hotel capacity for the dataset. Once reached, the seed
// script stops creating new hotels and instead refreshes the
// stalest existing ones in place (price/availability resync),
// mirroring how real platforms re-sync listings rather than
// endlessly growing or churning rows via delete+recreate.
const MAX_HOTELS = 1000;

// How many hotels to add (or refresh, once at capacity) per run.
const BATCH_SIZE = faker.number.int({ min: 7, max: 15 });

// A hotel not refreshed in this many days is eligible for a resync
// once we're at capacity.
const STALE_DAYS_THRESHOLD = 30;

// Default currency for seeded pricing. In the real app, the actual
// list of currencies offered is a *frontend/user* selection — this
// param just lets the seed script accept that same selection so
// seed data matches whatever currencies the product actually supports
// at a given time. Defaults to NGN-only if nothing is passed in.
const DEFAULT_SELECTED_CURRENCY_CODES = ["USD"];

// ============================================================
// STATIC REFERENCE DATA
// ============================================================

const SUPPORTED_CURRENCIES = [
  { name: "US Dollar", code: "USD", symbol: "$" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "British Pound", code: "GBP", symbol: "£" },
  { name: "Nigerian Naira", code: "NGN", symbol: "₦" },
  { name: "Japanese Yen", code: "JPY", symbol: "¥" },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
  { name: "Canadian Dollar", code: "CAD", symbol: "$" },
  { name: "Australian Dollar", code: "AUD", symbol: "$" },
  { name: "Swiss Franc", code: "CHF", symbol: "Fr" },
  { name: "South African Rand", code: "ZAR", symbol: "R" },
  { name: "UAE Dirham", code: "AED", symbol: "د.إ" },
  { name: "Indian Rupee", code: "INR", symbol: "₹" },
  { name: "Singapore Dollar", code: "SGD", symbol: "$" },
  { name: "Ghanaian Cedi", code: "GHS", symbol: "₵" },
  { name: "Kenyan Shilling", code: "KES", symbol: "KSh" },
  { name: "Egyptian Pound", code: "EGP", symbol: "£" },
  { name: "Brazilian Real", code: "BRL", symbol: "R$" },
  { name: "Mexican Peso", code: "MXN", symbol: "$" },
  { name: "Turkish Lira", code: "TRY", symbol: "₺" },
  { name: "South Korean Won", code: "KRW", symbol: "₩" },
];

const COUNTRIES = [
  "Nigeria",
  "United States",
  "United Kingdom",
  "Japan",
  "China",
  "Canada",
  "Australia",
  "Switzerland",
  "South Africa",
  "United Arab Emirates",
  "India",
  "Singapore",
  "Ghana",
  "Kenya",
  "Egypt",
  "Brazil",
  "Mexico",
  "Turkey",
  "South Korea",
];

const ROOM_TYPES = [
  "Standard Room",
  "Deluxe Room",
  "Superior Room",
  "Executive Room",
  "Junior Suite",
  "Executive Suite",
  "Presidential Suite",
  "Twin Room",
  "Family Room",
  "Studio",
];

// Real-world insight: bed count and room type are correlated, not
// independent random values — a "Presidential Suite" doesn't have
// a single bunk bed. This map keeps seed data internally consistent.
const ROOM_TYPE_BED_RANGE: Record<string, [number, number]> = {
  "Standard Room": [1, 2],
  "Deluxe Room": [1, 2],
  "Superior Room": [1, 2],
  "Executive Room": [1, 2],
  "Junior Suite": [1, 2],
  "Executive Suite": [2, 3],
  "Presidential Suite": [2, 4],
  "Twin Room": [2, 2],
  "Family Room": [2, 4],
  Studio: [1, 1],
};

const ROOM_AMENITIES_POOL = [
  "Ocean View",
  "City View",
  "Balcony",
  "Mini-bar",
  "Bathtub",
  "Espresso Machine",
  "Free Wi-Fi",
  "Air Conditioning",
  "Flat-screen TV",
  "Room Service",
  "Safe",
  "Coffee Maker",
  "Rain Shower",
  "Bathrobe & Slippers",
];

const ROOM_FEATURES_POOL = [
  "Soundproof",
  "Hardwood Floors",
  "Non-Smoking",
  "Connecting Rooms Available",
  "Wheelchair Accessible",
  "High Ceiling",
  "Private Entrance",
];

const HOTEL_AMENITIES_POOL = [
  "Free Wi-Fi",
  "Swimming Pool",
  "Fitness Center",
  "Spa",
  "Restaurant",
  "Bar",
  "Free Parking",
  "Airport Shuttle",
  "24-Hour Front Desk",
  "Business Center",
  "Pet Friendly",
  "Laundry Service",
  "Concierge",
  "Room Service",
];

const REVIEW_CATEGORIES = [
  "Cleanliness",
  "Comfort",
  "Location",
  "Facilities",
  "Staff",
  "Value for Money",
  "Free Wi-Fi",
];

const GUEST_TYPES = ["adult", "child", "infant"] as const;

const RULE_CATEGORIES = [
  {
    category: "Check-in / Check-out",
    description: "Standard check-in and check-out policy.",
  },
  { category: "Pets", description: "Pets are allowed on request." },
  {
    category: "Smoking",
    description: "Smoking is not permitted in indoor areas.",
  },
  { category: "Children", description: "Children of all ages are welcome." },
  {
    category: "Cancellation",
    description: "Free cancellation up to 48 hours before check-in.",
  },
  {
    category: "Payment",
    description: "Major credit cards accepted at the front desk.",
  },
];

// ============================================================
// HELPERS
// ============================================================

function randomSubset<T>(pool: T[], min: number, max: number): T[] {
  const count = faker.number.int({ min, max: Math.min(max, pool.length) });
  return faker.helpers.arrayElements(pool, count);
}

// Real-world insight: tax and discount are usually *derived* from the
// base amount (a percentage), not independently random numbers — a
// $1000/night suite and a $50/night room don't pay the same flat tax.
function buildPriceAmounts() {
  const base = faker.number.float({ min: 40, max: 1200, fractionDigits: 2 });
  const taxRate = faker.number.float({
    min: 0.05,
    max: 0.18,
    fractionDigits: 3,
  });
  const tax = Number((base * taxRate).toFixed(2));
  const hasDiscount = faker.datatype.boolean({ probability: 0.3 });
  const discountRate = hasDiscount
    ? faker.number.float({ min: 0.05, max: 0.25, fractionDigits: 2 })
    : 0;
  const discount = Number((base * discountRate).toFixed(2));
  const total = Number((base + tax - discount).toFixed(2));

  return { base, tax, discount, total };
}

// ============================================================
// CURRENCY SEEDING + SELECTION
// ============================================================

async function seedCurrencyCatalog() {
  const currencies = await Promise.all(
    SUPPORTED_CURRENCIES.map((currency) =>
      prisma.currency.upsert({
        where: { code: currency.code },
        update: {},
        create: currency,
      }),
    ),
  );
  return currencies;
}

function resolveActiveCurrencies(
  allCurrencies: { id: string; code: string }[],
  selectedCodes: string[] = DEFAULT_SELECTED_CURRENCY_CODES,
) {
  const active = allCurrencies.filter((c) => selectedCodes.includes(c.code));
  if (active.length === 0) {
    throw new Error(
      `None of the selected currency codes [${selectedCodes.join(", ")}] exist in the currency catalog.`,
    );
  }
  return active;
}

function pickActiveCurrencyId(
  activeCurrencies: { id: string; code: string }[],
) {
  return faker.helpers.arrayElement(activeCurrencies).id;
}

// ============================================================
// NEW HOTEL CREATION
// ============================================================

async function seedNewHotel(activeCurrencies: { id: string; code: string }[]) {
  const country = faker.helpers.arrayElement(COUNTRIES);
  const currencyId = pickActiveCurrencyId(activeCurrencies);

  const hotel = await prisma.hotels.create({
    data: {
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      description: faker.lorem.paragraphs(2),
      country,
      city: faker.location.city(),
      state: faker.location.state(),
      token: faker.string.alphanumeric(24),
      thumb_nails: Array.from(
        { length: faker.number.int({ min: 3, max: 6 }) },
        () => faker.image.url(),
      ),
      amenities: randomSubset(HOTEL_AMENITIES_POOL, 4, 9),
    },
  });

  await Promise.all([
    seedRoomsForHotel(hotel.id, currencyId),
    seedReviewsForHotel(hotel.id),
    seedRulesForHotel(hotel.id),
  ]);

  return hotel;
}

async function seedRoomsForHotel(hotelId: string, currencyId: string) {
  const roomCount = faker.number.int({ min: 5, max: 10 });

  await Promise.all(
    Array.from({ length: roomCount }).map(() =>
      seedSingleRoom(hotelId, currencyId),
    ),
  );
}

async function seedSingleRoom(hotelId: string, currencyId: string) {
  const roomType = faker.helpers.arrayElement(ROOM_TYPES);
  const [minBeds, maxBeds] = ROOM_TYPE_BED_RANGE[roomType];
  const totalRooms = faker.number.int({ min: 3, max: 20 });

  const room = await prisma.rooms.create({
    data: {
      hotel_id: hotelId,
      room_type: roomType,
      bed_count: faker.number.int({ min: minBeds, max: maxBeds }),
      total_rooms: totalRooms,
      room_left: faker.number.int({ min: 0, max: totalRooms }),
      description: faker.lorem.paragraph(),
      amenities: randomSubset(ROOM_AMENITIES_POOL, 2, 6),
      features: randomSubset(ROOM_FEATURES_POOL, 1, 4),
      size_sqft: faker.number.float({ min: 180, max: 1500, fractionDigits: 0 }),
    },
  });

  const { base, tax, discount, total } = buildPriceAmounts();

  await Promise.all([
    prisma.roomPriceBreakdown.create({
      data: {
        rooms_id: room.id,
        currency_id: currencyId,
        base_amount: base,
        tax_amount: tax,
        discount_amount: discount,
        total_amount: total,
      },
    }),
    seedGuestPricesForRoom(room.id, currencyId, base),
  ]);
}

async function seedGuestPricesForRoom(
  roomId: string,
  currencyId: string,
  roomBaseAmount: number,
) {
  const GUEST_TYPE_RATE_FRACTION: Record<(typeof GUEST_TYPES)[number], number> =
    {
      adult: 1,
      child: 0.5,
      infant: 0,
    };

  await Promise.all(
    GUEST_TYPES.map((guestType) => {
      const fraction = GUEST_TYPE_RATE_FRACTION[guestType];
      const base = Number((roomBaseAmount * fraction).toFixed(2));
      const tax = Number((base * 0.1).toFixed(2));
      const totalPerPax = Number((base + tax).toFixed(2));

      return prisma.guestPrices.create({
        data: {
          room_id: roomId,
          currency_id: currencyId,
          guest_type: guestType,
          quantity: faker.number.int({
            min: 1,
            max: guestType === "adult" ? 4 : 2,
          }),
          base_amount: base,
          tax_amount: tax,
          total_per_pax: totalPerPax,
        },
      });
    }),
  );
}

async function seedReviewsForHotel(hotelId: string) {
  const reviewCount = faker.number.int({ min: 0, max: 12 });

  await Promise.all(
    Array.from({ length: reviewCount }).map(() => seedSingleReview(hotelId)),
  );
}

async function seedSingleReview(hotelId: string) {
  const review = await prisma.reviews.create({
    data: {
      hotel_id: hotelId,
      customer_name: faker.person.fullName(),
      category: faker.helpers.arrayElement(REVIEW_CATEGORIES),
      feedback: faker.lorem.sentences({ min: 1, max: 3 }),
      submit_time: faker.date.past({ years: 1 }),
      image: faker.datatype.boolean({ probability: 0.3 })
        ? faker.image.url()
        : null,
    },
  });

  if (faker.datatype.boolean({ probability: 0.8 })) {
    await prisma.rating.create({
      data: {
        review_id: review.id,
        stars: faker.number.int({ min: 1, max: 5 }),
        count: faker.number.int({ min: 1, max: 50 }),
      },
    });
  }
}

async function seedRulesForHotel(hotelId: string) {
  const checkinTime = faker.helpers.arrayElement([
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
  ]);
  const checkoutTime = faker.helpers.arrayElement([
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
  ]);
  const rules = randomSubset(RULE_CATEGORIES, 3, RULE_CATEGORIES.length);

  await prisma.rules.createMany({
    data: rules.map((rule) => ({
      hotel_id: hotelId,
      checkin_time: checkinTime,
      checkout_time: checkoutTime,
      category: rule.category,
      description: rule.description,
    })),
  });
}

// ============================================================
// STALE HOTEL REFRESH (used once at/near capacity)
// ============================================================

// Instead of deleting a stale hotel and recreating it, resync the
// parts of it that actually change over time in a real system:
// room pricing and availability. Structural details (room type,
// bed count, location) stay put — those don't churn on a "sync."
async function refreshStaleHotel(hotelId: string) {
  const rooms = await prisma.rooms.findMany({
    where: { hotel_id: hotelId },
    select: {
      id: true,
      total_rooms: true,
      price_breakdown: { select: { currency_id: true } },
    },
  });

  await Promise.all(
    rooms.map(async (room) => {
      const currencyId = room.price_breakdown?.currency_id;
      if (!currencyId) return;

      const { base, tax, discount, total } = buildPriceAmounts();

      await Promise.all([
        prisma.roomPriceBreakdown.update({
          where: { rooms_id: room.id },
          data: {
            base_amount: base,
            tax_amount: tax,
            discount_amount: discount,
            total_amount: total,
          },
        }),
        prisma.rooms.update({
          where: { id: room.id },
          data: {
            room_left: faker.number.int({ min: 0, max: room.total_rooms }),
          },
        }),
        refreshGuestPricesForRoom(room.id, base),
      ]);
    }),
  );

  // Touching the hotel row bumps `updated_at` via @updatedAt,
  // marking it "fresh" again until it goes stale next cycle.
  await prisma.hotels.update({
    where: { id: hotelId },
    data: { description: faker.lorem.paragraphs(2) }, // trivial write to trigger updated_at
  });
}

async function refreshGuestPricesForRoom(
  roomId: string,
  roomBaseAmount: number,
) {
  const GUEST_TYPE_RATE_FRACTION: Record<(typeof GUEST_TYPES)[number], number> =
    {
      adult: 1,
      child: 0.5,
      infant: 0,
    };

  const guestPriceRows = await prisma.guestPrices.findMany({
    where: { room_id: roomId },
    select: { id: true, guest_type: true },
  });

  await Promise.all(
    guestPriceRows.map((row) => {
      const fraction =
        GUEST_TYPE_RATE_FRACTION[
          row.guest_type as (typeof GUEST_TYPES)[number]
        ] ?? 0;
      const base = Number((roomBaseAmount * fraction).toFixed(2));
      const tax = Number((base * 0.1).toFixed(2));
      const totalPerPax = Number((base + tax).toFixed(2));

      return prisma.guestPrices.update({
        where: { id: row.id },
        data: {
          base_amount: base,
          tax_amount: tax,
          total_per_pax: totalPerPax,
        },
      });
    }),
  );
}

// ============================================================
// ORCHESTRATION
// ============================================================

export async function seedHotelDataset(
  selectedCurrencyCodes: string[] = DEFAULT_SELECTED_CURRENCY_CODES,
) {
  console.log("Seeding currency catalog...");
  const allCurrencies = await seedCurrencyCatalog();
  const activeCurrencies = resolveActiveCurrencies(
    allCurrencies,
    selectedCurrencyCodes,
  );

  const currentCount = await prisma.hotels.count();
  const remainingCapacity = MAX_HOTELS - currentCount;

  if (remainingCapacity > 0) {
    const newHotelCount = Math.min(BATCH_SIZE, remainingCapacity);
    console.log(
      `Under capacity (${currentCount}/${MAX_HOTELS}). Creating ${newHotelCount} new hotel(s)...`,
    );

    await Promise.all(
      Array.from({ length: newHotelCount }).map(() =>
        seedNewHotel(activeCurrencies),
      ),
    );

    console.log("New hotel creation complete.");
    return;
  }

  console.log(
    `At capacity (${currentCount}/${MAX_HOTELS}). Checking for stale hotels to refresh...`,
  );

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - STALE_DAYS_THRESHOLD);

  const staleHotels = await prisma.hotels.findMany({
    where: { updated_at: { lt: cutoffDate } },
    orderBy: { updated_at: "asc" },
    take: BATCH_SIZE,
    select: { id: true },
  });

  if (staleHotels.length === 0) {
    console.log("At capacity, but no hotels are stale enough to refresh yet.");
    return;
  }

  console.log(`Refreshing ${staleHotels.length} stale hotel(s)...`);
  await Promise.all(staleHotels.map((h) => refreshStaleHotel(h.id)));

  console.log("Stale hotel refresh complete.");
}

seedHotelDataset()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
