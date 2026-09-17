import { searchAvailableHotels } from "@/helpers/query_hotels"
import { HotelSearchParams } from "@/types/hotel_type"

const HotelListingPage = async({searchParams}: HotelSearchParams) => {
  const searchProps = await searchParams
  const results = await searchAvailableHotels(searchProps)
  return (
    <div>page</div>
  )
}

export default HotelListingPage;
