"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListSearchHotels } from "../sections/hotels/list_search_hotels";
import { ListSearchFlights } from "../sections/flights/list_search_flights";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FlightDataFilters } from "../sections/flights/flight_data_filters";
import { HotelDataFilters } from "../sections/hotels/hotel_data_filters";

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
  const searchParams = useSearchParams();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const trip = searchParams.get("trip");
  const depart = dayjs(searchParams.get("depart"));
  const returnDate = dayjs(searchParams.get("return")) || null;
  const adults = +(searchParams.get("adults") ?? 0);
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
            <ListSearchFlights queryParams={queryParams} />
          ) : isHotel ? (
            <ListSearchHotels />
          ) : null}
        </div>
        {
            isFlight ? <FlightDataFilters /> : <HotelDataFilters />
        }
      </div>
    </section>
  );
};
