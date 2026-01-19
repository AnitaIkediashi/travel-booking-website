"use client";

import { usePathname } from "next/navigation";
import { ListSearchHotels } from "../sections/hotels/list_search_hotels";
import { ListSearchFlights } from "../sections/flights/list_search_flights";

//using Generics
type ListingProps<T> = {
  data: T[] | undefined;
};

/**
 *
 * <T,> makes the Generic type not to look like a JSX or TSX component - like HTML tag
 */
export const Listings = <T,>({ data }: ListingProps<T>) => {
  const pathname = usePathname();

  const isFlight = pathname.startsWith("/flight-flow/flight-search/listing");
  const isHotel = pathname.startsWith("/hotel-flow/hotel-search/listing");

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="px-6 py-8 w-full bg-white shadow-light">
          {isFlight ? <ListSearchFlights /> : isHotel ? <ListSearchHotels /> : null} 
        </div>
      </div>
    </section>
  );
};
