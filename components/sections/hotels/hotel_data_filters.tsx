import { HotelCard } from "@/types/hotel_type";

type HotelDataFilterProps = {
  isPending: boolean;
  data: HotelCard[] | undefined;
};

export const HotelDataFilters = ({isPending, data}: HotelDataFilterProps) => {
  return (
    <div>hotel_data</div>
  )
}
