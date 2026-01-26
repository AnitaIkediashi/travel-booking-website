import { BoxShadow } from "@/components/reusable/box_shadow"
import { SortByPrice } from "@/components/reusable/sort_by_price"
import { Dispatch, SetStateAction } from "react";

type FlightDisplayDataProps = {
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
  cheapest: number | undefined;
  best: number | undefined;
  quickest: number | undefined;
};


export const FlightDisplayData = ({sortBy, setSortBy, cheapest, best, quickest}: FlightDisplayDataProps) => {
  return (
    <div className="font-montserrat">
      <BoxShadow className="px-6 py-4 flex items-center justify-center shadow-light relative">
        <div className="w-full md:h-[45px] flex gap-6 md:flex-row flex-col items-center">
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
    </div>
  );
}
