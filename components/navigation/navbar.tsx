"use client";

import Link from "next/link";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import { NavLinkProp } from "./home_navbar";
import Image from "next/image";
import logo from "@/public/logos/logo_mint.svg";
import { Button } from "../reusable/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "../icons/menu";
import { MobileMenu } from "./mobile_menu";

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

  const [showMenu, setShowMenu] = useState(false);
  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <header className="w-full h-[90px] bg-white xl:px-[147px] lg:px-[121px] px-8 py-[27px] md:px-[76px] flex items-center justify-center shadow-light font-montserrat fixed top-0 left-0 right-0 z-50">
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
          <Link href="/">
            <Image src={logo} alt="company logo" />
          </Link>
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
          <div className="cursor-pointer lg:hidden block" onClick={handleClick}>
            <MenuIcon fillColor="#112211" />
          </div>
        </nav>
      </header>
      <MobileMenu topSize="top-[90px]" showMenu={showMenu} />
    </>
  );
};
