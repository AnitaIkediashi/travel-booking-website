import { HotelCard } from "@/types/hotel_type"

type HotelListingProp = {
  hotelData: HotelCard[]
}

export const HotelListingWrapper = ({hotelData}: HotelListingProp) => {
  return (
    <div>hotel_listing_wrapper</div>
  )
}
