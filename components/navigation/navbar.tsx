"use client";

import Link from "next/link";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import { NavLinkProp } from "./home_navbar";
import Image from "next/image";
import logo from "@/public/logos/logo_mint.svg";
import { Button } from "../reusable/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon } from "../icons/menu";
import { AccountMenu } from "./account_menu";
import { useCurrentUser } from "@/lib/auth-context";
import { Avatar } from "antd";
import { OtherMenus } from "./other_menus";

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
  const { user, isAuthenticated } = useCurrentUser();
  const pathname = usePathname();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showOtherMenu, setShowOtherMenu] = useState(false);

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

  const avatarImg = user?.image;
  const initials = `${firstInitial}${lastInitial}`;

  const handleClick = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const handleOpenOtherMenu = () => {
    setShowOtherMenu(true);
  };

  const handleCloseOtherMenu = () => {
    setShowOtherMenu(false);
  };

  useEffect(() => {
    if (showOtherMenu) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [showOtherMenu]);

  return (
    <>
      <header
        className={`w-full h-[90px] bg-white shadow-light xl:px-[147px] lg:px-[121px] px-8 py-[27px] md:px-[76px] flex items-center justify-center font-montserrat absolute top-0 left-0 right-0 z-50 `}
      >
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
          <div className="flex items-center gap-6">
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
                  <p className={`font-semibold text-sm hidden lg:block`}>
                    {fullname}
                  </p>
                </div>
              </>
            ) : (
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
            )}
            <div
              className={`lg:hidden cursor-pointer w-11 h-11 flex items-center justify-center rounded-lg hover:bg-blackish-green/75`}
              onClick={handleOpenOtherMenu}
            >
              <MenuIcon fillColor="#112211" />
            </div>
          </div>
        </nav>
      </header>
      <AccountMenu
        topSize="top-[95px]"
        showAccountMenu={showAccountMenu}
        setShowAccountMenu={setShowAccountMenu}
        avatarImg={avatarImg}
        initials={initials}
        fullname={fullname}
      />
      <OtherMenus
        isAuthenticated={isAuthenticated}
        showOtherMenu={showOtherMenu}
        closeMenu={handleCloseOtherMenu}
      />
    </>
  );
};
