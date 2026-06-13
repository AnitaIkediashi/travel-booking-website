
import Link from "next/link";
import { Avatar } from "antd";
import { UserIcon } from "../icons/user";
import { ArrowRightIcon } from "../icons/arrow-right";
import { CardIcon } from "../icons/card";
import { Button } from "../reusable/button";
import { ExitIcon } from "../icons/exit";
import { signOut } from "next-auth/react";
import { useState } from "react";

type MenuProps = {
  showAccountMenu: boolean;
  topSize: string;
  isScrolled?: boolean;
  initials: string;
  avatarImg?: string | null | undefined;
  fullname: string | null | undefined;
};

export const AccountMenu = ({
  showAccountMenu,
  topSize,
  isScrolled,
  initials,
  avatarImg,
  fullname,
}: MenuProps) => {

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({ callbackUrl: "/signin" });
    setIsLoggingOut(false);
  };

  return (
    <div
      className={`fixed ${topSize} md:w-[329px] bg-white rounded-lg flex flex-col md:p-8 p-6 transition-all duration-300 ease-in-out z-50 font-montserrat shadow-[0px_2px_10px_rgba(0,0,0,0.05)] ${
        showAccountMenu
          ? "right-0 -translate-x-8  opacity-100"
          : "right-0 translate-x-0 opacity-0"
      } before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rotate-45 before:z-10 before:-top-1.5 ${isScrolled ? "before:right-[88px]" : "md:before:right-[116px] before:right-[88px]"}`}
    >
      <div className="flex items-center gap-4 pb-6 border-b-[0.5px] border-b-blackish-green/25">
        {avatarImg ? (
          <Avatar src={avatarImg} size={64} />
        ) : (
          <Avatar size={40}>{initials}</Avatar>
        )}
        <div>
          <p className="font-semibold text-sm md:text-base">{fullname}</p>
          <small className="capitalize text-xs md:text-sm">online</small>
        </div>
      </div>
      <ul className="py-6 border-b-[0.5px] border-b-blackish-green/25">
        <li className="w-full mb-4 group">
          <Link href="" className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <UserIcon />
              <span className="text-xs md:text-sm font-medium group-hover:font-semibold">
                My account
              </span>
            </div>
            <ArrowRightIcon />
          </Link>
        </li>
        <li className="w-full group">
          <Link href="" className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CardIcon />
              <span className="text-xs md:text-sm font-medium group-hover:font-semibold">
                Payments
              </span>
            </div>
            <ArrowRightIcon />
          </Link>
        </li>
      </ul>
      <Button
        label={isLoggingOut ? "Logging out..." : "Logout"}
        icon={<ExitIcon />}
        className={`flex items-center gap-2 group mt-6 transition-opacity ${isLoggingOut ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        labelClassName="text-xs md:text-sm font-medium group-hover:font-semibold"
        onClick={handleLogout}
      />
    </div>
  );
};
