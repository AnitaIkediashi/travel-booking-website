import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";
import cron from "node-cron";

console.log("🚀 SCRIPT INITIALIZED");

type FakeLeg = {
  duration: number;
  departure_time: string;
  arrival_time: string;
  departure_code: string;
  arrival_code: string;
};

type FakeSeat = {
  seat_number: string;
  cabin_class: string;
  is_window: boolean;
  is_aisle: boolean;
  is_exit_row: boolean;
  is_booked: boolean;
  extra_fee: number;
};

type FakeAirlineSeed = {
  name: string;
  iata_code: string;
  logo: string;
};

/**
 * Record utility type is used to define an object type with specific key-value pairs.
 * written in Record<Keys, Type>
 *
 * The flights creation is based on mimicked real world flights and their configurations.
 * The flights are based on
 * 1. Pricing
 * 2. Baggage-free (baggage tracking removed — no longer modeled in schema)
 * 3. Seat availability
 * 4. Cabin class
 * 5. Duration
 * 6. flight schedules
 * 7. Segments and legs - which depends on the outbound and inbound airports
 * outbound flights - one way flights
 * inbound flights = round trip flights
 * 8. Airlines operating the flights
 * 9. Seat selection
 * 10. Gate
 *
 * for each route, generate N distinct flight
 * TIME INSTANCES (each with its own departure/arrival time, its own stop
 * pattern/legs, its own flight number/airline). Cabin class then only
 * varies price, seats, and baggage WITHIN each fixed time instance — mirroring
 * how a real GDS returns multiple flight numbers per route/day, each bookable
 * across cabins at that flight's fixed schedule.
 *
 */

const MIN_AIRPORTS = 15; // a reasonable spread for route variety
const MIN_AIRLINES = 8; // a reasonable spread of carriers to draw from

//helper function to calculate price multipliers and baggage allowance based on cabin class
const CABIN_CONFIGS: Record<
  string,
  { multiplier: number; baggage: number; seats: number }
> = {
  Economy: { multiplier: 1.0, baggage: 1, seats: 20 },
  "Premium Economy": { multiplier: 1.4, baggage: 2, seats: 12 },
  Business: { multiplier: 2.2, baggage: 3, seats: 8 },
  "First Class": { multiplier: 3.5, baggage: 3, seats: 4 },
};

const SEAT_LAYOUTS: Record<string, { rows: number; cols: string[] }> = {
  Economy: { rows: 20, cols: ["A", "B", "C", "D", "E", "F"] },
  "Premium Economy": { rows: 6, cols: ["A", "B", "C", "D"] },
  Business: { rows: 4, cols: ["A", "C", "D", "F"] },
  "First Class": { rows: 2, cols: ["A", "D"] },
};

function populateFakeAirports() {
  return Array.from({ length: faker.number.int({ min: 15, max: 25 }) }, () => {
    const airportName = faker.airline.airport().name;
    const airportCode = faker.airline.airport().iataCode;
    const imageUrl = faker.image.url({ width: 100, height: 100 });
    const city = faker.location.city();
    const country = faker.location.country();
    return {
      name: airportName,
      code: airportCode,
      imageUrl: imageUrl,
      city: city,
      country: country,
    };
  });
}

function populateFakeAirlines(): FakeAirlineSeed[] {
  // draw carrier variety from. This pool is now seeded once (see
  // ensureAirlinePool) rather than regenerated every run, since
  // Airlines.iata_code is unique and Carriers hold a real FK into it.
  return Array.from({ length: faker.number.int({ min: 6, max: 12 }) }, () => {
    const airlineName = faker.airline.airline().name;
    const airlineCode = faker.airline.airline().iataCode;
    const airlineImageUrl = faker.image.url({ width: 100, height: 100 });

    return {
      name: airlineName,
      iata_code: airlineCode,
      logo: airlineImageUrl,
    };
  });
}

function populateFakeSegments(
  targetDate: Date,
  originCode: string,
  destinationCode: string,
) {
  const baseDate = new Date(targetDate);
  const randomHour = faker.number.int({ min: 1, max: 23 });

  const departureTime = new Date(baseDate);
  departureTime.setHours(
    randomHour,
    faker.helpers.arrayElement([0, 15, 30, 45]),
    0,
    0,
  );

  // Use a weighted probability for variety
  const roll = Math.random();
  let durationMinutes: number;

  if (roll < 0.4) {
    // 40% chance for Short Haul (1.5h - 3h)
    durationMinutes = faker.number.int({ min: 90, max: 180 });
  } else if (roll < 0.8) {
    // 40% chance for Medium Haul (3h - 8h)
    durationMinutes = faker.number.int({ min: 181, max: 480 });
  } else {
    // 20% chance for Long Haul (8h - 20h)
    durationMinutes = faker.number.int({ min: 481, max: 1200 });
  }

  const arrivalTime = new Date(
    departureTime.getTime() + durationMinutes * 60000,
  );

  return {
    departure_airport_code: originCode,
    arrival_airport_code: destinationCode,
    duration: durationMinutes, // renamed from total_time to match Segment.duration
    departure_time: departureTime,
    arrival_time: arrivalTime,
    departure_time_iso: departureTime.toISOString(),
    arrival_time_iso: arrivalTime.toISOString(),
  };
}

// cabinClass param removed: Legs no longer carries cabin_class (Segment does)
function populateFakeLegsData(
  segmentStart: Date,
  segmentEnd: Date,
  originCode: string,
  destinationCode: string,
  allAvailableCodes: string[],
): FakeLeg[] {
  // Filter out the origin and destination so they aren't used as hubs
  const possibleHubs = allAvailableCodes.filter(
    (code) => code !== originCode && code !== destinationCode,
  );

  const totalSegmentMs = segmentEnd.getTime() - segmentStart.getTime();
  const totalMinutes = totalSegmentMs / (1000 * 60);

  // Logic to determine stops
  let maxStops = 0;
  if (totalMinutes >= 480) maxStops = 2;
  else if (totalMinutes >= 180) maxStops = 1;

  const numStops =
    possibleHubs.length > 0
      ? faker.number.int({
          min: 0,
          max: Math.min(maxStops, possibleHubs.length),
        })
      : 0;

  const numLegs = numStops + 1;
  const transitHubs = faker.helpers.arrayElements(possibleHubs, numStops);

  // Time math
  const totalLayoverMs = numStops > 0 ? totalSegmentMs * 0.3 : 0; // 30% of trip for layovers
  const flyingMsPerLeg = (totalSegmentMs - totalLayoverMs) / numLegs;
  const layoverMsPerStop = numStops > 0 ? totalLayoverMs / numStops : 0;

  const legs: FakeLeg[] = [];
  let currentStartTime = new Date(segmentStart);
  let currentOrigin = originCode;

  for (let i = 0; i < numLegs; i++) {
    const isLastLeg = i === numLegs - 1;
    const currentDestination = isLastLeg ? destinationCode : transitHubs[i];
    const arrivalTime = new Date(currentStartTime.getTime() + flyingMsPerLeg);

    legs.push({
      duration: Math.floor(flyingMsPerLeg / 60000),
      departure_time: currentStartTime.toISOString(),
      arrival_time: arrivalTime.toISOString(),
      departure_code: currentOrigin,
      arrival_code: currentDestination,
    });

    if (!isLastLeg) {
      currentStartTime = new Date(arrivalTime.getTime() + layoverMsPerStop);
      currentOrigin = currentDestination;
    }
  }
  return legs;
}

function calculateSeatFee(isWindow: boolean, isExitRow: boolean): number {
  if (isExitRow && isWindow) {
    return faker.number.int({ min: 35, max: 50 });
  }
  if (isExitRow) {
    return faker.number.int({ min: 25, max: 40 });
  }
  if (isWindow) {
    return faker.number.int({ min: 10, max: 20 });
  }
  return 0;
}

function generateFakeSeats(cabinClass: string): FakeSeat[] {
  const layout = SEAT_LAYOUTS[cabinClass];
  const seats: FakeSeat[] = [];

  const midpointLeft = Math.floor(layout.cols.length / 2) - 1;
  const midpointRight = Math.floor(layout.cols.length / 2);

  for (let row = 1; row <= layout.rows; row++) {
    const isExitRow = row === 1 || row === Math.ceil(layout.rows / 2);

    for (let colIndex = 0; colIndex < layout.cols.length; colIndex++) {
      const col = layout.cols[colIndex];
      const isWindow = colIndex === 0 || colIndex === layout.cols.length - 1;
      const isAisle =
        !isWindow && (colIndex === midpointLeft || colIndex === midpointRight);

      seats.push({
        seat_number: `${row}${col}`,
        cabin_class: cabinClass,
        is_window: isWindow,
        is_aisle: isAisle,
        is_exit_row: isExitRow,
        is_booked: Math.random() < 0.35,
        extra_fee: calculateSeatFee(isWindow, isExitRow),
      });
    }
  }

  return seats;
}

function generateFakeGate() {
  return {
    gate_number: `${faker.helpers.arrayElement(["A", "B", "C", "D"])}${faker.number.int({ min: 1, max: 30 })}`,
    terminal: `Terminal ${faker.number.int({ min: 1, max: 5 })}`,
  };
}

async function ensureAirportPool() {
  const existingCount = await prisma.airport.count();
  if (existingCount >= MIN_AIRPORTS) return; // pool already seeded, skip

  const fakeAirports = populateFakeAirports();
  for (const airport of fakeAirports) {
    await prisma.airport.upsert({
      where: { airport_code: airport.code },
      update: {},
      create: {
        airport_code: airport.code,
        airport_name: airport.name,
        city: airport.city,
        country: airport.country,
        image_url: airport.imageUrl,
      },
    });
  }
}

/**
 * Airlines are now a stable, globally-shared pool: Airlines.iata_code is
 * unique and Carriers.code is a required FK into it, so we can't regenerate
 * a fresh batch of airlines every run the way the old script did. Seed once,
 * top up if the pool is thin.
 */
async function ensureAirlinePool() {
  const existingCount = await prisma.airlines.count();
  if (existingCount >= MIN_AIRLINES) return;

  const fakeAirlines = populateFakeAirlines();
  for (const airline of fakeAirlines) {
    await prisma.airlines.upsert({
      where: { iata_code: airline.iata_code },
      update: {},
      create: {
        name: airline.name,
        iata_code: airline.iata_code,
        logo: airline.logo,
      },
    });
  }
}

/**
 * A database **transaction** refers to a sequence of read/write operations
 * that are guaranteed to either succeed or fail as a whole
 */

async function clearStaleData() {
  try {
    const now = new Date();
    const bufferTime = new Date(now.getTime() - 30 * 60 * 1000); //30 mins ago
    const MAX_FLIGHTS = 1500;

    console.info("🧹 Maintenance started...");

    // --- PART 1: DELETE TRULY STALE DATA (In the past) ---
    const staleDelete = await prisma.data.deleteMany({
      where: {
        flight_offers: {
          some: {
            segments: {
              some: {
                departure_time: {
                  lt: bufferTime, // Use Date object directly
                },
              },
            },
          },
        },
      },
    });

    if (staleDelete.count > 0) {
      console.info(`✅ Removed ${staleDelete.count} expired flights.`);
    }

    // --- PART 2: ROTATE FUTURE DATA IF FULL ---
    const currentCount = await prisma.data.count();

    if (currentCount >= MAX_FLIGHTS) {
      console.info(
        `⚠️ Capacity reached (${currentCount}/${MAX_FLIGHTS}). Rotating data...`,
      );

      // Find the IDs of the oldest flights (by creation time) to make room
      const flightsToRotate = await prisma.data.findMany({
        take: 500,
        orderBy: {
          createdAt: "asc", // "asc" puts the oldest timestamps at the top
        },
        select: { id: true },
      });

      await prisma.data.deleteMany({
        where: { id: { in: flightsToRotate.map((f) => f.id) } },
      });

      console.info(
        "♻️ Deleted 500 soonest flights to make room for new generation.",
      );
      return true; // Now returns true so main() can add new ones
    }

    return true;
  } catch (error) {
    console.error("❌ Error during stale data cleanup:", error);
    return false; // Return false to signal main() to skip generation
  }
}

async function main() {
  await ensureAirportPool();
  await ensureAirlinePool();
  const isHealthyAndHasRoom = await clearStaleData();
  if (!isHealthyAndHasRoom) return;

  const cabinClasses = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
  ];

  console.info("Launching multi-day seed process...");

  const createdAirports = await prisma.airport.findMany();
  const currentFlightAirlines = await prisma.airlines.findMany();

  const latestSegment = await prisma.segment.findFirst({
    orderBy: { departure_time: "desc" },
    select: { departure_time: true },
  });

  const today = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);

  let startDate = new Date();
  if (latestSegment) {
    const lastDate = new Date(latestSegment.departure_time);
    if (lastDate >= ninetyDaysFromNow) {
      console.info("✅ 90-day window is already full.");
      return;
    }
    startDate = new Date(lastDate);
    // this means that if the DB has like some data left it continues from it stops until it reaches the 90 day max
    startDate.setDate(lastDate.getDate() + 1);
  }

  const diffTime = ninetyDaysFromNow.getTime() - startDate.getTime();
  /**
   * 1000 (ms to seconds)
   * 60 (seconds to minutes)
   * 60 (minutes to hours)
   * 24 (hours to days)
   * max to 0
   */
  const daysToGenerate = Math.max(
    0,
    Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
  );

  if (daysToGenerate === 0) return;

  for (let day = 0; day < daysToGenerate; day++) {
    const flightDate = new Date(startDate.getTime());
    flightDate.setDate(flightDate.getDate() + day);
    console.info(
      `📅 Processing Day ${day + 1}/${daysToGenerate}: ${flightDate.toDateString()}`,
    );

    await prisma.$transaction(
      async (tx) => {
        // Data no longer stores duration_min/duration_max (those fields were
        // removed from the schema) — it's now just an id + timestamp anchor
        // that FlightOffers hang off of.
        const createdData = await tx.data.create({ data: {} });

        // ---------------------------------------------------------------
        // numRoutes = how many distinct O&D pairs we generate for this day.
        // ---------------------------------------------------------------
        const numRoutes = faker.number.int({ min: 20, max: 30 });

        for (let r = 0; r < numRoutes; r++) {
          // Pick the route ONCE — shared across every time instance below
          const [depAirport, arrAirport] = faker.helpers.arrayElements(
            createdAirports,
            2,
          );
          const allAvailableCodes = createdAirports.map((a) => a.airport_code);

          // returnDate is computed ONCE per route (not per instance), so
          // every round-trip instance on this route shares the same return
          // day — a search for an exact depart+return date pair can then
          // surface ALL of that route's round-trip flight-time instances.
          const routeReturnDate = new Date(flightDate);
          routeReturnDate.setDate(
            routeReturnDate.getDate() + faker.number.int({ min: 2, max: 10 }),
          );

          // Each route gets its OWN subset of 2-4 carriers drawn from the
          // global Airlines pool, instead of every route sharing the same
          // 1-3 airlines.
          const routeAirlines = faker.helpers.arrayElements(
            currentFlightAirlines,
            Math.min(
              currentFlightAirlines.length,
              faker.number.int({ min: 2, max: 4 }),
            ),
          );

          const numFlightInstances = faker.number.int({ min: 10, max: 15 });

          for (let f = 0; f < numFlightInstances; f++) {
            // isRoundTrip is decided PER INSTANCE, giving a realistic mix
            // of one-way and round-trip flight numbers on the same
            // route/day, matching how a real GDS returns both trip types.
            const isRoundTrip = Math.random() < 0.6;

            const outbound = populateFakeSegments(
              flightDate,
              depAirport.airport_code,
              arrAirport.airport_code,
            );
            const inbound = isRoundTrip
              ? populateFakeSegments(
                  routeReturnDate,
                  arrAirport.airport_code,
                  depAirport.airport_code,
                )
              : null;

            const depHour = outbound.departure_time.getUTCHours();
            const timeMult = depHour >= 10 && depHour <= 17 ? 1.1 : 0.8;

            // One airline + flight number PER INSTANCE — shared by all cabins.
            const instanceAirline = faker.helpers.arrayElement(routeAirlines);
            const outboundFlightNumber = `${instanceAirline.iata_code}${faker.airline.flightNumber({ length: 3 })}`;
            const inboundFlightNumber = inbound
              ? `${instanceAirline.iata_code}${faker.airline.flightNumber({ length: 3 })}`
              : null;

            // ---------------------------------------------------------
            // Carriers must exist BEFORE the Segment that references them
            // (Segment.marketingCarrierId is a required FK). Created once
            // per instance and reused across both directions and all
            // cabins, since Carriers.marketingSegments/operatingSegments
            // are one-to-many.
            // ---------------------------------------------------------
            const marketingCarrier = await tx.carriers.create({
              data: {
                carrier_id: faker.string.uuid(), // descriptive only — no enforced relation on this field
                name: instanceAirline.name,
                logo: instanceAirline.logo,
                code: instanceAirline.iata_code,
              },
            });

            // ~15% chance of a codeshare: a different airline operates the
            // flight than the one marketing/selling it.
            let operatingCarrier: { id: number } | null = null;
            if (Math.random() < 0.15 && currentFlightAirlines.length > 1) {
              const opAirline = faker.helpers.arrayElement(
                currentFlightAirlines.filter(
                  (a) => a.id !== instanceAirline.id,
                ),
              );
              if (opAirline) {
                operatingCarrier = await tx.carriers.create({
                  data: {
                    carrier_id: faker.string.uuid(),
                    name: opAirline.name,
                    logo: opAirline.logo,
                    code: opAirline.iata_code,
                  },
                });
              }
            }

            // Stops/legs computed ONCE per instance — shared across cabins,
            // since the physical routing is identical regardless of cabin.
            const outboundLegsBase = populateFakeLegsData(
              outbound.departure_time,
              outbound.arrival_time,
              depAirport.airport_code,
              arrAirport.airport_code,
              allAvailableCodes,
            );

            const inboundLegsBase = inbound
              ? populateFakeLegsData(
                  inbound.departure_time,
                  inbound.arrival_time,
                  arrAirport.airport_code,
                  depAirport.airport_code,
                  allAvailableCodes,
                )
              : [];

            // Gates are created ONCE per leg (shared across cabins) since
            // Gate has no dependency on which Segment/cabin uses it.
            const outboundGatePairs = await Promise.all(
              outboundLegsBase.map(() =>
                Promise.all([
                  tx.gate.create({ data: generateFakeGate() }),
                  tx.gate.create({ data: generateFakeGate() }),
                ]),
              ),
            );
            const inboundGatePairs = await Promise.all(
              inboundLegsBase.map(() =>
                Promise.all([
                  tx.gate.create({ data: generateFakeGate() }),
                  tx.gate.create({ data: generateFakeGate() }),
                ]),
              ),
            );

            const buildLegsCreateData = (
              legsBase: FakeLeg[],
              gatePairs: { id: number }[][],
            ) =>
              legsBase.map((leg, i) => ({
                departure_airport_code: leg.departure_code,
                arrival_airport_code: leg.arrival_code,
                departure_time: leg.departure_time,
                arrival_time: leg.arrival_time,
                duration: leg.duration,
                departure_gate_id: gatePairs[i][0].id,
                arrival_gate_id: gatePairs[i][1].id,
              }));

            const totalDuration =
              outbound.duration + (inbound ? inbound.duration : 0);

            for (const cabin of cabinClasses) {
              const config = CABIN_CONFIGS[cabin];
              const routeBaseAmount =
                faker.number.int({ min: 100, max: 300 }) *
                config.multiplier *
                timeMult;
              const finalBaseAmount = isRoundTrip
                ? routeBaseAmount * 1.8
                : routeBaseAmount;

              // ---------------------------------------------------------
              // Traveler price breakdown — TravelerPrice now stores plain
              // Decimal fields directly, no nested Price sub-records.
              // ---------------------------------------------------------
              const travelerTypes: { type: string; mult: number }[] = [
                { type: "ADULT", mult: 1.0 },
                { type: "CHILD", mult: 0.8 },
                { type: "INFANT", mult: 0.15 },
              ];

              let mainAdultTotal = 0;
              let mainAdultBase = 0;
              let mainAdultTax = 0;

              const travelerPriceCreateData = travelerTypes.map(
                ({ type, mult }) => {
                  const base = Math.floor(finalBaseAmount * mult);
                  const tax = Math.floor(base * 0.15);
                  const total = base + tax;

                  if (type === "ADULT") {
                    mainAdultTotal = total;
                    mainAdultBase = base;
                    mainAdultTax = tax;
                  }

                  return {
                    passenger_type: type,
                    quantity: 1,
                    base_fare: base,
                    tax_amount: tax,
                    total_per_pax: total,
                  };
                },
              );

              const generatedSeats = generateFakeSeats(cabin);
              const seatsLeftCount = generatedSeats.filter(
                (s) => !s.is_booked,
              ).length;

              await tx.flightOffers.create({
                data: {
                  flight_offer_id: createdData.id,
                  token: faker.string.nanoid(60),
                  flight_key: faker.string.uuid(),
                  total_duration: totalDuration,
                  trip_type: isRoundTrip ? "ROUND_TRIP" : "ONE_WAY",
                  seats: {
                    create: generatedSeats.map((seat) => ({
                      seat_number: seat.seat_number,
                      cabin_class: seat.cabin_class,
                      is_window: seat.is_window,
                      is_aisle: seat.is_aisle,
                      is_exit_row: seat.is_exit_row,
                      is_booked: seat.is_booked,
                      extra_fee: seat.extra_fee,
                    })),
                  },
                  branded_fareinfo: {
                    create: {
                      cabin_class: cabin,
                      features: {
                        create: [
                          {
                            feature_name: "WIFI",
                            category: "AMENITIES",
                            availability: ["Business", "First Class"].includes(
                              cabin,
                            )
                              ? "INCLUDED"
                              : "OPTIONAL",
                          },
                          {
                            feature_name: "MEAL",
                            category: "DINING",
                            availability: "INCLUDED",
                          },
                          {
                            feature_name: "SEAT TYPE",
                            category: "SEAT & SPACE",
                            availability:
                              cabin === "Economy"
                                ? "STANDARD"
                                : cabin === "Premium Economy"
                                  ? "WIDE"
                                  : cabin === "Business"
                                    ? "FULLY-RECLINED"
                                    : "FULLY-RECLINED",
                          },
                          {
                            feature_name: "CONNECTIVITY",
                            category: "USB PORT & POWER OUTLET",
                            availability: ["Business", "First Class"].includes(
                              cabin,
                            )
                              ? "INCLUDED"
                              : "OPTIONAL",
                          },
                          {
                            feature_name: "SEATBACK SCREEN",
                            category: "MEDIA",
                            availability: ["Business", "First Class"].includes(
                              cabin,
                            )
                              ? "INCLUDED"
                              : "OPTIONAL",
                          },
                        ],
                      },
                    },
                  },
                  traveler_price: { create: travelerPriceCreateData },
                  price_breakdown: {
                    create: {
                      currency_code: "USD",
                      total_amount: mainAdultTotal,
                      base_amount: mainAdultBase,
                      tax_amount: mainAdultTax,
                      discount_amount: 0,
                    },
                  },
                  segments: {
                    create: [
                      // Outbound flight
                      {
                        departure_airport_code: outbound.departure_airport_code,
                        arrival_airport_code: outbound.arrival_airport_code,
                        duration: outbound.duration,
                        departure_time: outbound.departure_time_iso,
                        arrival_time: outbound.arrival_time_iso,
                        cabin_class: cabin,
                        slice_index: 0, // 0 = Outbound
                        marketingCarrierId: marketingCarrier.id,
                        operatingCarrierId: operatingCarrier?.id,
                        seat_availability: {
                          create: { seats_left: Math.max(seatsLeftCount, 1) },
                        },
                        flight_info: {
                          create: { flight_number: outboundFlightNumber },
                        },
                        legs: {
                          create: buildLegsCreateData(
                            outboundLegsBase,
                            outboundGatePairs,
                          ),
                        },
                      },
                      // Inbound flight
                      ...(inbound && inboundFlightNumber
                        ? [
                            {
                              departure_airport_code:
                                inbound.departure_airport_code,
                              arrival_airport_code:
                                inbound.arrival_airport_code,
                              duration: inbound.duration,
                              departure_time: inbound.departure_time_iso,
                              arrival_time: inbound.arrival_time_iso,
                              cabin_class: cabin,
                              slice_index: 1, // 1 = Inbound
                              marketingCarrierId: marketingCarrier.id,
                              operatingCarrierId: operatingCarrier?.id,
                              seat_availability: {
                                create: {
                                  seats_left: Math.max(seatsLeftCount, 1),
                                },
                              },
                              flight_info: {
                                create: { flight_number: inboundFlightNumber },
                              },
                              legs: {
                                create: buildLegsCreateData(
                                  inboundLegsBase,
                                  inboundGatePairs,
                                ),
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              });          
            } // end cabin loop
          } // end flight-time-instance loop
        } // end route loop
      },
      // Nested writes here (segments/legs/gates/carriers/etc.) are far
      // fewer round trips than the old post-hoc update pattern, but this
      // still does real work — profile a run and tune the timeout to the
      // observed worst case rather than guessing.
      { timeout: 120000, maxWait: 10000 },
    );
  }
}

//automate flight data creation every day at every 1 hour
async function runFlightDataCreateAutomation() {
  const startTime = new Date();
  console.info(
    `Flight data creation automation started at ${startTime.toLocaleString()}`,
  );
  try {
    await main();
    const endTime = new Date();
    console.info(
      `Flight data creation automation ended at ${endTime.toLocaleString()}`,
    );
  } catch (error) {
    console.error(
      `❌ Flight data creation automation failed: ${error} on ${new Date().toLocaleString()}`,
    );
  }
}

/**
 * 0 * * * * ---> Schedule flight data creation automation to run every hour.
 * The "Traffic Jam" Problem
 * Without this lock, if your 4:00 PM task takes 65 minutes to finish, the
 * 5:00 PM task will start while the first one is still writing to the
 * database.
 *
 * This causes:
 * Database Deadlocks: Two processes trying to update the same row at once.
 * CPU Spikes: Your laptop struggling to run two heavy seeding processes
 * simultaneously.
 * Data Corruption: Potentially creating duplicate records because the
 * second run doesn't realize the first run hasn't finished yet.
 *
 * IMPORTANT: there must be exactly ONE entry point into
 * runFlightDataCreateAutomation() — always go through runWithLock(),
 * never call runFlightDataCreateAutomation() directly, or the lock is
 * bypassed and you're back to two concurrent seed runs.
 */

let isRunning = false;

async function runWithLock() {
  if (isRunning) {
    console.warn("⚠️ Skipped: a run is already in progress.");
    return;
  }
  isRunning = true;
  try {
    await runFlightDataCreateAutomation();
  } finally {
    isRunning = false;
  }
}

runWithLock(); // sole entry point — initial run respects the lock too
console.info(
  "⏳ Flight Data Automation is running. Waiting for the next scheduled hour...",
);

cron.schedule("0 * * * *", () => {
  runWithLock();
});
