import { BoxShadow } from "@/components/reusable/box_shadow"
import { SortByPrice } from "@/components/reusable/sort_by_price"


export const FlightDisplayData = () => {
  return (
    <div className="font-montserrat">
      <BoxShadow className="px-6 py-4 flex items-center justify-center shadow-light relative">
        <div className="w-full md:h-[45px] flex gap-6 md:flex-row flex-col items-center">
          <div
            className={`relative flex-1 min-w-[150px] h-full pr-6 border-r border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer`}
          >
            <SortByPrice title="cheapest" price={40} duration="21h2m" />
          </div>
          <div
            className={`flex-1 min-w-[150px] h-full pr-6 border-r border-r-mint-green-70 flex flex-col gap-y-2 cursor-pointer`}
          >
            <SortByPrice title="best" price={40} duration="21h2m" />
          </div>
          <div
            className={`flex-1 min-w-[150px] h-full flex flex-col gap-y-2 cursor-pointer`}
          >
            <SortByPrice title="quickest" price={40} duration="21h2m" />
          </div>
        </div>
      </BoxShadow>
    </div>
  );
}
