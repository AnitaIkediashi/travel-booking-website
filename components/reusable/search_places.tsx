"use client"; //for readability although there is no need writing it here since its parent is already a client component

import { useState } from "react";
import { FlightIcon } from "../icons/flight";
import { BedIcon } from "../icons/bed";
import { SearchFlights } from "./search_flights";
import { SearchStays } from "./search_stays";

export const SearchPlaces = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="lg:w-[80%] md:w-[86%] w-[96%] mx-auto rounded-2xl bg-white shadow-light relative -top-[105px] pl-8 pr-4 pt-4 pb-8 font-montserrat">
      <div className="w-full">
        <div className="flex items-center h-12">
          <div
            className={`flex items-center gap-2 h-full pr-8 border-r border-r-mint-green-70 cursor-pointer relative ${
              activeTab === "flights"
                ? "before:absolute before:content-[''] before:w-[100px] before:h-1 before:z-10 before:bg-mint-green-100 before:-bottom-3"
                : ""
            }`}
            onClick={() => handleTabClick("flights")}
          >
            <FlightIcon fillColor="#112211" />
            <span className="capitalize text-sm font-semibold">flights</span>
          </div>

          <div
            className={`flex items-center gap-2 pl-8 h-full cursor-pointer relative ${
              activeTab === "stays"
                ? "before:absolute before:content-[''] before:w-[100px] before:h-1 before:z-10 before:bg-mint-green-100 before:-bottom-3 before:left-2.5"
                : ""
            }`}
            onClick={() => handleTabClick("stays")}
          >
            <BedIcon fillColor="#112211" />
            <span className="capitalize text-sm font-semibold">stays</span>
          </div>
        </div>
        <div className="w-full mt-12">
            {
                activeTab === "flights" ? (
                    <SearchFlights />
                ) : (
                    <SearchStays />
                )
            }
        </div>
      </div>
    </div>
  );
};
