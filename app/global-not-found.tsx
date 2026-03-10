'use client';

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Button } from "@/components/reusable/button";
import { RedirectIcon } from "@/components/icons/redirect";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const handleGoHome = () => {
    router.push("/");
    router.refresh();
  }
  return (
    <html lang="en" className={`${montserrat.variable} antialiased min-h-screen`}>
      <body className="">
        <section className="w-full h-full flex flex-col gap-10 items-center justify-center pt-10">
          <h1 className="font-bold text-4xl md:text-[64px] capitalize">
            oops!
          </h1>
          <div className="flex justify-center lg:gap-5 gap-3">
            <div className="w-1/4 max-w-[313px]">
              <svg
                className="w-full h-auto"
                viewBox="0 0 313 404"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M312.973 325.202H268.503V403.251H160.682V325.202H0V245.475L167.814 0H268.503V243.797H312.973V325.202ZM160.682 243.797V196.8C160.682 187.988 161.102 176.239 161.521 161.132C162.36 146.026 162.78 138.473 163.199 137.634H160.262C153.969 151.901 146.837 164.909 138.866 177.497L94.3954 243.797H160.682Z"
                  fill="#8dd3bb"
                />
              </svg>
            </div>
            <div className="relative max-w-[362px] w-1/4 flex items-center justify-center">
              <svg
                className="w-full h-auto"
                viewBox="0 0 292 415"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M291.158 208.129C291.158 279.464 278.991 331.916 255.497 365.066C231.583 398.215 195.084 415 145.579 415C97.3322 415 61.2521 397.796 36.4996 362.968C12.1665 328.14 0 276.527 0 208.129C0 136.375 11.747 83.9231 36.08 50.3539C59.9935 16.7846 96.4931 0 145.998 0C193.825 0 230.325 17.6239 254.658 52.452C278.991 87.2801 291.158 138.893 291.158 208.129ZM108.24 208.129C108.24 253.868 111.177 285.339 116.631 302.123C122.504 319.328 131.734 327.72 145.159 327.72C158.584 327.72 168.234 318.908 174.107 301.284C179.561 283.66 182.498 252.609 182.498 208.129C182.498 163.231 179.561 132.179 174.107 114.135C168.234 96.092 159.004 87.2801 145.579 87.2801C132.154 87.2801 122.504 96.092 117.05 113.296C111.177 130.501 108.24 161.972 108.24 208.129Z"
                  fill="#8dd3bb"
                />
              </svg>
              <div className="absolute top-[23px] inset-0 z-10">
                <Image
                  src="/illustrations/what_you_looking_at.png"
                  alt="what you looking at"
                  width={362}
                  height={401}
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="w-1/4 max-w-[313px]">
              <svg
                className="w-full h-auto"
                viewBox="0 0 313 404"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M312.973 325.202H268.503V403.251H160.682V325.202H0V245.475L167.814 0H268.503V243.797H312.973V325.202ZM160.682 243.797V196.8C160.682 187.988 161.102 176.239 161.521 161.132C162.36 146.026 162.78 138.473 163.199 137.634H160.262C153.969 151.901 146.837 164.909 138.866 177.497L94.3954 243.797H160.682Z"
                  fill="#8dd3bb"
                />
              </svg>
            </div>
          </div>
          <div>
            <Button
              label="Go back home"
              className="flex gap-3 items-center pb-2 border-b border-b-blackish-green md:text-2xl text-lg hover:border-b-2 hover:font-semibold"
              icon={<RedirectIcon />}
              onClick={handleGoHome}
            />
          </div>
        </section>
      </body>
    </html>
  );
}