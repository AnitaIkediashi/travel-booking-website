import { Dayjs } from "dayjs";
import { TransitionStartFunction } from "react";

type ListSearchHotelProps = {
  queryParams: HotelQueryParams;
  startTransition: TransitionStartFunction;
};

type HotelQueryParams = {
  destination: string;
  destinationType: string | null;
  destinationValue: string | null;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
  adults: number;
  children: number;
  rooms: number;
};

export const ListSearchHotels = ({queryParams, startTransition}: ListSearchHotelProps) => {
  return (
    <div>list-search_hotels</div>
  )
}
