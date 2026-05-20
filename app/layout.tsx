import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/lib/auth-context";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Golobe Booking Website",
  description:
    "Travel Guide and booking website for Golobe developed using a full-stack framework, featuring Next.js, Typescript, Prisma ORM, PostgreSQL, REST API, OAuth, NextAuth, Tailwind CSS, Zod, React Hook Form, Cloudinary, Context API, Ant Design, and optimized for SEO.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`${montserrat.variable}  antialiased min-h-screen`}>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
