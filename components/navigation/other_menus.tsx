import Link from "next/link";
import { BedIcon } from "../icons/bed";
import { FlightIcon } from "../icons/flight";
import { CloseIcon } from "../icons/close";

type OtherMenuProps = {
  showOtherMenu: boolean;
  closeMenu: () => void;
};

export const OtherMenus = ({ showOtherMenu, closeMenu }: OtherMenuProps) => {
  return (
    <div
      className={`fixed inset-0 bg-blackish-green/30 z-50 backdrop-blur-xs transition-opacity duration-300 ${showOtherMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} lg:hidden`}
      onClick={closeMenu}
    >
      <div
        className={`bg-white rounded-tl-3xl rounded-tr-3xl h-[70vh] absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out ${showOtherMenu ? "translate-y-0" : "translate-y-full"} flex items-center justify-center px-4`}
      >
        <ul className="flex flex-col items-center gap-6 w-1/2">
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
        <div
          className="absolute top-4 right-4 cursor-pointer w-11 h-11 rounded-full hover:bg-blackish-green/30 flex items-center justify-center"
          onClick={closeMenu}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};
