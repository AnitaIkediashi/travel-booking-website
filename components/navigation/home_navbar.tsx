"use client";

import Image from "next/image";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import logo from "@/public/logos/light/Logo_light.svg";
import logoDark from "@/public/logos/logo_mint.svg";
import { Button } from "../reusable/button";
import { MobileMenu } from "./mobile_menu";
import { useEffect, useState } from "react";
import { MenuIcon } from "../icons/menu";
import { SearchPlaces } from "../reusable/search_places";
import Link from "next/link";

export type NavLinkProp = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NavLinks: NavLinkProp[] = [
  {
    label: "find flight",
    href: "/flight-flow/flight-search",
    icon: <FlightIcon fillColor="white" />,
  },
  {
    label: "find stays",
    href: "/hotel-flow/hotel-search",
    icon: <BedIcon fillColor="white" />,
  },
];

export const HomeNavbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  // Handle scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="md:mx-[30px] md:mt-[30px] mx-3 mt-4 font-montserrat">
        <div className="bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/landing_page/home_bg.png)] bg-no-repeat bg-center bg-cover lg:h-[581px] h-[462px] rounded-3xl relative flex items-center justify-center">
          <header
            className={`px-8 py-10 fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
              isScrolled ? "bg-white py-[30px] shadow-light" : ""
            }`}
          >
            <nav className="flex items-center justify-between text-white">
              <div className="lg:flex items-center gap-8 hidden">
                {NavLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center gap-[3.5px]"
                  >
                    {link.icon}
                    <span className="capitalize text-sm font-semibold">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/">
                <Image src={isScrolled ? logoDark : logo} alt="company logo" />
              </Link>
              <div className="lg:flex items-center gap-8 hidden">
                <Button
                  label="login"
                  className="capitalize text-white text-sm font-semibold"
                />
                <Button
                  label="Sign up"
                  className="text-sm font-semibold px-6 py-[15.5px] rounded-lg bg-white text-blackish-green"
                />
              </div>
              <div
                className="cursor-pointer lg:hidden block"
                onClick={handleClick}
              >
                <MenuIcon fillColor={isScrolled ? "#112211" : "#fff"} />
              </div>
            </nav>
          </header>
          <MobileMenu showMenu={showMenu} topSize={isScrolled ? 'top-[96px]' : "top-[69px]"} />
          <div className="flex flex-col items-center justify-center gap-1 text-white">
            <h3 className=" capitalize font-bold lg:text-[45px] sm:text-3xl text-2xl">
              helping others
            </h3>
            <h1 className="uppercase font-bold lg:text-[80px] sm:text-6xl text-4xl">
              live & travel
            </h1>
            <p className="lg:text-[20px] sm:text-lg text-base font-semibold">
              Special offers to suit your plan
            </p>
          </div>
        </div>
      </section>
      <div className="relative -top-[105px]">
        <SearchPlaces />
      </div>
    </>
  );
};
