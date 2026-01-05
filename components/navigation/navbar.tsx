'use client'

import Link from "next/link";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import { NavLinkProp } from "./home_navbar";
import Image from "next/image";
import logo from "@/public/logos/logo_mint.svg";
import { Button } from "../reusable/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NavLinksDark: NavLinkProp[] = [
  {
    label: "find flight",
    href: "/flight-flow/flight-search",
    icon: <FlightIcon fillColor="#112211" />,
  },
  {
    label: "find stays",
    href: "/hotel-flow/hotel-search",
    icon: <BedIcon fillColor="#112211" />,
  },
];
export const Navbar = () => {
  const pathname = usePathname();

  const [active, setActive] = useState(false);

  return (
    <>
      <header className="w-full h-[90px] bg-white px-[104px] py-[27px] flex items-center justify-center shadow-light font-montserrat">
        <nav className="w-full flex items-center justify-between">
          {/* links */}
          <div className="lg:flex items-center gap-8 hidden transition-all duration-200">
            {NavLinksDark.map((link, index) => {
              // Check if current path matches or is a sub-path of the link
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`flex items-center gap-[3.5px] relative ${
                    isActive
                      ? "after:content-[''] after:absolute after:w-full after:h-[5px] after:bg-mint-green-100 after:-bottom-[35px] after:left-0 "
                      : ""
                  }`}
                >
                  {link.icon}
                  <span className="capitalize text-sm font-semibold">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
          {/* logo */}
          <Image src={logo} alt="company logo" />
          {/* authentication */}
          <div className="lg:flex items-center gap-8 hidden">
            <Button
              label="login"
              className="capitalize text-blackish-green text-sm font-semibold"
            />
            <Button
              label="Sign up"
              className="text-sm font-semibold px-6 py-[15.5px] rounded-lg bg-blackish-green text-white"
            />
          </div>
        </nav>
      </header>
    </>
  );
};
