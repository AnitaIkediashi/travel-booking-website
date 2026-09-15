import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const searchFields = ["country", "city", "state", "name"];

    const orFilters = searchFields.map((field) => ({
      [field]: { contains: query, mode: "insensitive" },
    }));

    try {
      const hotelList = await prisma.hotels.findMany({
        select: {
          id: true,
          name: true,
          country: true,
          city: true,
          state: true,
        },
        where: { OR: orFilters },
      });
      return NextResponse.json(hotelList);
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch airports: ${error}` },
        { status: 500 },
      );
    }
}