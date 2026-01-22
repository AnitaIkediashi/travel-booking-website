'use client'

import { FlightDataProps } from "@/types/flight_type";
import { PriceFilter } from "./price_filter";
import { useState } from "react";
import { SkeletonSection } from "@/components/reusable/skeleton_section";
import Image from "next/image";
import { TimeFilter } from "./time_filter";
import { AirlinesFilter } from "./airlines_filter";
import { TripFilter } from "./trip_filter";

type FlightFilterProps = {
  isPending: boolean;
  data: FlightDataProps[] | undefined;
};

const tripLabels = {
  "one-way": "One Way",
  "round-trip": "Round Trip",
};

type TripKey = keyof typeof tripLabels;

export const FlightDataFilters = ({ isPending, data }: FlightFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number] | null>(null);
  const [openPriceFilter, setOpenPriceFilter] = useState(false);
  const [openTimeFilter, setOpenTimeFilter] = useState(false);
  const [openAirlinesFilter, setOpenAirlinesFilter] = useState(false);
  const [openTripFilter, setOpenTripFilter] = useState(false);

  const handleOpenPriceFilter = () => {
    setOpenPriceFilter(!openPriceFilter);
  }

  const handleOpenTimeFilter = () => {
    setOpenTimeFilter(!openTimeFilter);
  }

  const handleOpenAirlinesFilter = () => {
    setOpenAirlinesFilter(!openAirlinesFilter);
  }

  const handleOpenTripFilter = () => {
    setOpenTripFilter(!openTripFilter);
  }

  // 1. Loading state
  if (isPending) {
    return <SkeletonSection />;
  }
  // 2. check for any empty data
  if (data?.length === 0 || !data) {
    return (
      <div className="w-full flex items-center justify-center flex-col gap-3">
        <Image src="/illustrations/no-data-illustration.svg" alt="no data" width={400} height={400} />
        <p className="font-medium text-blackish-green">No flight records, ensure to search the appropriate flights</p>
      </div>
    );
  }
  // 3. when data exists
  // Step A: Map and filter out undefined/null in one go
  const prices =
    data[0].flight_offers
      ?.map((offer) => offer.price_breakdown?.total?.amount)
      .filter((p): p is number => typeof p === "number") ?? []; // is keyword - is used to create user-defined type guards, which help the compiler narrow down the type of a variable within a specific scope. It is a **type predicate** and has the form **parameterName is Type**

  const minDuration = data[0].duration_min ?? 0
  const maxDuration = data[0].duration_max ?? 1440

  const airlines = data[0].airlines?.map((airline) => {
    const name = airline?.name
    const code = airline?.iata_code
    return { name, code }
  })

  const tripFilter =
    data[0].flight_offers
      ?.map((offer) => offer.trip_type)
      .filter(
        (trip): trip is TripKey => trip !== undefined && trip in tripLabels,
      ) ?? [];

  const uniqueTripTypesWithLabels = Array.from(new Set(tripFilter));

  const assignLabelsToTripTypes = uniqueTripTypesWithLabels.map((trip) => {
    const newData = {
      value: trip,
      label: tripLabels[trip]
    }
    return newData
  })

  // Step B: Ensure we don't pass an empty array to Math.min (which returns Infinity)
  const hasPrices = prices.length > 0;
  const minPrice = hasPrices ? Math.min(...prices) : 0; // works with an array - using spread operator to get the rest of the items
  const maxPrice = hasPrices ? Math.max(...prices) : 0;

  const handlePriceChange = (value: number | number[]) => {
    // Since 'range' is true in the Slider, value will be number[]
    if (Array.isArray(value)) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const handleTimeChange = (value: number | number[]) => {
    // Since 'range' is true in the Slider, value will be number[]
    if (Array.isArray(value)) {
      setTimeRange([value[0], value[1]]);
    }
  };

  return (
    <section className="w-full grid lg:grid-cols-[343px_1fr] grid-cols-1 relative font-montserrat">
      <div className="w-full lg:pr-6 lg:border-r lg:border-r-blackish-green lg:mr-[15.5px] hidden lg:block">
        <h3 className="pb-8 text-blackish-green font-semibold text-xl capitalize">
          filters
        </h3>
        <PriceFilter
          min={minPrice}
          max={maxPrice}
          onChange={handlePriceChange}
          priceRange={priceRange}
          openFilter={openPriceFilter}
          onClose={handleOpenPriceFilter}
        />
        <TimeFilter
          min={minDuration}
          max={maxDuration}
          onChange={handleTimeChange}
          timeRange={timeRange}
          openFilter={openTimeFilter}
          onClose={handleOpenTimeFilter}
        />
        <AirlinesFilter
          airlines={airlines}
          openFilter={openAirlinesFilter}
          onClose={handleOpenAirlinesFilter}
        />
        <TripFilter
          trips={assignLabelsToTripTypes}
          openFilter={openTripFilter}
          onClose={handleOpenTripFilter}
        />
      </div>
      <div></div>
    </section>
  );
};;
