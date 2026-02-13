import { FlightSuggestions } from "@/components/dropdowns/flight_suggestions";
import { SwapIcon } from "@/components/icons/swap";
import { AirportProps } from "@/types/flight_type";
import { TransitionStartFunction, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, Select } from "antd";
import { useDebouncedCallback } from "@/utils/debounceCallback";
import { FlightDropdown } from "@/components/reusable/flight_dropdown";
import { ArrowDownIcon } from "@/components/icons/arrow_down";
import { ValidateFlightsInputEntriesModal } from "@/components/modals/validate_flights_input_entries_modal";
import { Button } from "@/components/reusable/button";
import { MagnifyingGlass } from "@/components/icons/magnifying_glass";
import { useRouter } from "next/navigation";
import { dateFormat, disabledDate, InitialState, inputClassName, RangePicker } from "@/components/reusable/search_flights";


type QueryParams = {
  queryParams?: QueryParamsProps;
  startTransition: TransitionStartFunction;
};

type QueryParamsProps = {
  from: string | null;
  to: string | null;
  trip: string | null;
  depart: dayjs.Dayjs | null;
  return: dayjs.Dayjs | null;
  adults: number | null;
  child: number | null;
  infant: number | null;
  cabin: string | null;
};

export const ListSearchFlights = ({ queryParams, startTransition }: QueryParams) => {
  const [initialValues, setInitialValues] = useState<InitialState>({
    fromValue: queryParams?.from || "",
    toValue: queryParams?.to || "",
    trip: queryParams?.trip || "",
    entryDate: queryParams?.trip === "one-way" ? queryParams.depart : null,
    startDate: queryParams?.depart || null,
    endDate: queryParams?.return !== undefined ? queryParams?.return : null,
    adultCount: queryParams?.adults || 1,
    child: queryParams?.child || 0,
    infant: queryParams?.infant || 0,
    cabinClass: queryParams?.cabin || "Economy",
  });
  const router = useRouter();

  const [swapInput, setSwapInput] = useState(false);

  const [activeField, setActiveField] = useState<
    "fromValue" | "toValue" | null
  >(null);

  const [showDropDown, setShowDropDown] = useState(false);

  const [showAirportsSuggestions, setShowAirportsSuggestions] = useState(false);

  const [airports, setAirports] = useState<AirportProps[]>([]); // store the airports suggestions

  const [showValidateModal, setShowValidateModal] = useState(false);


  const handleAirportsClick = (airport_code: string) => {
    if (!activeField) return;
    setInitialValues((prevValues) => ({
      ...prevValues,
      [activeField]: airport_code,
    }));
    // clean up
    setShowAirportsSuggestions(false);
    setAirports([]);
  };

  const debounceHandleLocationChange = useDebouncedCallback(
    async (query: string) => {
      if (query.trim() === "") {
        setAirports([]);
        setShowAirportsSuggestions(false);
        return;
      }
      try {
        const response = await fetch(`/api/flights/airports?query=${query}`);
        const data = await response.json();
        setAirports(data);
        setShowAirportsSuggestions(true);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        setShowAirportsSuggestions(false);
      }
    },
    300
  ); // hoisting

  const handleDropDownClick = () => {
    setShowDropDown(!showDropDown);
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

  const handleChildIncrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        child: prevValues.child + 1,
      };
    });
  };

  const handleChildDecrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        child: Math.max(prevValues.child - 1, 0),
      };
    });
  };

  const handleInfantIncrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        infant: prevValues.infant + 1,
      };
    });
  };

  const handleInfantDecrement = () => {
    setInitialValues((prevValues) => {
      return {
        ...prevValues,
        infant: Math.max(prevValues.infant - 1, 0),
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
  const handleSwap = () => {
    setSwapInput((prev) => !prev);
  };

  const tripOptions = [
    { value: "one-way", label: "One way" },
    { value: "round-trip", label: "Round trip" },
  ];

  const totalPassengers =
    initialValues.adultCount + initialValues.child + initialValues.infant;

  function validateEntries() {
    // check for from and to entries if empty
    if (
      initialValues.fromValue.trim() === "" ||
      initialValues.toValue.trim() === ""
    ) {
      return false; // stop here
    }

    if (initialValues.trip === "") {
      return false;
    }

    if (
      initialValues.trip === "" &&
      !initialValues.entryDate &&
      !initialValues.startDate
    ) {
      return false;
    }

    if (initialValues.trip === "one-way" && !initialValues.entryDate) {
      return false;
    }

    if (
      initialValues.trip === "round-trip" &&
      (!initialValues.startDate || !initialValues.endDate)
    ) {
      return false;
    }
    return true; // else continue
  }

  function handleCloseModal() {
    setShowValidateModal(false);
  }

  function handleShowFlights() {
    const isValid = validateEntries();
    if (isValid) {
      // proceed to show flights
      const params = new URLSearchParams();
      params.set("from", initialValues.fromValue);
      params.set("to", initialValues.toValue);
      params.set("trip", initialValues.trip);
      params.set("adults", initialValues.adultCount.toString());
      params.set("child", initialValues.child.toString());
      params.set("infant", initialValues.infant.toString());
      params.set("cabin", initialValues.cabinClass);
      const departDate =
        initialValues.trip === "one-way"
          ? initialValues.entryDate
          : initialValues.startDate;

      if (departDate) {
        params.set("depart", departDate.format("YYYY-MM-DD"));
      }
      if (initialValues.trip === "round-trip" && initialValues.endDate) {
        params.set("return", initialValues.endDate.format("YYYY-MM-DD"));
      }
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
      setShowValidateModal(false);
    } else {
      setShowValidateModal(true);
    }
  }

  return (
    <>
      <div className="font-montserrat w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1fr_120px_1fr_1fr_56px] gap-6">
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
              value={initialValues.trip || undefined}
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
                value={initialValues.entryDate}
                onChange={handleSingleDateChange}
                disabledDate={disabledDate}
              />
            ) : (
              <RangePicker
                format={dateFormat}
                value={[initialValues.startDate, initialValues.endDate]}
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
            <p className="w-full h-full capitalize text-blackish-green-10 flex items-center justify-between xl:text-sm">
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
            child={initialValues.child}
            infant={initialValues.infant}
            onAdultIncrement={handleAdultIncrement}
            onAdultDecrement={handleAdultDecrement}
            onChildIncrement={handleChildIncrement}
            onChildDecrement={handleChildDecrement}
            onInfantIncrement={handleInfantIncrement}
            onInfantDecrement={handleInfantDecrement}
            cabinType={initialValues.cabinClass}
            onCabinClassChange={handleCabinClassChange}
            showDropDown={showDropDown}
            onClose={handleDropDownClick}
          />
        </div>
        <Button
          icon={<MagnifyingGlass />}
          className="bg-mint-green-100 flex items-center justify-center rounded h-14"
          onClick={handleShowFlights}
        />
      </div>
      <ValidateFlightsInputEntriesModal
        flightInputEntries={initialValues}
        onClose={handleCloseModal}
        showValidateModal={showValidateModal}
      />
    </>
  );
};
