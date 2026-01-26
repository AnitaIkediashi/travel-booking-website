import { BoxShadow } from "@/components/reusable/box_shadow";
import { PageCount } from "@/components/reusable/page_count";
import { SortByPrice } from "@/components/reusable/sort_by_price";
import { FlightDataProps } from "@/types/flight_type";
import { Dispatch, SetStateAction } from "react";
import { SegmentData } from "./segment_data";

type FlightDisplayDataProps = {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  cheapest: number | undefined;
  best: number | undefined;
  quickest: number | undefined;
  filteredSortedData: FlightDataProps[];
};

export const FlightDisplayData = ({
  sortBy,
  setSortBy,
  cheapest,
  best,
  quickest,
  filteredSortedData,
}: FlightDisplayDataProps) => {
  return (
    <div className="font-montserrat">
      <BoxShadow className="px-6 py-4 flex items-center justify-center shadow-light relative">
        <div className="w-full md:h-[45px] flex gap-6 md:flex-row flex-col md:items-center">
          <div
            className={`relative flex-1 min-w-[150px] h-full pr-6 border-r border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer ${sortBy === "cheapest" ? "after:content-[''] after:absolute after:-bottom-4 after:w-[calc(100%-18px)] after:h-1 after:bg-mint-green-100 after:left-0" : ""}`}
            onClick={() => setSortBy("cheapest")}
          >
            <SortByPrice title="cheapest" price={cheapest} />
          </div>
          <div
            className={`relative flex-1 min-w-[150px] h-full pr-6 border-r border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer ${sortBy === "best" ? "after:content-[''] after:absolute after:-bottom-4 after:w-[calc(100%-18px)] after:h-1 after:bg-mint-green-100 after:left-0" : ""}`}
            onClick={() => setSortBy("best")}
          >
            <SortByPrice title="best" price={best} />
          </div>
          <div
            className={`relative flex-1 min-w-[150px] h-full flex flex-col gap-y-2 cursor-pointer ${sortBy === "quickest" ? "after:content-[''] after:absolute after:-bottom-4 after:w-[calc(100%-18px)] after:h-1 after:bg-mint-green-100 after:left-0" : ""}`}
            onClick={() => setSortBy("quickest")}
          >
            <SortByPrice title="quickest" price={quickest} />
          </div>
        </div>
      </BoxShadow>
      <div className="mt-6 flex flex-col gap-y-6">
        <PageCount
          currentCount={filteredSortedData.length}
          totalCount={filteredSortedData.length}
        />
        {filteredSortedData.map((data) => {
          return (
            <div key={data.id} className="flex flex-col gap-y-8 w-full">
              {data.flight_offers?.map((offer, index) => {
                return (
                  <BoxShadow
                    key={index}
                    className="w-full rounded-xl shadow-light py-6 md:py-0 px-4"
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
