
import { FlightIcon } from "../icons/flight";
import { BedIcon } from "../icons/bed";
import Link from "next/link";

type MenuProps = {
  showAccountMenu: boolean;
  topSize: string;
  isScrolled: boolean;
};

export const AccountMenu = ({showAccountMenu, topSize, isScrolled}: MenuProps) => {
  return (
    <ul
      className={`fixed ${topSize} bg-white md:w-[210px] w-44 rounded-lg flex flex-col gap-6 p-4 transition-all duration-300 ease-in-out z-50 font-montserrat shadow-[0px_2px_10px_rgba(0,0,0,0.05)] ${
        showAccountMenu
          ? "right-0 -translate-x-8  opacity-100"
          : "right-0 translate-x-0 opacity-0"
      } before:absolute before:content-[''] before:w-3 before:h-3 before:bg-white before:rotate-45 before:z-10 before:-top-1.5 ${isScrolled ? "before:right-[88px]" : "md:before:right-[116px] before:right-[88px]"}`}
    >
      <li className="flex items-center gap-[3.5px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-blackish-green/30 hover:py-3 hover:px-2 hover:rounded-lg">
        <FlightIcon fillColor="#112211" />
        <Link
          href="/flight-flow/flight-search"
          className="capitalize text-sm font-semibold text-blackish-green"
        >
          find flight
        </Link>
      </li>
      <li className="flex items-center gap-[3.5px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-blackish-green/30 hover:py-3 hover:px-2 hover:rounded-lg">
        <BedIcon fillColor="#112211" />
        <Link
          href="/hotel-flow/hotel-search"
          className="capitalize text-sm font-semibold text-blackish-green"
        >
          find stays
        </Link>
      </li>
    </ul>
  );
};
