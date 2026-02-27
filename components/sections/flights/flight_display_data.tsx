'use client'

import { BoxShadow } from "@/components/reusable/box_shadow";
import { PageCount } from "@/components/reusable/page_count";
import { SortByPrice } from "@/components/reusable/sort_by_price";
import { FlightDataProps } from "@/types/flight_type";
import { SegmentData } from "./segment_data";
import Image from "next/image";
import { Button } from "@/components/reusable/button";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatedDots } from "@/components/loaders/animated_dots";

type FlightDisplayDataProps = {
  sortBy: string;
  handleSortByChange: (value: string) => void;
  cheapest: number | undefined;
  best: number | undefined;
  quickest: number | undefined;
  filteredSortedData: FlightDataProps[];
  isPendingFilter: boolean;
  adultCount: number;
  childCount: number;
  infantCount: number;
};

export const FlightDisplayData = ({
  sortBy,
  handleSortByChange,
  cheapest,
  best,
  quickest,
  filteredSortedData,
  isPendingFilter,
  adultCount,
  infantCount,
  childCount,
}: FlightDisplayDataProps) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isLoadMoreTriggered, setIsLoadMoreTriggered] = useState(false); //Boolean flag indicating if "Load More" has been triggered.
  const [isPending, startTransition] = useTransition();

  // 1. Use a Ref to store the previous position.
  // This avoids the 'disappearing' bug caused by state-sync lag.
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Only run if Load More was clicked
      if (!isLoadMoreTriggered) return;

      const currentScrollPos = window.scrollY;

      // Show button if:
      // - User is more than 400px down
      // - AND they are scrolling UP (current is less than last)
      if (currentScrollPos > 400 && currentScrollPos < lastScrollY.current) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }

      // Update the ref to the current position for the next event
      lastScrollY.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadMoreTriggered]);

  const totalFlightOffered = filteredSortedData
    .map((data) => data.flight_offers?.length ?? 0)
    .reduce((a, b) => a + b, 0);

  const displaySlicedData = filteredSortedData
    .flatMap((data) => data.flight_offers ?? [])
    .slice(0, visibleCount);

  const handleShowMore = () => {
    startTransition(() => {
      if (visibleCount <= totalFlightOffered) {
        setIsLoadMoreTriggered(true);
        setVisibleCount((prevCount) => prevCount + 10);
      }
      setShowScrollToTop(true);
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setShowScrollToTop(false); // Hide the button after clicking the scroll-to-top
  };

  if (
    filteredSortedData?.length === 0 ||
    !filteredSortedData ||
    filteredSortedData.every(
      (data) => !data.flight_offers || data.flight_offers.length === 0,
    )
  ) {
    return (
      <div className="w-full flex items-center justify-center flex-col gap-3">
        <Image
          src="/illustrations/no-data-illustration.svg"
          alt="no data"
          width={400}
          height={400}
        />
        <p className="font-medium text-blackish-green text-center text-sm">
          No flight records found, <br /> try removing some filters to see more
          results.
        </p>
      </div>
    );
  }

  return (
    <div className="font-montserrat">
      <BoxShadow className="px-6 py-4 flex items-center justify-center shadow-light relative">
        <div className="w-full md:h-[45px] flex gap-6 md:flex-row flex-col md:items-center">
          <div
            className={`relative flex-1 min-w-[150px] h-full md:pr-6 pb-6 md:pb-0 md:border-r border-b md:border-b-0 border-b-mint-green-70 md:border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer ${sortBy === "cheapest" ? "after:content-[''] after:absolute md:after:-bottom-4 md:after:w-[calc(100%-18px)] md:after:h-1 after:bg-mint-green-100 md:after:left-0 after:-right-[26px] after:w-1 after:h-[calc(100%-18px)]" : ""}`}
            onClick={() => handleSortByChange("cheapest")}
          >
            <SortByPrice title="cheapest" price={cheapest} />
          </div>
          <div
            className={`relative flex-1 min-w-[150px] h-full md:pr-6 pb-6 md:pb-0 md:border-r border-b md:border-b-0 border-b-mint-green-70 md:border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer ${sortBy === "best" ? "after:content-[''] after:absolute md:after:-bottom-4 md:after:w-[calc(100%-18px)] md:after:h-1 after:bg-mint-green-100 md:after:left-0 after:-right-[26px] after:w-1 after:h-[calc(100%-18px)]" : ""}`}
            onClick={() => handleSortByChange("best")}
          >
            <SortByPrice title="best" price={best} />
          </div>
          <div
            className={`relative flex-1 min-w-[150px] h-full pb-6 md:pb-0 flex flex-col gap-y-2 cursor-pointer ${sortBy === "quickest" ? "after:content-[''] after:absolute md:after:-bottom-4 md:after:w-[calc(100%-18px)] md:after:h-1 after:bg-mint-green-100 md:after:left-0 after:-right-[26px] after:w-1 after:h-[calc(100%-18px)]" : ""}`}
            onClick={() => handleSortByChange("quickest")}
          >
            <SortByPrice title="quickest" price={quickest} />
          </div>
        </div>
      </BoxShadow>
      <div className="mt-6 flex flex-col gap-y-6">
        <PageCount
          currentCount={displaySlicedData.length}
          totalCount={totalFlightOffered}
        />
        {displaySlicedData.map((offer, index) => {
          return (
            <div key={index} className="flex flex-col gap-y-8 w-full">
              <BoxShadow
                className={`w-full rounded-xl shadow-light py-6 md:py-0 px-4 ${isPendingFilter ? "opacity-40" : "opacity-100"}`}
              >
                <SegmentData
                  offers={offer}
                  adultCount={adultCount}
                  childCount={childCount}
                  infantCount={infantCount}
                />
              </BoxShadow>
            </div>
          );
        })}
        <Button
          type="button"
          icon={isPending ? <AnimatedDots /> : undefined}
          label={isPending ? "" : "Show more results"}
          className={`w-full h-12 bg-blackish-green text-white text-sm font-semibold rounded flex items-center justify-center ${visibleCount >= totalFlightOffered ? "hidden" : ""}`}
          onClick={handleShowMore}
        />
        <Button
          type="button"
          label="Scroll to top"
          className={`bg-blackish-green text-white px-5 py-3 rounded font-medium shadow-2xl fixed left-0 right-0 z-50 w-[140px] mx-auto transition-all duration-500 ease-in-out hover:bg-blackish-green-20/80 ${
            showScrollToTop
              ? "bottom-10 opacity-100 translate-y-0"
              : "-bottom-20 opacity-0 translate-y-10 pointer-events-none"
          }`}
          onClick={scrollToTop}
        />
      </div>
    </div>
  );
};;
