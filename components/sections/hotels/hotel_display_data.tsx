import { HotelCard, HotelSortValue } from "@/types/hotel_type";

type HotelDisplayDataProps = {
  filteredSortedData: HotelCard[];
  totalCount: number;
  sortBy: string;
  handleSortByChange: (value: HotelSortValue) => void;
  isPendingFilter: boolean;
};

export const HotelDisplayData = ({filteredSortedData, totalCount, sortBy, handleSortByChange, isPendingFilter}: HotelDisplayDataProps) => {
  return (
    <div>hotel_display_data</div>
  )
}
