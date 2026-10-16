"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { HotelCard, HotelSortValue } from "@/types/hotel_type";
import { SkeletonSection } from "@/components/reusable/skeleton_section";
import { Button } from "@/components/reusable/button";
import { FilterIcon } from "@/components/icons/filter";
import { PriceFilter } from "@/components/reusable/price_filter"; // adjust path
import { Filters } from "@/components/reusable/filters";
import { RatingFilter } from "@/components/reusable/rating_filter";
import { AmenitiesFilter } from "@/components/reusable/amenities_filter";
import { HotelDisplayData } from "./hotel_display_data";

type HotelDataFilterProps = {
  isPending: boolean;
  data: HotelCard[] | undefined;
};

const comparePrice = (a: number | null, b: number | null, dir: "asc" | "desc") => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return dir === "asc" ? a - b : b - a;
};

export const HotelDataFilters = ({ isPending, data }: HotelDataFilterProps) => {
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [openPriceFilter, setOpenPriceFilter] = useState(false);
  const [openRatingFilter, setOpenRatingFilter] = useState(false);
  const [openAmenitiesFilter, setOpenAmenitiesFilter] = useState(false);

  const [showFilters, setShowFilters] = useState(false); // small screens
  const [sortBy, setSortBy] = useState<HotelSortValue>("recommended");
  const [isPendingFilter, startTransition] = useTransition();

  // Slider bounds come from the full (unfiltered) result set.
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = (data ?? [])
      .map((hotel) => hotel.fromPrice)
      .filter((p): p is number => typeof p === "number");

    if (prices.length === 0) return { minPrice: 0, maxPrice: 0 };

    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [data]);

  // Unique amenities across all results, most common first (ties alphabetical).
  const amenityOptions = useMemo(() => {
    const counts = new Map<string, number>();
    data?.forEach((hotel) => {
      hotel.hotel_amenities?.forEach((amenity) => {
        counts.set(amenity, (counts.get(amenity) ?? 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([amenity]) => amenity);
  }, [data]);

  const filteredSortedData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((hotel) => {
        // A. Price range
        if (priceRange) {
          if (hotel.fromPrice === null) return false;
          if (
            hotel.fromPrice < priceRange[0] ||
            hotel.fromPrice > priceRange[1]
          )
            return false;
        }

        // B. Rating: "3+" means avg_rating >= 3 (unrated hotels count as 0)
        if (selectedRating !== null && (hotel.avg_rating ?? 0) < selectedRating)
          return false;

        // C. Amenities: hotel must have ALL the selected amenities
        if (
          selectedAmenities.length > 0 &&
          !selectedAmenities.every((a) => hotel.hotel_amenities?.includes(a))
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "lowest_price":
            return comparePrice(a.fromPrice, b.fromPrice, "asc");
          case "highest_price":
            return comparePrice(a.fromPrice, b.fromPrice, "desc");
          case "star_rating":
            return (
              (b.avg_rating ?? 0) - (a.avg_rating ?? 0) ||
              b.review_count - a.review_count // tie-breaker: more reviews first
            );
          default:
            return 0; // "recommended" keeps the server order
        }
      });
  }, [data, priceRange, selectedRating, selectedAmenities, sortBy]);

  const handleOpenPriceFilter = () => setOpenPriceFilter((prev) => !prev);
  const handleOpenRatingFilter = () => setOpenRatingFilter((prev) => !prev);
  const handleOpenAmenitiesFilter = () =>
    setOpenAmenitiesFilter((prev) => !prev);
  const handleShowFilters = () => setShowFilters((prev) => !prev);

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      startTransition(() => {
        setPriceRange([value[0], value[1]]);
      });
    }
  };

  const handleRatingChange = (rating: number | null) => {
    startTransition(() => {
      setSelectedRating(rating);
    });
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    startTransition(() => {
      setSelectedAmenities(amenities);
    });
  };

  const handleSortByChange = (value: HotelSortValue) => {
    startTransition(() => {
      setSortBy(value);
    });
  };

  // 1. Loading state
  if (isPending) return <SkeletonSection />;

  // 2. No data at all
  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center flex-col gap-3">
        <Image
          src="/illustrations/no-data-illustration.svg"
          alt="no data"
          width={400}
          height={400}
          className="w-[400px] h-[400px]"
        />
        <p className="font-medium text-blackish-green">
          No hotel records, ensure to search for the appropriate stays
        </p>
      </div>
    );
  }

  // 3. Data exists
  const filterControls = (
    <>
      <PriceFilter
        min={minPrice}
        max={maxPrice}
        onChange={handlePriceChange}
        priceRange={priceRange}
        openFilter={openPriceFilter}
        onClose={handleOpenPriceFilter}
      />
      <RatingFilter
        selectedRating={selectedRating}
        onChange={handleRatingChange}
        openFilter={openRatingFilter}
        onClose={handleOpenRatingFilter}
        className="my-8"
      />
      <AmenitiesFilter
        amenities={amenityOptions}
        selectedAmenities={selectedAmenities}
        onChange={handleAmenitiesChange}
        openFilter={openAmenitiesFilter}
        onClose={handleOpenAmenitiesFilter}
      />
    </>
  );

  return (
    <section className="w-full grid lg:grid-cols-[225px_1fr] xl:grid-cols-[343px_1fr] grid-cols-1 lg:gap-[15.5px] relative font-montserrat">
      <aside className="w-full lg:pr-6 lg:border-r lg:border-r-blackish-green hidden lg:block">
        <h3 className="pb-8 text-blackish-green font-semibold text-xl capitalize">
          filters
        </h3>
        {filterControls}
      </aside>

      <Filters showFilters={showFilters} onClose={handleShowFilters}>
        {filterControls}
      </Filters>

      <Button
        label="filters"
        type="button"
        className="lg:hidden flex items-center justify-center gap-1 mb-6 min-w-28 h-12 px-4 rounded mx-auto bg-mint-green-100 text-sm font-medium hover:bg-blackish-green hover:text-white capitalize"
        icon={<FilterIcon />}
        onClick={handleShowFilters}
      />

      <HotelDisplayData
        filteredSortedData={filteredSortedData}
        totalCount={data.length}
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
        isPendingFilter={isPendingFilter}
      />
    </section>
  );
};
