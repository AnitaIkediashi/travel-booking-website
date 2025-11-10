"use client";
import { useState } from "react";
import { SwapIcon } from "../icons/swap";
import { DatePicker, Select } from "antd";
import { FlightDropdown } from "./flight_dropdown";
import dayjs from "dayjs";
import { AddIcon } from "../icons/add";
import { Button } from "./button";
import { PaperPlaneIcon } from "../icons/paperPlane";

const { RangePicker } = DatePicker;

const dateFormat = "DD MMM YY ";

type InitialState = {
  fromValue: string;
  toValue: string;
  trip: string;
  entryDate: dayjs.Dayjs | null;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  adultCount: number;
  childrenCount: number;
  cabinClass: string;
};

export const SearchFlights = () => {
  const [swapInput, setSwapInput] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialState>({
    fromValue: "",
    toValue: "",
    trip: "",
    entryDate: null,
    startDate: null,
    endDate: null,
    adultCount: 0,
    childrenCount: 0,
    cabinClass: "",
  });
  const [showDropDown, setShowDropDown] = useState(false);

  const handleDropDownClick = () => {
    setShowDropDown(!showDropDown);
  };

  const handleSwap = () => {
    setSwapInput((prev) => !prev);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  const handleTripChange = (value: string) => {
    setInitialValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        trip: value,
      };

      if (value === "one-way") {
        updatedValues.startDate = null;
        updatedValues.endDate = null;
      } else if (value === "round-trip") {
        updatedValues.entryDate = null;
      }
      return updatedValues;
    });
  };

  const handleSingleDateChange = (date: dayjs.Dayjs | null) => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        entryDate: date,
      };
    });
  };

  const handleDateRangeChange = (
    dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  ) => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        startDate: dates ? dates[0] : null,
        endDate: dates ? dates[1] : null,
      };
    });
  };

  const handleAdultIncrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        adultCount: prevValues.adultCount + 1,
      };
    });
  };

  const handleAdultDecrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        adultCount: Math.max(prevValues.adultCount - 1, 0),
      };
    });
  };

  const handleChildrenIncrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        childrenCount: prevValues.childrenCount + 1,
      };
    });
  };

  const handleChildrenDecrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        childrenCount: Math.max(prevValues.childrenCount - 1, 0),
      };
    });
  };

  const handleCabinClassChange = (value: string) => {
    console.log("cabin type selected:", value);
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        cabinClass: value,
      };
    });
  };

  const inputClassName =
    "outline-none text-blackish-green-10 text-base w-full focus:border-2 focus:border-blue-500/10 focus:rounded-sm focus:border-b-blue-500 transition-all duration-100 ease-in-out";

  const inputA = (
    <input
      key={swapInput ? "to" : "from"}
      name={swapInput ? "toValue" : "fromValue"}
      type="text"
      size={12}
      value={swapInput ? initialValues.toValue : initialValues.fromValue}
      className={inputClassName}
      onChange={handleLocationChange}
    />
  );
  const inputB = (
    <input
      key={swapInput ? "from" : "to"}
      name={swapInput ? "fromValue" : "toValue"}
      type="text"
      size={12}
      value={swapInput ? initialValues.fromValue : initialValues.toValue}
      className={inputClassName}
      onChange={handleLocationChange}
    />
  );

  const tripOptions = [
    { value: "one-way", label: "One way" },
    { value: "round-trip", label: "Round trip" },
  ];

  const totalPassengers =
    initialValues.adultCount + initialValues.childrenCount;

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_120px_1fr_1fr] xl:grid-cols-[1fr_140px_1fr_1fr] gap-6 font-montserrat">
        <div>
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
            <legend className="text-blackish-green text-sm capitalize">
              from - to
            </legend>
            <div className="w-full flex items-center space-between relative h-full">
              <div className="w-[calc(100%-48px)] flex items-center">
                <div className="w-1/2 mr-1">{inputA}</div>-
                <div className="w-1/2 ml-1">{inputB}</div>
              </div>
              <div
                className="w-12 h-12 grid place-items-center cursor-pointer"
                onClick={handleSwap}
              >
                <SwapIcon />
              </div>
            </div>
          </fieldset>
        </div>
        <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 select_wrapper">
          <legend className="text-blackish-green text-sm capitalize">
            trip
          </legend>
          <Select
            options={tripOptions}
            allowClear
            className="w-full text-blackish-green-10"
            onChange={handleTripChange}
          />
        </fieldset>
        <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 date_wrapper">
          <legend className="text-blackish-green text-sm capitalize">
            {initialValues.trip === "one-way"
              ? "departure"
              : "departure - return"}
          </legend>
          {initialValues.trip === "one-way" ? (
            <DatePicker
              format={dateFormat}
              className="w-full text-blackish-green-10"
              onChange={handleSingleDateChange}
            />
          ) : (
            <RangePicker
              format={dateFormat}
              onChange={handleDateRangeChange}
              className="text-blackish-green-10"
            />
          )}
        </fieldset>
        <div className="relative">
          <fieldset
            className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 cursor-pointer"
            onClick={handleDropDownClick}
          >
            <legend className="text-blackish-green text-sm capitalize">
              passenger - class
            </legend>
            <p className="w-full h-full capitalize text-blackish-green-10">
              {totalPassengers > 0
                ? `${totalPassengers} passenger${
                    totalPassengers > 1 ? "s, " : ", "
                  }`
                : ""}
              {initialValues.cabinClass}
            </p>
          </fieldset>
          <FlightDropdown
            adultCount={initialValues.adultCount}
            childrenCount={initialValues.childrenCount}
            onAdultIncrement={handleAdultIncrement}
            onAdultDecrement={handleAdultDecrement}
            onChildrenIncrement={handleChildrenIncrement}
            onChildrenDecrement={handleChildrenDecrement}
            cabinType={initialValues.cabinClass}
            onCabinClassChange={handleCabinClassChange}
            showDropDown={showDropDown}
            onClose={handleDropDownClick}
          />
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
          label="show flights"
          className="capitalize text-blackish-green font-medium text-sm flex items-center gap-1 md:w-36 w-full bg-mint-green-100 rounded h-12 justify-center"
          icon={<PaperPlaneIcon />}
        />
      </div>
    </div>
  );
};
