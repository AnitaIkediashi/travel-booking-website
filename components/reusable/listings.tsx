"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListSearchHotels } from "../sections/hotels/list_search_hotels";
import { ListSearchFlights } from "../sections/flights/list_search_flights";
import { useTransition } from "react";
import dayjs from "dayjs";
import { FlightDataFilters } from "../sections/flights/flight_data_filters";
import { HotelDataFilters } from "../sections/hotels/hotel_data_filters";
import { FlightDataProps } from "@/types/flight_type";

//using Generics
type ListingProps<T> = {
  data: T[] | undefined;
};

/**
 *
 * 1. <T,> makes the Generic type not to look like a JSX or TSX component - like HTML tag
 * 2. Get the parameters stored in the url of the browser using useSearchParams
 * 3. using useTransition to only update  the current UI interactive and only re-render 
 * the parts of the page that depend on the search parameters without a full browser refresh
 * 4. usePathname to determine which page/path you are on from the browser
 * NOTE TO TAKE: the useSearchParams converts the params to string, so some of the parameters,
 * i reconverted them to their designated types needed for my search component
 */
export const Listings = <T,>({ data }: ListingProps<T>) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const trip = searchParams.get("trip");
  const departParam = searchParams.get("depart");
  const depart = departParam ? dayjs(departParam) : null;

  const returnParam = searchParams.get("return");
  const returnDate = returnParam ? dayjs(returnParam) : null;
  const adults = +(searchParams.get("adults") ?? 0); //convert to number
  const children = +(searchParams.get("children") ?? 0);
  const cabin = searchParams.get("cabin");

  const queryParams = {
    from,
    to,
    trip,
    depart,
    return: returnDate,
    adults,
    children,
    cabin,
  };

  const isFlight = pathname.startsWith("/flight-flow/flight-search/listing");
  const isHotel = pathname.startsWith("/hotel-flow/hotel-search/listing");

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="px-6 py-8 w-full bg-white shadow-light mb-8">
          {isFlight ? (
            <ListSearchFlights
              queryParams={queryParams}
              startTransition={startTransition}
            />
          ) : isHotel ? (
            <ListSearchHotels />
          ) : null}
        </div>
        {isFlight ? (
          <FlightDataFilters
            isPending={isPending}
            data={data as unknown as FlightDataProps[]} // Type assertion
          />
        ) : (
          <HotelDataFilters />
        )}
      </div>
    </section>
  );
};
