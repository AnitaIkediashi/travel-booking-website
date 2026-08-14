import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",

    /**
     * The maximum lifespan of the session in seconds.
     *
     * **How this works under the hood:**
     * NextAuth stores an expiry timestamp directly inside the encrypted JWT itself
     * (not in server-side session storage). Every time `getServerSession` or `useSession`
     * reads the cookie, the library checks whether `now > expiry`.
     *
     * - If expired, the session is treated as invalid and the user is effectively logged out.
     * - The next protected request or page load will treat them as unauthenticated.
     *
     * @default 2592000 (30 days in seconds)
     * @see updateAge to control how often this window rolls forward.
     */
    maxAge: 30 * 24 * 60 * 60,

    /**
     * Controls how often the session expiry gets pushed forward while the user is active.
     *
     * **How this works under the hood:**
     * - With `updateAge: 24 * 60 * 60` (24h), NextAuth checks if 24 hours have passed since
     *   the JWT was last re-encoded. If active, it issues a fresh cookie extending `maxAge`.
     *   An active user gets a rolling 30-day window from their last visit, while an
     *   inactive user hits the hard 30-day cutoff and is logged out.
     *
     * - Setting `updateAge: 0` refreshes the session token and writes a new cookie on **every request**.
     *
     * @default 86400 (24 hours in seconds)
     * @note For a true non-rolling expiry (a hard 30 days from initial login regardless of activity),
     * implement custom `jwt()` logic checking `token.iat` against a fixed cutoff instead.
     */
    updateAge: 24 * 60 * 60,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // No user found, or user is OAuth-only (no password)
        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNo,
        };
      },
    }),
  ],

  callbacks: {
    // Stamp DB user id + phoneNo onto the JWT on first sign-in, and
    // refresh phoneNo from the DB on every subsequent request so
    // profile edits (e.g. from a settings page) show up without
    // forcing the user to log out/in again.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phoneNo = user.phoneNo ?? null;
        return token;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { phoneNo: true },
        });
        token.phoneNo = dbUser?.phoneNo ?? null;
      }

      return token;
    },

    // Expose token.id / token.phoneNo on the session object for client + server use
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
        session.user.phoneNo = token.phoneNo ?? null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
