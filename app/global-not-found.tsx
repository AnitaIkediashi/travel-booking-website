import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "404 Page Not Found - Golobe Booking Website",
  description:
    "Experimenting with the Global Not Found Page in Next.js. The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased h-screen`}>
      <body>
        <div>hello world</div>
      </body>
    </html>
  );
}