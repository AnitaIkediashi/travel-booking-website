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
import { Button } from "@/components/reusable/button";
import { FilterIcon } from "@/components/icons/filter";
import { Filters } from "./filters";

type FlightFilterProps = {
  isPending: boolean;
  data: FlightDataProps[] | undefined;
  adultCount: number;
  childCount: number;
  infantCount: number;
};

const tripLabels = {
  "one-way": "One Way",
  "round-trip": "Round Trip",
};

/**
 * The keyof operator takes an object type and produces a string or numeric literal union of its keys
 * typeof refers to the type of the value has
 */
type TripKey = keyof typeof tripLabels; 

export const FlightDataFilters = ({
  isPending,
  data,
  adultCount,
  infantCount,
  childCount,
}: FlightFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [timeRange, setTimeRange] = useState<[number, number] | null>(null);
  const [openPriceFilter, setOpenPriceFilter] = useState(false);
  const [openTimeFilter, setOpenTimeFilter] = useState(false);
  const [openAirlinesFilter, setOpenAirlinesFilter] = useState(false);
  const [openTripFilter, setOpenTripFilter] = useState(false);
  const [sortBy, setSortBy] = useState("best");

  /**
   *  Implemented Lazy Initializer pattern for selectedAirlines and selectedTrips state variables.
   * This approach ensures that the initial state is computed only once during the component's first render,
   * improving performance by avoiding unnecessary recalculations on subsequent renders.
   * Note: the Boolean type assertion is used to filter out any undefined values from the mapped array.
   */
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(() => {
    return (
      (data?.[0]?.airlines
        ?.map((a) => a.iata_code)
        .filter(Boolean) as string[]) || []
    );
  }); // track which airlines are selected as an array

  const [selectedTrips, setSelectedTrips] = useState<string[]>(() => {
    if (!data || data.length === 0) return [];
    return Array.from(
      new Set(data[0].flight_offers?.map((o) => o.trip_type).filter(Boolean)),
    ) as string[];
  }); // same with trips selected

  const [showFilters, setShowFilters] = useState(false); // on small screens

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const [isPendingFilter, startTransition] = useTransition();

  /**
   *  The use of useMemo hook to memoize or cache data and avoid unnecessary recalculations
   * It optimizes performance by recalculating filteredSortedData, allOffers, airlines, tripFilter only when its dependencies change.
   * its particularly useful when dealing with large datasets or complex filtering and sorting logic.
   * 
   * flatMap method - It transforms each element into a new collection
   * and then merges all those collections into one single, continuous structure
   * - its like using map method and then flatten the array by one level
   */

  const allOffers = useMemo(
    () => data?.flatMap((flight) => flight.flight_offers ?? []) ?? [],
    [data],
  );

  const airlines = useMemo(() => {
    const unique = new Map(); // A Map is a collection of key-value pairs
    data?.forEach((flight) => {
      flight.airlines?.forEach((a) => {
        if (a.iata_code) unique.set(a.iata_code, a.name); // add or update
      });
    });

    return Array.from(unique.entries()).map(([code, name]) => ({ name, code }));
  }, [data]);

  const tripFilter = useMemo(() => {
    const types = Array.from(new Set(allOffers.map((o) => o.trip_type)));
    
    return types.map((type) => ({
      value: type,
      label: tripLabels[type as TripKey] || type,
    }));
  }, [allOffers]);

  const filteredSortedData = useMemo(() => {
    if (!data) return [];

    return (
      data
        .map((flight) => {
          // Filter the offers WITHIN this flight
          const validOffers = (flight.flight_offers ?? []).filter((offer) => {
            // A. Price Range check
            const price = offer.price_breakdown?.total?.amount ?? 0;
            if (priceRange && (price < priceRange[0] || price > priceRange[1]))
              return false;

            // B. Trip Type check
            if (
              selectedTrips.length > 0 &&
              !selectedTrips.includes(offer.trip_type ?? "")
            )
              return false;

            // C. Airline check
            // We check if the airline in this offer is one of the selected ones
            const offerAirlines =
              offer.segments
                ?.flatMap(
                  (s) =>
                    s.legs?.flatMap(
                      (l) => l.carriers?.map((c) => c.code) ?? [],
                    ) ?? [],
                )
                // This filter cleans out 'undefined' and tells TS they are now definitely strings
                .filter((code): code is string => !!code) ?? [];

            if (
              selectedAirlines.length > 0 &&
              !offerAirlines.some((code) => selectedAirlines.includes(code))
            )
              return false;

            // D. Duration check
            const totalDuration =
              offer.segments?.reduce(
                (sum, s) => sum + (s.total_time ?? 0),
                0,
              ) ?? 0;

            if (
              timeRange &&
              (totalDuration < timeRange[0] || totalDuration > timeRange[1])
            )
              return false;

            return true;
          });

          return { ...flight, flight_offers: validOffers };
        })
        /**
         *
         * By using Infinity, you are saying: "I don't know the price of this flight,
         * so assume it is the most expensive thing in the universe."
         * This pushes it to the bottom of the list where it won't bother the user.
         */

        // 2. Then, Sort the filtered results
        .filter((flight) => flight.flight_offers.length > 0)
        .sort((a, b) => {
          // Helper to get the minimum price/time from a flight's offers
          const getMinPrice = (f: FlightDataProps) =>
            Math.min(
              ...(f.flight_offers?.map(
                (o) => o.price_breakdown?.total?.amount ?? Infinity,
              ) ?? [Infinity]),
            );

          const getMinTime = (f: FlightDataProps) =>
            Math.min(
              ...(f.flight_offers?.map((o) => {
                // 1. Sum up all segments (Outbound + Inbound/Layovers) for this specific offer
                const totalOfferTime = o.segments?.reduce(
                  (acc, segment) => acc + (segment.total_time ?? 0),
                  0,
                );

                // 2. Return that total, or Infinity if no segments exist (to push it to the bottom)
                return totalOfferTime || Infinity;
              }) ?? [Infinity]),
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
                ...(f.flight_offers?.map((o) => {
                  const totalPrice = o.price_breakdown?.total?.amount ?? 0;

                  // Sum all segments for the total duration
                  const totalDuration =
                    o.segments?.reduce(
                      (sum, s) => sum + (s.total_time ?? 0),
                      0,
                    ) ?? 0;

                  // Logic: Price + Duration (Lower score is better)
                  return totalPrice + totalDuration;
                }) ?? [Infinity]),
              );
            return getBestScore(a) - getBestScore(b);
          }

          return 0;
        })
    );
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
      (a.price_breakdown?.total?.amount ?? 0) + getTotalFlightTime(a);
    const scoreB =
      (b.price_breakdown?.total?.amount ?? 0) + getTotalFlightTime(b);

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
      .filter((p): p is number => typeof p === "number") ?? []; // is keyword - is used to create user-defined type guards, which help the compiler narrow down the type of a variable within a specific scope. 

  const allDurations = allOffers.map(
    (offer) =>
      offer.segments?.reduce((sum, s) => sum + (s.total_time ?? 0), 0) ?? 0,
  );

  const minDuration = allDurations.length > 0 ? Math.min(...allDurations) : 0;
  const maxDuration =
    allDurations.length > 0 ? Math.max(...allDurations) : 1440;

  const uniqueTripTypesWithLabels = Array.from(new Set(tripFilter));

  const assignLabelsToTripTypes = uniqueTripTypesWithLabels.map((trip) => {
    const newData = {
      value: trip.value,
      label: trip.label,
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

  const handleSortByChange = (value: string) => {
    startTransition(() => {
      setSortBy(value);
    });
  };

  return (
    <section className="w-full grid lg:grid-cols-[225px_1fr] xl:grid-cols-[343px_1fr] grid-cols-1 lg:gap-[15.5px] relative font-montserrat">
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
          selectedAirlines={selectedAirlines}
        />
        <TripFilter
          trips={assignLabelsToTripTypes}
          openFilter={openTripFilter}
          onClose={handleOpenTripFilter}
          onChange={handleTripChange}
          selectedTrips={selectedTrips}
        />
      </aside>
      <Filters showFilters={showFilters} onClose={handleShowFilters}>
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
          selectedAirlines={selectedAirlines}
        />
        <TripFilter
          trips={assignLabelsToTripTypes}
          openFilter={openTripFilter}
          onClose={handleOpenTripFilter}
          onChange={handleTripChange}
          selectedTrips={selectedTrips}
        />
      </Filters>
      <Button
        label="sort by"
        type="button"
        className="lg:hidden flex items-center justify-center gap-1 mb-6 min-w-28 h-12 px-4 rounded mx-auto bg-mint-green-100 text-sm font-medium hover:bg-blackish-green hover:text-white capitalize"
        icon={<FilterIcon />}
        onClick={handleShowFilters}
      />
      <FlightDisplayData
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
        cheapest={cheapestOffer.price_breakdown?.total?.amount}
        best={bestOffer.price_breakdown?.total?.amount}
        quickest={quickestOffer.price_breakdown?.total?.amount}
        filteredSortedData={filteredSortedData}
        isPendingFilter={isPendingFilter}
        adultCount={adultCount}
        childCount={childCount}
        infantCount={infantCount}
      />
    </section>
  );
};
