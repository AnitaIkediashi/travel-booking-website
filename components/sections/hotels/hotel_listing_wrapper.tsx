import { Listings } from "@/components/reusable/listings"
import { HotelCard } from "@/types/hotel_type"

type HotelListingProp = {
  hotelData: HotelCard[]
}

export const HotelListingWrapper = ({hotelData}: HotelListingProp) => {
  return (
    <Listings data={hotelData} kind="hotel" />
  )
}
