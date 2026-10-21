import { HotelDetail } from "@/types/hotel_type";

type HotelDetailWrapperProps = {
  hotel: HotelDetail;
};

export const HotelDetailWrapper = ({hotel}: HotelDetailWrapperProps) => {
  console.log(hotel)
  return (
    <div>hotel_detail_wrapper</div>
  )
}
