import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    phoneNo?: string | null;
    coverImage?: string | null;
  }
  interface Session {
    user: {
      id: string;
      phoneNo?: string | null;
      coverImage?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phoneNo?: string | null;
    coverImage?: string | null;
  }
}
