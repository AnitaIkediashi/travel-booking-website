import Image from "next/image";
import { Button } from "../reusable/button";
import { HOTEL_LISTING_PATH } from "@/utils/page_routes";

type RandomHotelProps ={
 hotel: HotelProps
}

type HotelProps = {
  thumbnail: string | null;
  startingPrice: number | null;
  currencySymbol: string;
  id: string;
  name: string;
  country: string;
  city: string;
};

const toDateParam = (date: Date) => {
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export const RandomHotels = ({ hotel }: RandomHotelProps) => {
    const shortenCountryLength =
      hotel.country!.length > 15
        ? `${hotel.country!.slice(0, 15)}...`
        : hotel.country;

     const checkIn = addDays(new Date(), 7);
     const checkOut = addDays(checkIn, 1); // one night

     const params = new URLSearchParams({
       destination: hotel.name,
       checkIn: toDateParam(checkIn),
       checkOut: toDateParam(checkOut),
       adults: "1",
       children: "0",
       rooms: "1",
     });

     const href = `${HOTEL_LISTING_PATH}?${params.toString()}`;

  return (
    <div className="min-w-[225px] flex-1 rounded-xl h-[420px] relative font-montserrat">
          <Image
            src={hotel.thumbnail || "/illustrations/broken-image.png"}
            alt="random images"
            width={296}
            height={420}
            quality={100}
            className="bg-cover w-full h-full rounded-xl"
          />
          {/* overlay */}
          <div className="inset-0 absolute z-10 rounded-xl bg-black/40" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-y-4 z-20">
            <div className="flex flex-col gap-1 text-white">
              <div>
                <h6 className="text-lg font-medium">{hotel.name}</h6>
                <p className="text-sm">{shortenCountryLength}, {hotel.city}</p>
              </div>
              <p className="text-xl font-semibold">From {hotel.currencySymbol} {hotel.startingPrice?.toFixed(0)}</p>
            </div>
            <Button label="Book a hotel" className="w-full h-12 flex items-center justify-center bg-mint-green-100 rounded text-sm font-medium hover:bg-mint-green-70" href={href} />
          </div>
        </div>
  )
}
