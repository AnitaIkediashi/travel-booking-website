
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null;
}

// read-only: safe in server components
export async function getOwnerId(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (userId) return userId;
  return (await cookies()).get("guest_id")?.value ?? null;
}

// can set a cookie: only call from server actions / route handlers
export async function getOrCreateOwnerId(): Promise<string> {
  const existing = await getOwnerId();
  if (existing) return existing;

  const id = randomUUID();
  (await cookies()).set("guest_id", id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}
