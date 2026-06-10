"use client";

import Image from "next/image";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import logo from "@/public/logos/light/Logo_light.svg";
import logoDark from "@/public/logos/logo_mint.svg";
import { Button } from "../reusable/button";
import { useEffect, useState } from "react";
import { SearchPlaces } from "../reusable/search_places";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth-context";
import { Avatar } from "antd";
import { AccountMenu } from "./account_menu";
import { MenuIcon } from "../icons/menu";
import { OtherMenus } from "./other_menus";

export type NavLinkProp = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export const HomeNavbar = () => {
  const { user, isAuthenticated } = useCurrentUser();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const firstInitial = user?.name?.charAt(0).toUpperCase();
  const lastInitial = user?.name?.includes(" ")
    ? user?.name?.split(" ").slice(-1)[0].charAt(0).toUpperCase()
    : "";

  const fullname = user?.name?.includes(" ")
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : user?.name;

  const handleClick = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const handleClose = () => {
    setShowOtherMenu(!showOtherMenu);
  };

  const NavLinks: NavLinkProp[] = [
    {
      label: "find flight",
      href: "/flight-flow/flight-search",
      icon: <FlightIcon fillColor={isScrolled ? "#112211" : "white"} />,
    },
    {
      label: "find stays",
      href: "/hotel-flow/hotel-search",
      icon: <BedIcon fillColor={isScrolled ? "#112211" : "white"} />,
    },
  ];

  // Handle scroll logic - side effect
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

  useEffect(() => {
    if (showOtherMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showOtherMenu]);

  return (
    <>
      <section className="md:mx-[30px] md:mt-[30px] mx-3 mt-4 font-montserrat">
        <div className="bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/landing_page/home_bg.png)] bg-no-repeat bg-center bg-cover lg:h-[581px] h-[462px] rounded-3xl relative flex items-center justify-center">
          <header
            className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
              isScrolled
                ? "bg-white py-[30px] shadow-light px-8"
                : "md:px-16 md:py-[54px] px-8 py-6"
            }`}
          >
            <nav
              className={`flex items-center justify-between  ${
                isScrolled ? "text-blackish-green" : "text-white"
              }`}
            >
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
              <div className="flex items-center gap-8">
                {isAuthenticated ? (
                  <>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={handleClick}
                    >
                      {user?.image ? (
                        <Avatar src={user.image} />
                      ) : (
                        <Avatar
                          style={{
                            backgroundColor: "#fde3cf",
                            color: "#f56a00",
                          }}
                        >
                          {firstInitial}
                          {lastInitial}
                        </Avatar>
                      )}
                      <p
                        className={`font-semibold text-sm hidden lg:block ${isScrolled ? "text-blackish-green" : "text-white"}`}
                      >
                        {fullname}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="lg:flex items-center gap-8 hidden">
                    <Button
                      label="login"
                      className={`capitalize text-sm font-semibold ${
                        isScrolled ? "text-blackish-green" : "text-white"
                      }`}
                      href="/signin"
                    />
                    <Button
                      label="Sign up"
                      className={`text-sm font-semibold px-6 py-[15.5px] rounded-lg hidden lg:block ${
                        isScrolled
                          ? "text-white bg-blackish-green"
                          : "text-blackish-green bg-white"
                      }`}
                      href="/signup"
                    />
                  </div>
                )}
                <div
                  className={`lg:hidden cursor-pointer w-11 h-11 flex items-center justify-center rounded-lg hover:bg-blackish-green/75`}
                  onClick={handleClose}
                >
                  <MenuIcon fillColor={isScrolled ? "#000" : "#fff"} />
                </div>
              </div>
            </nav>
          </header>
          <AccountMenu
            showAccountMenu={showAccountMenu}
            topSize={isScrolled ? "top-[113px]" : "md:top-[102px] top-[82px]"}
            isScrolled={isScrolled}
          />
          <OtherMenus showOtherMenu={showOtherMenu} closeMenu={handleClose} />
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
