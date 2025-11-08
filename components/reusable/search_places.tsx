"use client"; //for readability although there is no need writing it here since its parent is already a client component

import { useState } from "react";
import { AddIcon } from "../icons/add";
import { PaperPlaneIcon } from "../icons/paperPlane";
import { Button } from "./button";
import { FlightIcon } from "../icons/flight";
import { BedIcon } from "../icons/bed";
import { BuildingIcon } from "../icons/building";

export const SearchPlaces = () => {
  const [activeTab, setActiveTab] = useState("flights");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="lg:w-[80%] md:w-[86%] w-[96%] mx-auto rounded-2xl bg-white shadow-light relative -top-[105px] pl-8 pr-4 pt-4 pb-8 flex flex-col gap-8 font-montserrat">
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
        <div></div>
      </div>
      <div className="md:self-end flex md:flex-row flex-col md:items-center gap-6">
        <Button
          label="add promo code"
          className="uppercase text-blackish-green font-medium text-sm flex items-center gap-1 md:w-[161px] w-full h-12 justify-center"
          icon={<AddIcon />}
          type="button"
        />
        <Button
          label={activeTab === "flights" ? "show flights" : "show places"}
          className="capitalize text-blackish-green font-medium text-sm flex items-center gap-1 md:w-36 w-full bg-mint-green-100 rounded h-12 justify-center"
          icon={activeTab === "flights" ? <PaperPlaneIcon /> : <BuildingIcon />}
        />
      </div>
    </div>
  );
};
