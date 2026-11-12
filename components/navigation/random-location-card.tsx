"use client";

import { RandomLocation } from "@/helpers/random_flights";
import { FLIGHT_SEARCH_PATH, HOTEL_SEARCH_PATH } from "@/utils/page_routes";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LocationCardProp = {
  item: RandomLocation;
  shortenCountryLength: string;
  shortenCityLength: string;
};

export const RandomLocationCard = ({
  item,
  shortenCountryLength,
  shortenCityLength,
}: LocationCardProp) => {
  const router = useRouter();

  const handleCardClick = () => {
    const href =
      item.kind === "flight"
        ? `${FLIGHT_SEARCH_PATH}?from=${encodeURIComponent(item.airport_code)}`
        : `${HOTEL_SEARCH_PATH}?destination=${encodeURIComponent(item.city)}`;
    router.push(href);
  };

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white cursor-pointer hover:bg-mint-green-50"
      onClick={handleCardClick}
    >
      <Image
        src={item.image_url || "/illustrations/broken-image.png"}
        alt={`${item.city}, ${item.country}`}
        width={90}
        height={90}
        className="w-[90px] h-[90px] shrink-0 rounded-lg object-cover"
      />
      <div className="flex flex-col gap-y-2">
        <h6 className="text-blackish-green font-semibold">
          {shortenCityLength}, {shortenCountryLength}
        </h6>
        <p className="text-blackish-green font-medium text-sm capitalize">
          flights • hotels • resorts
        </p>
      </div>
    </div>
  );
};
