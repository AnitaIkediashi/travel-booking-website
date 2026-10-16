"use client";

import dayjs from "dayjs";
import { TransitionStartFunction, useState } from "react";
import { DatePicker } from "antd";
import { BedIcon } from "@/components/icons/bed";
import { MagnifyingGlass } from "@/components/icons/magnifying_glass";
import { ArrowDownIcon } from "@/components/icons/arrow_down";
import { Button } from "@/components/reusable/button";
import { dateFormat } from "@/components/reusable/search_flights";
import { StaysDropdown } from "@/components/reusable/stays_dropdown";
import { inputClassName } from "@/utils/inputClassName";
import { useRouter } from "next/navigation";
import { DestinationProp } from "@/types/hotel_type";
import { useDebouncedCallback } from "@/utils/debounceCallback";
import { HotelSuggestions } from "@/components/dropdowns/hotel_suggestions";
import { ValidateHotelInputEntries } from "@/components/modals/validate_hotel_input_entries";
import { InitialState, disabledDate } from "@/components/reusable/search_stays";

type ListSearchHotelProps = {
  queryParams?: HotelQueryParams;
  startTransition: TransitionStartFunction;
};

type HotelQueryParams = {
  destination: string;
  destinationType: string | null;
  destinationValue: string | null;
  checkIn: dayjs.Dayjs | null;
  checkOut: dayjs.Dayjs | null;
  adults: number;
  children: number;
  rooms: number;
};

export const ListSearchHotels = ({
  queryParams,
  startTransition,
}: ListSearchHotelProps) => {
  const [initialValues, setInitialValues] = useState<InitialState>({
    destination: queryParams?.destination || "",
    checkInDate: queryParams?.checkIn || null,
    checkOutDate: queryParams?.checkOut || null,
    roomCount: queryParams?.rooms || 1,
    adultCount: queryParams?.adults || 1,
    childrenCount: queryParams?.children || 0,
  });

  const [selectedDestination, setSelectedDestination] =
    useState<DestinationProp | null>(
      queryParams?.destinationType && queryParams?.destinationValue
        ? ({
            type: queryParams.destinationType,
            value: queryParams.destinationValue,
            label: queryParams.destination,
          } as DestinationProp)
        : null,
    );

  const [showDropDown, setShowDropDown] = useState(false);
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [destinationList, setDestinationList] = useState<DestinationProp[]>([]);
  const [hotelValidate, setHotelValidate] = useState(false);

  const router = useRouter();

  const handleDestinationClick = (item: DestinationProp) => {
    setInitialValues((prev) => ({ ...prev, destination: item.label }));
    setSelectedDestination(item);
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
        const response = await fetch(
          `/api/hotels/destination?query=${encodeURIComponent(query)}`,
        );
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

  const handleDropDownClick = () => setShowDropDown(!showDropDown);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInitialValues((prev) => ({ ...prev, destination: value }));
    setSelectedDestination(null); 
    debounceDestinationChange(value);
  };

  const handleCheckinDateChange = (date: dayjs.Dayjs | null) => {
    setInitialValues((prev) => ({
      ...prev,
      checkInDate: date,
      checkOutDate:
        date && prev.checkOutDate && !prev.checkOutDate.isAfter(date, "day")
          ? null
          : prev.checkOutDate,
    }));
  };

  const handleCheckoutDateChange = (date: dayjs.Dayjs | null) => {
    setInitialValues((prev) => ({ ...prev, checkOutDate: date }));
  };

  const disabledCheckOut = (current: dayjs.Dayjs) => {
    const min = initialValues.checkInDate ?? dayjs();
    return current <= min.startOf("day");
  };

  const handleAdultIncrement = () =>
    setInitialValues((prev) => ({ ...prev, adultCount: prev.adultCount + 1 }));

  const handleAdultDecrement = () =>
    setInitialValues((prev) => ({
      ...prev,
      adultCount: Math.max(prev.adultCount - 1, 1),
    }));

  const handleChildrenIncrement = () =>
    setInitialValues((prev) => ({
      ...prev,
      childrenCount: prev.childrenCount + 1,
    }));

  const handleChildrenDecrement = () =>
    setInitialValues((prev) => ({
      ...prev,
      childrenCount: Math.max(prev.childrenCount - 1, 0),
    }));

  const handleRoomIncrement = () =>
    setInitialValues((prev) => ({ ...prev, roomCount: prev.roomCount + 1 }));

  const handleRoomDecrement = () =>
    setInitialValues((prev) => ({
      ...prev,
      roomCount: Math.max(prev.roomCount - 1, 1),
    }));

  const totalGuests = initialValues.adultCount + initialValues.childrenCount;

  function validateHotelEntries() {
    if (initialValues.destination.trim() === "") return false;
    if (!initialValues.checkInDate) return false;
    if (!initialValues.checkOutDate) return false;
    return true;
  }

  function handleShowHotels() {
    if (!validateHotelEntries()) {
      setHotelValidate(true);
      return;
    }

    setHotelValidate(false);
    setShowDropDown(false);

    const qs = new URLSearchParams({
      destination: initialValues.destination.trim(),
      checkIn: initialValues.checkInDate!.format("YYYY-MM-DD"),
      checkOut: initialValues.checkOutDate!.format("YYYY-MM-DD"),
      adults: String(initialValues.adultCount),
      children: String(initialValues.childrenCount),
      rooms: String(initialValues.roomCount),
    });

    if (selectedDestination) {
      qs.set("destinationType", selectedDestination.type);
      qs.set("destinationValue", selectedDestination.value);
    }

    startTransition(() => {
      router.push(`?${qs.toString()}`, { scroll: false });
    });
  }

  function closeModal() {
    setHotelValidate(false);
  }

  return (
    <>
      <div className="font-montserrat w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_1fr_56px] gap-6">
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
              value={initialValues.checkInDate}
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
              value={initialValues.checkOutDate}
              onChange={handleCheckoutDateChange}
              disabledDate={disabledCheckOut}
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
            <p className="w-full h-full capitalize text-blackish-green-10 flex items-center justify-between xl:text-sm">
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

        <Button
          icon={<MagnifyingGlass />}
          className="bg-mint-green-100 flex items-center justify-center rounded h-14"
          onClick={handleShowHotels}
        />
      </div>

      <ValidateHotelInputEntries
        hotelInputEntries={initialValues}
        onClose={closeModal}
        showModal={hotelValidate}
      />
    </>
  );
};
