'use client'

import { DatePicker } from "antd";
import { AddIcon } from "../icons/add";
import { BedIcon } from "../icons/bed";
import { BuildingIcon } from "../icons/building";
import { Button } from "./button";
import { dateFormat } from "./search_flights";
import { ArrowDownIcon } from "../icons/arrow_down";
import dayjs from "dayjs";
import { useState } from "react";

type InitialState = {
  destination: string;
  checkInDate: dayjs.Dayjs | null;
  checkOutDate: dayjs.Dayjs | null;
  roomCount: number;
  adultCount: number;
  childrenCount: number;
}

export const SearchStays = () => {
  const [initialValues, setInitialValues] = useState<InitialState>({
    destination: "",
    checkInDate: null,
    checkOutDate: null,
    roomCount: 1,
    adultCount: 1,
    childrenCount: 0,
  })

  const [showDropDown, setShowDropDown] = useState(false);

  const handleDropDownClick = () => {
    setShowDropDown(!showDropDown);
  };
  return (
    <div className="flex flex-col gap-8 font-montserrat">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[258px_minmax(0,240px)_minmax(0,240px)_minmax(0,255px)] xl:grid-cols-[350px_minmax(0,240px)_minmax(0,240px)_minmax(0,255px)] gap-6">
        <div>
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
            <legend className="text-blackish-green text-sm capitalize">
              enter destination
            </legend>
            <div className="w-full flex items-center space-between h-full">
              <div className="w-12 h-full absolute left-0 grid place-items-center cursor-pointer">
                <BedIcon fillColor="#112211" />
              </div>
              <div className="w-full ml-8">
                <input
                  type="text"
                  className="outline-none text-blackish-green-10 text-base w-full focus:border-2 focus:border-blue-500/10 focus:rounded-sm focus:border-b-blue-500 transition-all duration-100 ease-in-out"
                />
              </div>
            </div>
          </fieldset>
        </div>
        <div>
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 date_wrapper">
            <legend className="text-blackish-green text-sm capitalize">
              check in
            </legend>
            <DatePicker
              format={dateFormat}
              className="w-full text-blackish-green-10"
            />
          </fieldset>
        </div>
        <div>
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 date_wrapper">
            <legend className="text-blackish-green text-sm capitalize">
              check out
            </legend>
            <DatePicker
              format={dateFormat}
              className="w-full text-blackish-green-10"
            />
          </fieldset>
        </div>
        <div className="relative">
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 cursor-pointer" onClick={handleDropDownClick}>
            <legend className="text-blackish-green text-sm capitalize">
              rooms & guests
            </legend>
            <p className="w-full h-full capitalize text-blackish-green-10 flex items-center justify-between">
              <span className="mr-2">
                <ArrowDownIcon />
              </span>
            </p>
          </fieldset>
        </div>
      </div>
      <div className="md:self-end flex md:flex-row flex-col md:items-center gap-6">
        <Button
          label="add promo code"
          className="uppercase text-blackish-green font-medium text-sm flex items-center gap-1 md:w-[161px] w-full h-12 justify-center"
          icon={<AddIcon />}
          type="button"
        />
        <Button
          label="show places"
          className="capitalize text-blackish-green font-medium text-sm flex items-center gap-1 md:w-36 w-full bg-mint-green-100 rounded h-12 justify-center hover:bg-blackish-green/30 transition ease-in-out duration-300"
          icon={<BuildingIcon />}
        />
      </div>
    </div>
  );
};
