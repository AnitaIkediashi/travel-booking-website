
import { FlightIcon } from "../icons/flight";
import { BedIcon } from "../icons/bed";
import { Button } from "../reusable/button";
import Link from "next/link";

type MenuProps = {
  showMenu: boolean;
  topSize: string
};

export const MobileMenu = ({showMenu, topSize}: MenuProps) => {
  return (
    <ul
      className={`fixed ${topSize} lg:hidden bg-white md:w-[210px] w-44 rounded-lg flex flex-col gap-6 p-4 transition-all duration-300 ease-in-out z-50 font-montserrat ${
        showMenu
          ? "right-0 -translate-x-8  opacity-100"
          : "right-0 translate-x-0 opacity-0"
      }`}
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
      <li className="hover:bg-blackish-green/30 hover:py-3 hover:px-2 hover:rounded-lg transition-all duration-300 ease-in-out">
        <Button
          label="login"
          className="capitalize text-blackish-green text-sm font-semibold"
        />
      </li>
      <li>
        <Button
          label="Sign up"
          className="text-white bg-blackish-green w-full text-sm font-semibold py-3 rounded-lg hover:bg-blackish-green/70 transition duration-300 ease-in-out"
        />
      </li>
    </ul>
  );
};
