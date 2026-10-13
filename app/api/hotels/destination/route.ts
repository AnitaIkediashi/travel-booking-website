import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json([]);

  const match = { contains: query, mode: "insensitive" as const };

  try {
    const [cities, states, countries, hotels] = await Promise.all([
      prisma.hotels.findMany({
        where: { city: match },
        select: { city: true, state: true, country: true },
        distinct: ["city", "state", "country"],
        take: 4,
      }),
      prisma.hotels.findMany({
        where: { state: match },
        select: { state: true, country: true },
        distinct: ["state", "country"],
        take: 3,
      }),
      prisma.hotels.findMany({
        where: { country: match },
        select: { country: true },
        distinct: ["country"],
        take: 2,
      }),
      prisma.hotels.findMany({
        where: { name: match },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          country: true,
        },
        take: 5,
      }),
    ]);

    const suggestions = [
      ...cities.map((c) => ({
        type: "city" as const,
        value: c.city,
        label: c.city,
        sublabel: [c.state, c.country].filter(Boolean).join(", "),
      })),
      ...states.map((s) => ({
        type: "state" as const,
        value: s.state,
        label: s.state,
        sublabel: s.country,
      })),
      ...countries.map((c) => ({
        type: "country" as const,
        value: c.country,
        label: c.country,
        sublabel: "Country",
      })),
      ...hotels.map((h) => ({
        type: "hotel" as const,
        value: h.id, // pin to the exact hotel, not its name
        label: h.name,
        sublabel: [h.city, h.state, h.country].filter(Boolean).join(", "),
      })),
    ];

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Destination suggestions failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 },
    );
  }
}
