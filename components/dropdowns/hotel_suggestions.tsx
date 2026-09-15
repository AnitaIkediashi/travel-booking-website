import { DestinationProp } from "@/types/hotel_type";
import { BedIcon } from "../icons/bed";

type HotelSuggestionProps = {
  destinationList: DestinationProp[];
  onSelect: (destination: string) => void;
};

export const HotelSuggestions = ({destinationList, onSelect}:HotelSuggestionProps) => {
  return (
    <ul
      className={`${
        destinationList.length === 0 ? "h-auto" : "max-h-[300px]"
      } absolute w-full bg-white shadow-light left-0 right-0 z-20 font-montserrat rounded-sm overflow-y-auto p-4 flex flex-col gap-y-3`}
    >
        {
            destinationList.length === 0 ? (<li className="font-semibold text-lg text-red-500">
          No hotels found
        </li>) : (
            destinationList.map((list) => {
                const locationLine = [list.city, list.state, list.country]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <li
                    key={list.id}
                    className="flex items-center gap-2 p-2 hover:bg-mint-green-100 cursor-pointer rounded-sm"
                    onClick={() => onSelect(list.name)}
                  >
                    <div className="shrink-0">
                      <BedIcon />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      {list.name && (
                        <p className="text-sm font-semibold text-blackish-green-10 truncate">
                          {list.name}
                        </p>
                      )}
                      <p className="text-sm text-blackish-green-10 truncate">
                        {locationLine}
                      </p>
                    </div>
                  </li>
                );
            })
        )
        }
    </ul>
  );
}
