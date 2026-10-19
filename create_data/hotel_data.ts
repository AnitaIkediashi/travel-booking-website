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
const BATCH_SIZE = faker.number.int({ min: 9, max: 15 });

// A hotel not refreshed in this many days is eligible for a resync
// once we're at capacity.
const STALE_DAYS_THRESHOLD = 30;

// Default currency for seeded pricing. In the real app, the actual
// list of currencies offered is a *frontend/user* selection — this
// param just lets the seed script accept that same selection so
// seed data matches whatever currencies the product actually supports
// at a given time. Defaults to USD-only if nothing is passed in.
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

// Real-world insight: hotels cluster in destinations. A real city
// has dozens or hundreds of hotels, and city, state, country and
// coordinates all agree with each other.
//   weight     - how popular the destination is (more weight = more hotels)
//   priceLevel - how expensive the destination is (1 = average)
const DESTINATIONS = [
  {
    city: "Istanbul",
    state: "Istanbul",
    country: "Turkey",
    lat: 41.0082,
    lng: 28.9784,
    weight: 10,
    priceLevel: 1.0,
  },
  {
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    weight: 10,
    priceLevel: 1.6,
  },
  {
    city: "London",
    state: "England",
    country: "United Kingdom",
    lat: 51.5072,
    lng: -0.1276,
    weight: 10,
    priceLevel: 1.7,
  },
  {
    city: "New York",
    state: "New York",
    country: "United States",
    lat: 40.7128,
    lng: -74.006,
    weight: 10,
    priceLevel: 1.8,
  },
  {
    city: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates",
    lat: 25.2048,
    lng: 55.2708,
    weight: 9,
    priceLevel: 1.5,
  },
  {
    city: "Tokyo",
    state: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    weight: 9,
    priceLevel: 1.4,
  },
  {
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    weight: 7,
    priceLevel: 0.8,
  },
  {
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    lat: 9.0765,
    lng: 7.3986,
    weight: 4,
    priceLevel: 0.8,
  },
  {
    city: "Cape Town",
    state: "Western Cape",
    country: "South Africa",
    lat: -33.9249,
    lng: 18.4241,
    weight: 6,
    priceLevel: 0.9,
  },
  {
    city: "Nairobi",
    state: "Nairobi",
    country: "Kenya",
    lat: -1.2921,
    lng: 36.8219,
    weight: 4,
    priceLevel: 0.8,
  },
  {
    city: "Accra",
    state: "Greater Accra",
    country: "Ghana",
    lat: 5.6037,
    lng: -0.187,
    weight: 4,
    priceLevel: 0.75,
  },
  {
    city: "Cairo",
    state: "Cairo",
    country: "Egypt",
    lat: 30.0444,
    lng: 31.2357,
    weight: 5,
    priceLevel: 0.7,
  },
  {
    city: "Singapore",
    state: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    weight: 8,
    priceLevel: 1.5,
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    lat: 19.076,
    lng: 72.8777,
    weight: 6,
    priceLevel: 0.7,
  },
  {
    city: "Toronto",
    state: "Ontario",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832,
    weight: 6,
    priceLevel: 1.2,
  },
  {
    city: "Sydney",
    state: "New South Wales",
    country: "Australia",
    lat: -33.8688,
    lng: 151.2093,
    weight: 6,
    priceLevel: 1.3,
  },
  {
    city: "Rio de Janeiro",
    state: "Rio de Janeiro",
    country: "Brazil",
    lat: -22.9068,
    lng: -43.1729,
    weight: 5,
    priceLevel: 0.9,
  },
  {
    city: "Mexico City",
    state: "Mexico City",
    country: "Mexico",
    lat: 19.4326,
    lng: -99.1332,
    weight: 5,
    priceLevel: 0.85,
  },
  {
    city: "Seoul",
    state: "Seoul",
    country: "South Korea",
    lat: 37.5665,
    lng: 126.978,
    weight: 6,
    priceLevel: 1.1,
  },
  {
    city: "Zurich",
    state: "Zurich",
    country: "Switzerland",
    lat: 47.3769,
    lng: 8.5417,
    weight: 3,
    priceLevel: 2.0,
  },
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

// Real-world insight: price depends on the room type. A Presidential
// Suite is never cheaper than a Standard Room in the same hotel.
const ROOM_TYPE_PRICE_RANGE: Record<string, [number, number]> = {
  "Standard Room": [40, 120],
  "Deluxe Room": [90, 200],
  "Superior Room": [80, 180],
  "Executive Room": [120, 250],
  "Junior Suite": [150, 300],
  "Executive Suite": [250, 500],
  "Presidential Suite": [600, 1200],
  "Twin Room": [60, 150],
  "Family Room": [120, 280],
  Studio: [50, 130],
};

// Fallback if a room type isn't in the map (e.g. older rows).
const DEFAULT_PRICE_RANGE: [number, number] = [40, 1200];

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

// Real-world insight: amenities follow the price level. Nearly every
// hotel has Wi-Fi, budget hotels have the basics, and the Spa, Pool
// and Concierge are what you find at the top end.
const BASIC_AMENITIES = [
  "24-Hour Front Desk",
  "Laundry Service",
  "Free Parking",
  "Restaurant",
];

const MID_AMENITIES = [
  "Bar",
  "Fitness Center",
  "Airport Shuttle",
  "Room Service",
  "Pet Friendly",
  "Business Center",
];

const LUXURY_AMENITIES = ["Swimming Pool", "Spa", "Concierge"];

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

// Share of the room's price each guest type pays (infants stay free).
const GUEST_TYPE_RATE_FRACTION: Record<(typeof GUEST_TYPES)[number], number> = {
  adult: 1,
  child: 0.5,
  infant: 0,
};

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

const HOTEL_TYPE_WORDS = [
  "Hotel",
  "Inn",
  "Suites",
  "Resort",
  "Lodge",
  "Plaza",
  "Grand Hotel",
  "Boutique Hotel",
];

function generateHotelName(city: string): string {
  const pattern = faker.number.int({ min: 0, max: 3 });
  const type = faker.helpers.arrayElement(HOTEL_TYPE_WORDS);

  switch (pattern) {
    case 0:
      return `The ${city} ${type}`;
    case 1:
      return `${faker.person.lastName()} ${type}`;
    case 2:
      return `${city} ${type} & Spa`;
    default:
      return `${faker.company.name()} ${type}`;
  }
}

// ============================================================
// HELPERS
// ============================================================

type PriceAmounts = {
  base: number;
  tax: number;
  discount: number;
  total: number;
};

type Destination = (typeof DESTINATIONS)[number];

const MIN_HOTEL_TIER = 0.7;
const MAX_HOTEL_TIER = 1.8;

function randomSubset<T>(pool: T[], min: number, max: number): T[] {
  const count = faker.number.int({ min, max: Math.min(max, pool.length) });
  return faker.helpers.arrayElements(pool, count);
}

// A hotel's own level (~0.7 = budget, ~1.8 = luxury), independent of
// where it is. The destination's price level is applied separately.
function randomHotelTier(): number {
  return faker.number.float({
    min: MIN_HOTEL_TIER,
    max: MAX_HOTEL_TIER,
    fractionDigits: 2,
  });
}

// 0 = cheapest possible hotel, 1 = most luxurious.
function normalizeTier(hotelTier: number): number {
  return (hotelTier - MIN_HOTEL_TIER) / (MAX_HOTEL_TIER - MIN_HOTEL_TIER);
}

function pickDestination(): Destination {
  return faker.helpers.weightedArrayElement(
    DESTINATIONS.map((destination) => ({
      weight: destination.weight,
      value: destination,
    })),
  );
}

// A random point within ~10km of the destination's centre, so hotels
// in one city actually sit in that city.
function coordinatesNear(destination: Destination): [number, number] {
  return faker.location.nearbyGPSCoordinate({
    origin: [destination.lat, destination.lng],
    radius: 10,
    isMetric: true,
  });
}

// Real-world insight: tax and discount are usually *derived* from the
// base amount (a percentage), not independently random numbers — a
// $1000/night suite and a $50/night room don't pay the same flat tax.
function buildPriceAmounts(roomType: string, hotelTier = 1): PriceAmounts {
  const [min, max] = ROOM_TYPE_PRICE_RANGE[roomType] ?? DEFAULT_PRICE_RANGE;

  const base = Number(
    (faker.number.float({ min, max, fractionDigits: 2 }) * hotelTier).toFixed(
      2,
    ),
  );
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

// Per-guest-type amounts derived from the SAME base/tax/total as the room
// breakdown, so guest prices and room prices never disagree.
// total_per_pax uses the room's total (tax and discount included).
function buildGuestAmounts(
  amounts: PriceAmounts,
  guestType: (typeof GUEST_TYPES)[number],
) {
  const fraction = GUEST_TYPE_RATE_FRACTION[guestType];

  return {
    base_amount: Number((amounts.base * fraction).toFixed(2)),
    tax_amount: Number((amounts.tax * fraction).toFixed(2)),
    total_per_pax: Number((amounts.total * fraction).toFixed(2)),
  };
}

// Used when refreshing an existing hotel: its original tier isn't stored,
// so estimate it from the rooms' current base prices relative to the
// midpoint of each room type's range. Averaged across rooms so one
// unusually priced room doesn't skew the whole hotel.
function inferHotelTier(rooms: { roomType: string; base: number }[]): number {
  const tiers = rooms
    .filter((r) => r.base > 0)
    .map((r) => {
      const [min, max] =
        ROOM_TYPE_PRICE_RANGE[r.roomType] ?? DEFAULT_PRICE_RANGE;
      return r.base / ((min + max) / 2);
    });

  if (tiers.length === 0) return 1;

  const average = tiers.reduce((sum, t) => sum + t, 0) / tiers.length;
  return Math.min(Math.max(average, 0.5), 2);
}

// Real-world insight: amenities depend on the hotel's level.
//   budget  -> Wi-Fi plus a few basics
//   mid     -> basics plus bar, gym, shuttle...
//   luxury  -> everything, including pool, spa and concierge
function buildHotelAmenities(normalizedTier: number): string[] {
  let pool = [...BASIC_AMENITIES];
  let min = 2;
  let max = 4;

  if (normalizedTier >= 0.33) {
    pool = [...pool, ...MID_AMENITIES];
    min = 5;
    max = 8;
  }
  if (normalizedTier >= 0.66) {
    pool = [...pool, ...LUXURY_AMENITIES];
    min = 8;
    max = 12;
  }

  const amenities = randomSubset(pool, min, max);

  // Nearly every hotel has Wi-Fi, so it's added separately, not drawn from the pool.
  if (faker.datatype.boolean({ probability: 0.95 })) {
    amenities.unshift("Free Wi-Fi");
  }

  return amenities;
}

// Real-world insight: a hotel's guest ratings cluster around its
// overall quality (usually 3.5 to 4.7), not uniformly across 1-5.
// Better (more expensive) hotels tend to score higher, with some noise.
function randomHotelQuality(normalizedTier: number): number {
  const quality =
    3.3 +
    normalizedTier * 0.9 +
    faker.number.float({ min: -0.3, max: 0.3, fractionDigits: 2 });
  return Math.min(Math.max(quality, 2.8), 4.8);
}

// Picks a 1-5 star score with the highest odds near the hotel's quality,
// so its average rating ends up close to that quality.
function sampleStars(quality: number): number {
  const spread = 0.8;
  return faker.helpers.weightedArrayElement(
    [1, 2, 3, 4, 5].map((stars) => ({
      value: stars,
      weight: Math.exp(-((stars - quality) ** 2) / (2 * spread ** 2)),
    })),
  );
}

// Fixed-shape photos (a seeded, sized URL) so cards don't get
// random 89x577 slivers.
function buildThumbnails(): string[] {
  return Array.from(
    { length: faker.number.int({ min: 3, max: 6 }) },
    () => `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/600`,
  );
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
  const destination = pickDestination();
  const currencyId = pickActiveCurrencyId(activeCurrencies);
  const [latitude, longitude] = coordinatesNear(destination);

  // The hotel's own level (budget -> luxury)...
  const hotelLevel = randomHotelTier();
  const normalizedTier = normalizeTier(hotelLevel);

  // ...combined with how expensive its destination is (Paris > Lagos).
  const hotelTier = hotelLevel * destination.priceLevel;
  const quality = randomHotelQuality(normalizedTier);

  const hotel = await prisma.hotels.create({
    data: {
      name: generateHotelName(destination.city),
      longitude,
      latitude,
      description: faker.lorem.paragraphs(2),
      country: destination.country,
      city: destination.city,
      state: destination.state,
      token: faker.string.alphanumeric(24),
      thumb_nails: buildThumbnails(),
      amenities: buildHotelAmenities(normalizedTier),
    },
  });

  await Promise.all([
    seedRoomsForHotel(hotel.id, currencyId, hotelTier),
    seedReviewsForHotel(hotel.id, quality),
    seedRulesForHotel(hotel.id),
  ]);

  return hotel;
}

async function seedRoomsForHotel(
  hotelId: string,
  currencyId: string,
  hotelTier: number,
) {
  const roomCount = faker.number.int({ min: 5, max: 10 });

  await Promise.all(
    Array.from({ length: roomCount }).map(() =>
      seedSingleRoom(hotelId, currencyId, hotelTier),
    ),
  );
}

async function seedSingleRoom(
  hotelId: string,
  currencyId: string,
  hotelTier: number,
) {
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

  const amounts = buildPriceAmounts(roomType, hotelTier);

  await Promise.all([
    prisma.roomPriceBreakdown.create({
      data: {
        rooms_id: room.id,
        currency_id: currencyId,
        base_amount: amounts.base,
        tax_amount: amounts.tax,
        discount_amount: amounts.discount,
        total_amount: amounts.total,
      },
    }),
    seedGuestPricesForRoom(room.id, currencyId, amounts),
  ]);
}

async function seedGuestPricesForRoom(
  roomId: string,
  currencyId: string,
  amounts: PriceAmounts,
) {
  await Promise.all(
    GUEST_TYPES.map((guestType) =>
      prisma.guestPrices.create({
        data: {
          room_id: roomId,
          currency_id: currencyId,
          guest_type: guestType,
          quantity: faker.number.int({
            min: 1,
            max: guestType === "adult" ? 4 : 2,
          }),
          ...buildGuestAmounts(amounts, guestType),
        },
      }),
    ),
  );
}

async function seedReviewsForHotel(hotelId: string, quality: number) {
  // Real hotels have many reviews; a handful makes the average meaningless.
  const reviewCount = faker.number.int({ min: 5, max: 40 });

  await Promise.all(
    Array.from({ length: reviewCount }).map(() =>
      seedSingleReview(hotelId, quality),
    ),
  );
}

async function seedSingleReview(hotelId: string, quality: number) {
  const review = await prisma.reviews.create({
    data: {
      hotel_id: hotelId,
      customer_name: faker.person.fullName(),
      category: faker.helpers.arrayElement(REVIEW_CATEGORIES),
      feedback: faker.lorem.sentences({ min: 1, max: 3 }),
      submit_time: faker.date.past({ years: 1 }),
      image: faker.datatype.boolean({ probability: 0.3 })
        ? faker.image.avatar()
        : null,
    },
  });

  // Almost every review carries a star score.
  if (faker.datatype.boolean({ probability: 0.95 })) {
    await prisma.rating.create({
      data: {
        review_id: review.id,
        stars: sampleStars(quality),
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
      room_type: true,
      total_rooms: true,
      price_breakdown: { select: { currency_id: true, base_amount: true } },
    },
  });

  // Keep the hotel at the same price level it was seeded with
  // (this already includes its destination's price level).
  const hotelTier = inferHotelTier(
    rooms.map((room) => ({
      roomType: room.room_type,
      base: Number(room.price_breakdown?.base_amount ?? 0),
    })),
  );

  await Promise.all(
    rooms.map(async (room) => {
      const currencyId = room.price_breakdown?.currency_id;
      if (!currencyId) return;

      const amounts = buildPriceAmounts(room.room_type, hotelTier);

      await Promise.all([
        prisma.roomPriceBreakdown.update({
          where: { rooms_id: room.id },
          data: {
            base_amount: amounts.base,
            tax_amount: amounts.tax,
            discount_amount: amounts.discount,
            total_amount: amounts.total,
          },
        }),
        prisma.rooms.update({
          where: { id: room.id },
          data: {
            room_left: faker.number.int({ min: 0, max: room.total_rooms }),
          },
        }),
        refreshGuestPricesForRoom(room.id, amounts),
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
  amounts: PriceAmounts,
) {
  const guestPriceRows = await prisma.guestPrices.findMany({
    where: { room_id: roomId },
    select: { id: true, guest_type: true },
  });

  await Promise.all(
    guestPriceRows.map((row) =>
      prisma.guestPrices.update({
        where: { id: row.id },
        data: buildGuestAmounts(
          amounts,
          row.guest_type as (typeof GUEST_TYPES)[number],
        ),
      }),
    ),
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
