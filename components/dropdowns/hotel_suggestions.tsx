import { DestinationProp, DestinationType } from "@/types/hotel_type";
import { BedIcon } from "../icons/bed";
import { LocationIcon } from "../icons/location";

type HotelSuggestionProps = {
  destinationList: DestinationProp[];
  onSelect: (destination: DestinationProp) => void;
};

const suggestionIcons: Record<DestinationType, React.ReactNode> = {
  hotel: <BedIcon />,
  city: <LocationIcon />,
  state: <LocationIcon />,
  country: <LocationIcon />,
};

export const HotelSuggestions = ({
  destinationList,
  onSelect,
}: HotelSuggestionProps) => {
  return (
    <ul
      className={`${
        destinationList.length === 0 ? "h-auto" : "max-h-[300px]"
      } absolute w-full bg-white shadow-light left-0 right-0 z-20 font-montserrat rounded-sm overflow-y-auto p-4 flex flex-col gap-y-3`}
    >
      {destinationList.length === 0 ? (
        <li className="font-semibold text-lg text-red-500">
          No destinations found
        </li>
      ) : (
        destinationList.map((item) => (
          <li
            key={`${item.type}-${item.value}-${item.sublabel}`}
            className="flex items-center gap-2 p-2 hover:bg-mint-green-100 cursor-pointer rounded-sm"
            onClick={() => onSelect(item)}
          >
            <div className="shrink-0">{suggestionIcons[item.type]}</div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-semibold text-blackish-green-10 truncate">
                {item.label}
              </p>
              <p className="text-sm text-blackish-green-10 truncate">
                {item.sublabel}
              </p>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};
