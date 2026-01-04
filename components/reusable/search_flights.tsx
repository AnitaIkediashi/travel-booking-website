"use client";
import { useState, useTransition } from "react";
import { SwapIcon } from "../icons/swap";
import { DatePicker, Select } from "antd";
import { FlightDropdown } from "./flight_dropdown";
import dayjs from "dayjs";
import { AddIcon } from "../icons/add";
import { Button } from "./button";
import { PaperPlaneIcon } from "../icons/paperPlane";
import { ArrowDownIcon } from "../icons/arrow_down";
import { useDebouncedCallback } from "@/utils/debounceCallback";
import { AirportProps } from "@/types/flight_type";
import { FlightSuggestions } from "../dropdowns/flight_suggestions";
import { ValidateFlightsInputEntriesModal } from "../modals/validate_flights_input_entries_modal";
import { useRouter } from "next/navigation";

/**
 * NOTES: 1. Day.js is a minimalist JavaScript library designed to make parsing, validating, manipulating, and displaying dates and times in web applications much easier and more efficient than using the built-in JavaScript Date object
 *  2. React reconciliation is the process by which React efficiently updates the user interface (UI) in response to changes in a component's state or props. It is the core mechanism that allows React to provide a declarative programming model while maintaining high performance.
 * 3. In React, when the state or props of a component change, React needs to determine how to update the actual DOM to reflect these changes. Instead of directly manipulating the DOM, React uses a virtual representation of the DOM called the Virtual DOM. The reconciliation process involves comparing the new Virtual DOM with the previous version to identify what has changed. This comparison is done using a diffing algorithm that efficiently determines the minimal set of changes needed to update the real DOM.
 */

const { RangePicker } = DatePicker;

export const dateFormat = "DD MMM YY "; // From antd documentation

const disabledDate = (current: dayjs.Dayjs) => {
  // Can not select days before today
  return current < dayjs().startOf("day");
}

export type InitialState = {
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
    adultCount: 1,
    childrenCount: 0,
    cabinClass: "Economy",
  });

  const [activeField, setActiveField] = useState<
    "fromValue" | "toValue" | null
  >(null);

  const [showDropDown, setShowDropDown] = useState(false);

  const [showAirportsSuggestions, setShowAirportsSuggestions] = useState(false);

  const [airports, setAirports] = useState<AirportProps[]>([]); // store the airports suggestions

  const [showValidateModal, setShowValidateModal] = useState(false);

  const [isPending, startTransition] = useTransition(); // useTransition hook is used to render part of the UI in the background

  const router = useRouter();


  const handleAirportsClick = (airport_code: string) => {
    if (!activeField) return;
    setInitialValues((prevValues) => ({
      ...prevValues,
      [activeField]: airport_code,
    }));
    // clean up
    setShowAirportsSuggestions(false);
    setAirports([]);
  }

  const debounceHandleLocationChange = useDebouncedCallback(
    async (query: string) => {
      if (query.trim() === "") {
        setAirports([]);
        setShowAirportsSuggestions(false)
        return
      }
      try {
        const response = await fetch(`/api/flights/airports?query=${query}`);
        const data = await response.json();
        setAirports(data);
        setShowAirportsSuggestions(true)
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setShowAirportsSuggestions(false)
      }
    },
    300
  ); // hoisting

  const handleDropDownClick = () => {
    setShowDropDown(!showDropDown);
  };

  const handleSwap = () => {
    setSwapInput((prev) => !prev);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Set the active field so we know where the suggestion goes later
    setActiveField(name as "fromValue" | "toValue"); // this means to only pick inputs name attributes that are either fromValue or toValue - Type Assertion

    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
    debounceHandleLocationChange(value);
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
      key={swapInput ? "to" : "from"} // A unique key to force re-render when swapped because of react's reconciliation
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
      key={swapInput ? "from" : "to"} // A unique key to force re-render when swapped because of react's reconciliation
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

  function validateEntries() {
    // check for from and to entries if empty
    if(initialValues.fromValue.trim() === "" || initialValues.toValue.trim() === "") {
      return false;
    }

    if(initialValues.trip === "") {
      return false;
    }

    if(initialValues.trip === "" && !initialValues.entryDate && !initialValues.startDate) {
      return false;
    }

    if(initialValues.trip === "one-way" && !initialValues.entryDate) {
      return false;
    }

    if(initialValues.trip === "round-trip" && (!initialValues.startDate || !initialValues.endDate)) {
      return false;
    }
    return true;
  }

  function handleShowFlights() {
    const isValid = validateEntries();
    if (isValid) {
      // proceed to show flights
      setShowValidateModal(false);
      startTransition(() => {
        if(initialValues.trip === "one-way") {
          router.push(`/flight-flow/flight-listing?from=${initialValues.fromValue}&to=${initialValues.toValue}&trip=${initialValues.trip}&depart=${initialValues.entryDate?.format('YYYY-MM-DD')}&adults=${initialValues.adultCount}&children=${initialValues.childrenCount}&cabin=${initialValues.cabinClass}`);
        } else {
          router.push(`/flight-flow/flight-listing?from=${initialValues.fromValue}&to=${initialValues.toValue}&trip=${initialValues.trip}&depart=${initialValues.startDate?.format('YYYY-MM-DD')}&return=${initialValues.endDate?.format('YYYY-MM-DD')}&adults=${initialValues.adultCount}&children=${initialValues.childrenCount}&cabin=${initialValues.cabinClass}`);
        }
      });
    } else {
      setShowValidateModal(true);
    }
  }

  function handleCloseModal() {
    setShowValidateModal(false);
  }

  return (
    <>
      <div className="flex flex-col gap-8 font-montserrat">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_120px_1fr_1fr] xl:grid-cols-[1fr_140px_1fr_1fr] gap-6">
          <div className="relative">
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
                  className="w-12 h-full grid place-items-center cursor-pointer"
                  onClick={handleSwap}
                >
                  <SwapIcon />
                </div>
              </div>
            </fieldset>
            {showAirportsSuggestions && (
              <FlightSuggestions
                airports={airports}
                onAirportSelect={handleAirportsClick}
              />
            )}
          </div>
          <div>
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
          </div>
          <div>
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
                  disabledDate={disabledDate}
                />
              ) : (
                <RangePicker
                  format={dateFormat}
                  onChange={handleDateRangeChange}
                  className="text-blackish-green-10"
                  disabledDate={disabledDate}
                />
              )}
            </fieldset>
          </div>
          <div className="relative">
            <fieldset
              className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 cursor-pointer"
              onClick={handleDropDownClick}
            >
              <legend className="text-blackish-green text-sm capitalize">
                passenger - class
              </legend>
              <p className="w-full h-full capitalize text-blackish-green-10 flex items-center justify-between">
                {totalPassengers > 0
                  ? `${totalPassengers} passenger${
                      totalPassengers > 1 ? "s, " : ", "
                    }`
                  : ""}
                {initialValues.cabinClass}
                <span className="mr-2">
                  <ArrowDownIcon />
                </span>
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
            label={`${isPending ? "Searching..." : "show flights"}`}
            className="capitalize text-blackish-green font-medium text-sm flex items-center gap-1 md:w-36 w-full bg-mint-green-100 rounded h-12 justify-center hover:bg-blackish-green/30 transition ease-in-out duration-300"
            icon={<PaperPlaneIcon />}
            onClick={handleShowFlights}
          />
        </div>
      </div>
      <ValidateFlightsInputEntriesModal
        flightInputEntries={initialValues}
        onClose={handleCloseModal}
        showValidateModal={showValidateModal}
      />
    </>
  );
};
