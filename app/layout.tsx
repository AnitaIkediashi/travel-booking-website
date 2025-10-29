import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/navigation/footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Golobe Booking Website",
  description:
    "Travel Guide and booking website for Golobe developed using a full-stack framework, featuring Next.js, Typescript, Prisma ORM, PostgreSQL, REST API, OAuth, NextAuth, Tailwind CSS, Zod, React Hook Form, Cloudinary, Context API, Ant Design, and optimized for SEO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable}  antialiased min-h-screen`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
