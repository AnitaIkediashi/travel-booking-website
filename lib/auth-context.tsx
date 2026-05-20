"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Session } from "next-auth";

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}

// Use this hook in any client component that needs the current user
export function useCurrentUser() {
  const { data: session, status } = useSession();
  return {
    user: session?.user ?? null,
    userId: session?.user?.id ?? null,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
