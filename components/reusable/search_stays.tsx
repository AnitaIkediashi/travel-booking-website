"use client";

import { DatePicker } from "antd";
import { AddIcon } from "../icons/add";
import { BedIcon } from "../icons/bed";
import { BuildingIcon } from "../icons/building";
import { Button } from "./button";
import { dateFormat } from "./search_flights";
import { ArrowDownIcon } from "../icons/arrow_down";
import dayjs from "dayjs";
import { useState, useTransition } from "react";
import { StaysDropdown } from "./stays_dropdown";
import { inputClassName } from "@/utils/inputClassName";
import { useRouter } from "next/navigation";
import { DestinationProp } from "@/types/hotel_type";
import { useDebouncedCallback } from "@/utils/debounceCallback";
import { HotelSuggestions } from "../dropdowns/hotel_suggestions";
import { ValidateHotelInputEntries } from "../modals/validate_hotel_input_entries";

export type InitialState = {
  destination: string;
  checkInDate: dayjs.Dayjs | null;
  checkOutDate: dayjs.Dayjs | null;
  roomCount: number;
  adultCount: number;
  childrenCount: number;
};

export const disabledDate = (current: dayjs.Dayjs) => {
  return current < dayjs().startOf("day");
};

export const SearchStays = () => {
  const [initialValues, setInitialValues] = useState<InitialState>({
    destination: "",
    checkInDate: null,
    checkOutDate: null,
    roomCount: 1,
    adultCount: 1,
    childrenCount: 0,
  });

  const [showDropDown, setShowDropDown] = useState(false);

  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);

  const [destinationList, setDestinationList] = useState<DestinationProp[]>([]);

  const [hotelValidate, setHotelValidate] = useState(false);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleDestinationClick = (destination: string) => {
    
    setInitialValues((prevValues) => ({
      ...prevValues,
      destination,
    }));

    setShowHotelSuggestions(false);
    setDestinationList([]);
  };

  const debounceDestinationChange = useDebouncedCallback(
    async (query: string) => {
      if (query.trim() === "") {
        setDestinationList([]);
        setShowHotelSuggestions(false);
        return;
      }
      try {
        const response = await fetch(`/api/hotels/destination?query=${query}`);
        const data = await response.json();
        setDestinationList(data);
        setShowHotelSuggestions(true);
      } catch (error) {
        console.error("Error fetching hotel suggestions:", error);
        setShowHotelSuggestions(false);
      }
    },
    300,
  );

  const handleDropDownClick = () => {
    setShowDropDown(!showDropDown);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        destination: value,
      };
    });
    debounceDestinationChange(value);
  };

  const handleCheckinDateChange = (date: dayjs.Dayjs | null) => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        checkInDate: date,
      };
    });
  };

  const handleCheckoutDateChange = (date: dayjs.Dayjs | null) => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        checkOutDate: date,
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
        adultCount: Math.max(prevValues.adultCount - 1, 1),
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

  const handleRoomIncrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        roomCount: prevValues.roomCount + 1,
      };
    });
  };

  const handleRoomDecrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        roomCount: Math.max(prevValues.roomCount - 1, 1),
      };
    });
  };

  const totalGuests = initialValues.adultCount + initialValues.childrenCount;

  function validateHotelEntries() {
    // check for from and to entries if empty
    if (
      initialValues.destination.trim() === "" 
    ) {
      return false;
    }

    if (
      !initialValues.checkInDate
    ) {
      return false;
    }

    if (!initialValues.checkOutDate) {
      return false;
    }

    if (
      initialValues.roomCount === 0
    ) {
      return false;
    }
    return true;
  }

  function handleShowHotels() {
    const isValid = validateHotelEntries();
    if(isValid) {
      setHotelValidate(false);
      startTransition(() => {
        router.push(
          `/hotel-flow/hotel-search/listing?destination=${initialValues.destination}&checkIn=${initialValues.checkInDate?.format("YYYY-MM-DD")}&checkOut=${initialValues.checkOutDate?.format("YYYY-MM-DD")}adults=${initialValues.adultCount}&children=${initialValues.childrenCount}`,
        );
      })
    } else {
      setHotelValidate(true)
    }
  }

  function closeModal() {
    setHotelValidate(false)
  }

  return (
    <>
      <div className="flex flex-col gap-8 font-montserrat">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[258px_minmax(0,240px)_minmax(0,240px)_minmax(0,240px)] xl:grid-cols-[300px_minmax(0,240px)_minmax(0,240px)_minmax(0,240px)] gap-6">
          <div className="relative">
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
                    className={inputClassName}
                    value={initialValues.destination}
                    onChange={handleDestinationChange}
                  />
                </div>
              </div>
            </fieldset>
            {showHotelSuggestions && (
              <HotelSuggestions
                destinationList={destinationList}
                onSelect={handleDestinationClick}
              />
            )}
          </div>
          <div>
            <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 date_wrapper">
              <legend className="text-blackish-green text-sm capitalize">
                check in
              </legend>
              <DatePicker
                format={dateFormat}
                className="w-full text-blackish-green-10"
                onChange={handleCheckinDateChange}
                disabledDate={disabledDate}
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
                onChange={handleCheckoutDateChange}
                disabledDate={disabledDate}
              />
            </fieldset>
          </div>
          <div className="relative">
            <fieldset
              className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 cursor-pointer"
              onClick={handleDropDownClick}
            >
              <legend className="text-blackish-green text-sm capitalize">
                rooms & guests
              </legend>
              <p className="w-full h-full capitalize text-blackish-green-10 flex items-center justify-between">
                {initialValues.roomCount > 0
                  ? `${initialValues.roomCount} room${
                      initialValues.roomCount > 1 ? "s, " : ", "
                    }`
                  : ""}
                {totalGuests > 0
                  ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
                  : ""}
                <span className="mr-2">
                  <ArrowDownIcon />
                </span>
              </p>
            </fieldset>
            <StaysDropdown
              showDropDown={showDropDown}
              onClose={handleDropDownClick}
              adultCount={initialValues.adultCount}
              childrenCount={initialValues.childrenCount}
              roomCount={initialValues.roomCount}
              onAdultIncrement={handleAdultIncrement}
              onAdultDecrement={handleAdultDecrement}
              onChildrenIncrement={handleChildrenIncrement}
              onChildrenDecrement={handleChildrenDecrement}
              onRoomIncrement={handleRoomIncrement}
              onRoomDecrement={handleRoomDecrement}
              searchHotels={handleShowHotels}
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
            label={`${isPending ? "Searching..." : "show places"}`}
            className="capitalize text-blackish-green font-medium text-sm flex items-center gap-1 md:w-36 w-full bg-mint-green-100 rounded h-12 justify-center hover:bg-blackish-green/30 transition ease-in-out duration-300"
            icon={<BuildingIcon />}
            onClick={handleShowHotels}
          />
        </div>
      </div>
      <ValidateHotelInputEntries
        hotelInputEntries={initialValues}
        onClose={closeModal}
        showModal={hotelValidate} 
      />
    </>
  );
};
