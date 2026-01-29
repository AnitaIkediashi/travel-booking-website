"use client";

import { FlightDataProps, FlightOffer } from "@/types/flight_type";
import { PriceFilter } from "./price_filter";
import { useMemo, useState, useTransition } from "react";
import { SkeletonSection } from "@/components/reusable/skeleton_section";
import Image from "next/image";
import { TimeFilter } from "./time_filter";
import { AirlinesFilter } from "./airlines_filter";
import { TripFilter } from "./trip_filter";
import { FlightDisplayData } from "./flight_display_data";

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
  const [sortBy, setSortBy] = useState("best");
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]); // track which airlines are selected
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]); // same with trips selected
  const [isPendingFilter, startTransition] = useTransition();

  /**
   *  The use of useMemo hook to memoize or cache data and avoid unnecessary recalculations
   * It optimizes performance by recalculating filteredSortedData only when its dependencies change.
   */

  const filteredSortedData = useMemo(() => {
    if (!data) return [];

    // 1. First, Filter the data
    const results = data.filter((flight) => {
      const offers = flight.flight_offers ?? [];

      // Price Filter Check
      const matchesPrice = priceRange
        ? offers.some(
            (o) =>
              (o.price_breakdown?.total?.amount ?? 0) >= priceRange[0] &&
              (o.price_breakdown?.total?.amount ?? 0) <= priceRange[1],
          )
        : true;

      // Time Filter Check
      const matchesTime = timeRange
        ? offers.some(
            (o) =>
              (o.segments?.[0]?.total_time ?? 0) >= timeRange[0] &&
              (o.segments?.[0]?.total_time ?? 0) <= timeRange[1],
          ) // picking the first segment's time for filtering
        : true;

      // airlines Filter Check
      const matchesAirlines =
        selectedAirlines.length > 0
          ? data[0].airlines?.some((s) =>
              selectedAirlines.includes(s.iata_code ?? ""),
            )
          : true;
      // console.log("matchesAirlines", matchesAirlines);

      // trip filter check
      const matchesTrips =
        selectedTrips.length > 0
          ? offers.some((o) =>
              selectedTrips.includes((o.trip_type as TripKey) ?? ""),
            )
          : true;

      // console.log("matchesTrips", matchesTrips);

      return matchesPrice && matchesTime && matchesAirlines && matchesTrips;
    });

    // 2. Then, Sort the filtered results
    return results.sort((a, b) => {
      // Helper to get the minimum price/time from a flight's offers
      const getMinPrice = (f: FlightDataProps) =>
        Math.min(
          ...(f.flight_offers?.map(
            (o) => o.price_breakdown?.total?.amount ?? Infinity,
          ) ?? [Infinity]),
        );

      const getMinTime = (f: FlightDataProps) =>
        Math.min(
          ...(f.flight_offers?.map(
            (o) => o.segments?.[0]?.total_time ?? Infinity,
          ) ?? [Infinity]),
        );

      if (sortBy === "cheapest") {
        return getMinPrice(a) - getMinPrice(b);
      }

      if (sortBy === "quickest") {
        return getMinTime(a) - getMinTime(b);
      }

      if (sortBy === "best") {
        // Logic: Min(Price + Duration) for each flight
        const getBestScore = (f: FlightDataProps) =>
          Math.min(
            ...(f.flight_offers?.map(
              (o) =>
                (o.price_breakdown?.total?.amount ?? 0) +
                (o.segments?.[0]?.total_time ?? 0),
            ) ?? [Infinity]),
          );

        return getBestScore(a) - getBestScore(b);
      }

      return 0;
    });
  }, [priceRange, timeRange, sortBy, selectedAirlines, selectedTrips, data]);

  const handleOpenPriceFilter = () => {
    setOpenPriceFilter(!openPriceFilter);
  };

  const handleOpenTimeFilter = () => {
    setOpenTimeFilter(!openTimeFilter);
  };

  const handleOpenAirlinesFilter = () => {
    setOpenAirlinesFilter(!openAirlinesFilter);
  };

  const handleOpenTripFilter = () => {
    setOpenTripFilter(!openTripFilter);
  };

  // 1. Loading state
  if (isPending) {
    return <SkeletonSection />;
  }
  // 2. check for any empty data
  if (data?.length === 0 || !data) {
    return (
      <div className="w-full flex items-center justify-center flex-col gap-3">
        <Image
          src="/illustrations/no-data-illustration.svg"
          alt="no data"
          width={400}
          height={400}
        />
        <p className="font-medium text-blackish-green">
          No flight records, ensure to search the appropriate flights
        </p>
      </div>
    );
  }
  // 3. when data exists
  // Step A: Map and filter out undefined/null in one go

  const allOffers = data[0].flight_offers ?? [];

  // sort by cheapest price
  const cheapestOffer = [...allOffers].sort((a, b) => {
    const priceA = a.price_breakdown?.total?.amount;
    const priceB = b.price_breakdown?.total?.amount;
    if (priceA === undefined && priceB === undefined) return 0;
    if (priceA === undefined) return 1;
    if (priceB === undefined) return -1;
    return priceA - priceB;
  })[0];

  const getTotalFlightTime = (offer: FlightOffer) => {
    return (
      offer.segments?.reduce((sum, s) => sum + (s.total_time ?? 0), 0) ??
      Infinity
    );
  };

  // sort by best - combination of price and duration
  const bestOffer = [...allOffers].sort((a, b) => {
    const scoreA =
      (a.price_breakdown?.total?.amount ?? 0) +
      getTotalFlightTime(a);
    const scoreB =
      (b.price_breakdown?.total?.amount ?? 0) +
      getTotalFlightTime(b);
    
    return scoreA - scoreB;
  })[0];

  // sort by quickest - total min time for both outbound and inbound
  const quickestOffer = [...allOffers].sort((a, b) => {
    const durA = getTotalFlightTime(a);
    const durB = getTotalFlightTime(b);

    if (durA === durB) {
      // If duration is the same, pick the cheaper one as the "winner"
      return (
        (a.price_breakdown?.total?.amount ?? 0) -
        (b.price_breakdown?.total?.amount ?? 0)
      );
    }
    return durA - durB;
  })[0];

  const prices =
    allOffers
      ?.map((offer) => offer.price_breakdown?.total?.amount)
      .filter((p): p is number => typeof p === "number") ?? []; // is keyword - is used to create user-defined type guards, which help the compiler narrow down the type of a variable within a specific scope. It is a **type predicate** and has the form **parameterName is Type**

  const minDuration = data[0].duration_min ?? 0;
  const maxDuration = data[0].duration_max ?? 1440;

  const airlines = data[0].airlines?.map((airline) => {
    const name = airline?.name;
    const code = airline?.iata_code;
    return { name, code };
  });

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
      label: tripLabels[trip],
    };
    return newData;
  });

  // Step B: Ensure we don't pass an empty array to Math.min (which returns Infinity)
  const hasPrices = prices.length > 0;
  const minPrice = hasPrices ? Math.min(...prices) : 0; // works with an array - using spread operator to get the rest of the items
  const maxPrice = hasPrices ? Math.max(...prices) : 0;

  const handlePriceChange = (value: number | number[]) => {
    // Since 'range' is true in the Slider, value will be number[]
    if (Array.isArray(value)) {
      startTransition(() => {
        setPriceRange([value[0], value[1]]);
      });
    }
  };

  const handleTimeChange = (value: number | number[]) => {
    // Since 'range' is true in the Slider, value will be number[]
    if (Array.isArray(value)) {
      startTransition(() => {
        setTimeRange([value[0], value[1]]);
      });
    }
  };

  const handleAirlineChange = (codes: string[]) => {
    startTransition(() => {
      setSelectedAirlines(codes);
    });
  };

  const handleTripChange = (types: string[]) => {
    startTransition(() => {
      setSelectedTrips(types);
    });
  };

  return (
    <section className="w-full grid lg:grid-cols-[343px_1fr] grid-cols-1 lg:gap-[15.5px] relative font-montserrat">
      <aside className="w-full lg:pr-6 lg:border-r lg:border-r-blackish-green hidden lg:block">
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
          onChange={handleAirlineChange}
        />
        <TripFilter
          trips={assignLabelsToTripTypes}
          openFilter={openTripFilter}
          onClose={handleOpenTripFilter}
          onChange={handleTripChange}
        />
      </aside>
      <FlightDisplayData
        sortBy={sortBy}
        setSortBy={setSortBy}
        cheapest={cheapestOffer.price_breakdown?.total?.amount}
        best={bestOffer.price_breakdown?.total?.amount}
        quickest={quickestOffer.price_breakdown?.total?.amount}
        filteredSortedData={filteredSortedData}
        isPendingFilter={isPendingFilter}
      />
    </section>
  );
};
