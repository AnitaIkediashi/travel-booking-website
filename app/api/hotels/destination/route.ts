import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim() ?? "";
  if (query.length < 1) return NextResponse.json([]);

  const prefix = { startsWith: query, mode: "insensitive" as const };
  const contains = { contains: query, mode: "insensitive" as const };

  try {
    const [cities, states, countries, hotels] = await Promise.all([
      prisma.hotels.groupBy({
        by: ["city", "state", "country"],
        where: { city: prefix },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 4,
      }),
      prisma.hotels.groupBy({
        by: ["state", "country"],
        where: { state: prefix },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 3,
      }),
      prisma.hotels.groupBy({
        by: ["country"],
        where: { country: prefix },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 2,
      }),
      prisma.hotels.findMany({
        where: { name: query.length >= 3 ? contains : prefix },
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          country: true,
        },
        orderBy: { name: "asc" },
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
        value: h.id, 
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
