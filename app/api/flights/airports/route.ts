import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const query = searchParams.get('query') || '';
  const searchFields = ["airport_code", "airport_name", "city", "country"];
  const orFilters = searchFields.map((field) => ({
    [field]: { contains: query, mode: "insensitive" },
  }));

  try {
    const airports = await prisma.airport.findMany({
      where: { OR: orFilters },
    });
    return NextResponse.json(airports);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch airports" },
      { status: 500 }
    );
  }
}