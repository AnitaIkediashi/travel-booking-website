import { BoxShadow } from "@/components/reusable/box_shadow";
import { PageCount } from "@/components/reusable/page_count";
import { SortByPrice } from "@/components/reusable/sort_by_price";
import { FlightDataProps } from "@/types/flight_type";
import { SegmentData } from "./segment_data";
import Image from "next/image";

type FlightDisplayDataProps = {
  sortBy: string;
  handleSortByChange: (value: string) => void;
  cheapest: number | undefined;
  best: number | undefined;
  quickest: number | undefined;
  filteredSortedData: FlightDataProps[];
  isPendingFilter: boolean;
};

export const FlightDisplayData = ({
  sortBy,
  handleSortByChange,
  cheapest,
  best,
  quickest,
  filteredSortedData,
  isPendingFilter,
}: FlightDisplayDataProps) => {
  const totalFlightOffered = filteredSortedData
    .map((data) => data.flight_offers?.length ?? 0)
    .reduce((a, b) => a + b, 0);

  if (filteredSortedData?.length === 0 || !filteredSortedData) {
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
            className={`relative flex-1 min-w-[150px] h-full pr-6 border-r border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer ${sortBy === "cheapest" ? "after:content-[''] after:absolute after:-bottom-4 after:w-[calc(100%-18px)] after:h-1 after:bg-mint-green-100 after:left-0" : ""}`}
            onClick={() => handleSortByChange("cheapest")}
          >
            <SortByPrice title="cheapest" price={cheapest} />
          </div>
          <div
            className={`relative flex-1 min-w-[150px] h-full pr-6 border-r border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer ${sortBy === "best" ? "after:content-[''] after:absolute after:-bottom-4 after:w-[calc(100%-18px)] after:h-1 after:bg-mint-green-100 after:left-0" : ""}`}
            onClick={() => handleSortByChange("best")}
          >
            <SortByPrice title="best" price={best} />
          </div>
          <div
            className={`relative flex-1 min-w-[150px] h-full flex flex-col gap-y-2 cursor-pointer ${sortBy === "quickest" ? "after:content-[''] after:absolute after:-bottom-4 after:w-[calc(100%-18px)] after:h-1 after:bg-mint-green-100 after:left-0" : ""}`}
            onClick={() => handleSortByChange("quickest")}
          >
            <SortByPrice title="quickest" price={quickest} />
          </div>
        </div>
      </BoxShadow>
      <div className="mt-6 flex flex-col gap-y-6">
        <PageCount
          currentCount={totalFlightOffered}
          totalCount={totalFlightOffered}
        />
        {filteredSortedData.map((data) => {
          return (
            <div key={data.id} className="flex flex-col gap-y-8 w-full">
              {data.flight_offers?.map((offer, index) => {
                return (
                  <BoxShadow
                    key={index}
                    className={`w-full rounded-xl shadow-light py-6 md:py-0 px-4 ${isPendingFilter ? "opacity-40" : "opacity-100"}`}
                  >
                    <SegmentData offers={offer} />
                  </BoxShadow>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
