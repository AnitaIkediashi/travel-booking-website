"use client";

import { useSearchParams } from "next/navigation";
import { ListSearchHotels } from "../sections/hotels/list_search_hotels";
import { ListSearchFlights } from "../sections/flights/list_search_flights";
import { useTransition } from "react";
import dayjs from "dayjs";
import { FlightDataFilters } from "../sections/flights/flight_data_filters";
import { HotelDataFilters } from "../sections/hotels/hotel_data_filters";
import { FlightDataProps } from "@/types/flight_type";
import { HotelCard } from "@/types/hotel_type";

type ListingProps =
  | { kind: "flight"; data: FlightDataProps[] | undefined }
  | { kind: "hotel"; data: HotelCard[] | undefined };

export const Listings = (props: ListingProps) => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const trip = searchParams.get("trip");
  const departParam = searchParams.get("depart");
  const depart = departParam ? dayjs(departParam) : null;
  const returnParam = searchParams.get("return");
  const returnDate = returnParam ? dayjs(returnParam) : null;
  const adults = +(searchParams.get("adults") ?? 0);
  const child = +(searchParams.get("child") ?? 0);
  const infant = +(searchParams.get("infant") ?? 0);
  const cabin = searchParams.get("cabin");

  const flightQueryParams = {
    from,
    to,
    trip,
    depart,
    return: returnDate,
    adults,
    child,
    infant,
    cabin,
  };

  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");

  const hotelQueryParams = {
    destination: searchParams.get("destination") ?? "",
    destinationType: searchParams.get("destinationType"),
    destinationValue: searchParams.get("destinationValue"),
    checkIn: checkInParam ? dayjs(checkInParam) : null,
    checkOut: checkOutParam ? dayjs(checkOutParam) : null,
    adults: Number(searchParams.get("adults") ?? 1),
    children: Number(searchParams.get("children") ?? 0),
    rooms: Number(searchParams.get("rooms") ?? 1),
  };

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="px-6 py-8 w-full bg-white shadow-light mb-8">
          {props.kind === "flight" ? (
            <ListSearchFlights
              queryParams={flightQueryParams}
              startTransition={startTransition}
            />
          ) : (
            <ListSearchHotels
              queryParams={hotelQueryParams}
              startTransition={startTransition}
            />
          )}
        </div>
        {props.kind === "flight" ? (
          <FlightDataFilters
            isPending={isPending}
            data={props.data}
            trip={trip}
            adultCount={adults}
            childCount={child}
            infantCount={infant}
            depart={depart}
            return={returnDate}
          />
        ) : (
          <HotelDataFilters
            isPending={isPending}
            data={props.data}
            adultCount={hotelQueryParams.adults}
            childCount={hotelQueryParams.children}
            roomCount={hotelQueryParams.rooms}
            checkIn={hotelQueryParams.checkIn}
            checkOut={hotelQueryParams.checkOut}
          />
        )}
      </div>
    </section>
  );
};
