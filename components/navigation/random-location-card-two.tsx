import Image from "next/image";
import { Button } from "../reusable/button";

type LocationCardTwoProps = {
  shortenCountryLength: string | undefined;
  price: number | undefined;
  image: string | null | undefined;
  currency: string | null | undefined;
  airportCode: string;
};

export const RandomLocationCardTwo = ({shortenCountryLength, price, image, currency, airportCode}: LocationCardTwoProps) => {
    const currencyChar = (currency === 'USD') ? '$' : '' // for now just using static character codes
  return (
    <div className="min-w-[225px] flex-1 rounded-xl h-[420px] relative font-montserrat">
      <Image
        src={image || "/illustrations/broken-image.png"}
        alt="random images"
        width={296}
        height={420}
        quality={100}
        className="bg-cover w-full h-full rounded-xl"
      />
      {/* overlay */}
      <div className="inset-0 absolute z-10 rounded-xl bg-black/40" />
      <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-y-4 z-20">
        <div className="flex items-center justify-between gap-1 text-white">
          <h6 className="text-xl font-medium">{shortenCountryLength}</h6>
          <p className="text-2xl font-semibold">{currencyChar} {price}</p>
        </div>
        <Button label="book flight" className="w-full h-12 flex items-center justify-center bg-mint-green-100 capitalize rounded text-sm font-medium hover:bg-mint-green-70" href={`/flight-flow/flight-search/listing?from=${airportCode}`} />
      </div>
    </div>
  );
}
