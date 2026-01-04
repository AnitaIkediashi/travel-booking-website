import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.data.findMany({
      include: {
        flight_offers: {
          include: {
            segments: {
              include: {legs: true}
            }
          }
        }
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to fetch flights: ${error}`,
      },
      { status: 500 }
    );
  }
}
