'use client'

import { LocationProps } from "@/types/flight_type";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LocationCardProp = {
  item: LocationProps;
  index: number;
  shortenCountryLength: string;
};

export const RandomLocationCard = ({item, index, shortenCountryLength}: LocationCardProp) => {
    const router = useRouter()

    const handleCardClick = (code: string) => {
        router.push(`/flight-flow/flight-search?query=${code}`)
    }
  return (
    <div
      className="min-w-[241px] flex-1 flex items-center gap-4 p-4 rounded-2xl shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-white cursor-pointer hover:bg-mint-green-50"
      onClick={() => handleCardClick(item.airport_code!)}
    >
      <Image
        src={item.image_url || "/illustrations/broken-image.png"}
        alt={`item image ${index}`}
        width={90}
        height={90}
        className="rounded-lg"
      />
      <div className="flex flex-col gap-y-2">
        <h6 className="text-blackish-green font-semibold">
          {item.city}, {shortenCountryLength}
        </h6>
        <p className="text-blackish-green font-medium text-sm capitalize">
          flights • hotels • resorts
        </p>
      </div>
    </div>
  );
}
