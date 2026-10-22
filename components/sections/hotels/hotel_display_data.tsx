import { PageCount } from "@/components/reusable/page_count";
import { HotelCard, HotelSortValue } from "@/types/hotel_type";
import { useEffect, useRef, useState, useTransition } from "react";
import { HotelSortBy } from "./hotel_sort_by";
import { BoxShadow } from "@/components/reusable/box_shadow";
import { HotelList } from "./hotel_list";
import { Button } from "@/components/reusable/button";
import { AnimatedDots } from "@/components/loaders/animated_dots";
import { Dayjs } from "dayjs";

type HotelDisplayDataProps = {
  filteredSortedData: HotelCard[];
  sortBy: HotelSortValue;
  handleSortByChange: (value: HotelSortValue) => void;
  isPendingFilter: boolean;
  adultCount: number;
  childCount: number;
  roomCount: number;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
};

export const HotelDisplayData = ({
  filteredSortedData,
  sortBy,
  handleSortByChange,
  isPendingFilter,
  adultCount,
  childCount,
  roomCount,
  checkIn,
  checkOut
}: HotelDisplayDataProps) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isLoadMoreTriggered, setIsLoadMoreTriggered] = useState(false);
  const [isPending, startTransition] = useTransition();

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!isLoadMoreTriggered) return;

      const currentScrollPos = window.scrollY;

      if (currentScrollPos > 400 && currentScrollPos < lastScrollY.current) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }

      lastScrollY.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadMoreTriggered]);

  const totalHotelCount = filteredSortedData.length ?? 0;

  const currentCount = filteredSortedData.slice(0, visibleCount);

  const handleShowMore = () => {
    startTransition(() => {
      if (visibleCount <= totalHotelCount) {
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
    setShowScrollToTop(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
        <PageCount
          totalCount={totalHotelCount}
          currentCount={currentCount.length}
          type="places"
        />
        <HotelSortBy sortBy={sortBy} onChange={handleSortByChange} />
      </div>
      <div className="flex flex-col gap-y-6">
        {currentCount.map((hotel, index) => (
          <BoxShadow
            key={index}
            className={`w-full rounded-xl shadow-light ${isPendingFilter ? "opacity-40" : "opacity-100"}`}
          >
            <HotelList
              hotel={hotel}
              adultCount={adultCount}
              childCount={childCount}
              roomCount={roomCount}
              checkIn={checkIn}
              checkOut={checkOut}
            />
          </BoxShadow>
        ))}
      </div>
      <Button
        type="button"
        icon={isPending ? <AnimatedDots /> : undefined}
        label={isPending ? "" : "Show more results"}
        disabled={isPending}
        className={`w-full h-12 bg-blackish-green text-white text-sm font-semibold rounded flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed ${visibleCount >= totalHotelCount ? "hidden" : ""}`}
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
  );
};
