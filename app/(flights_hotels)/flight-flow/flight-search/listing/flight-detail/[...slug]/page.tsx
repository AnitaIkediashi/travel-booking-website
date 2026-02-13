import { FlightDetailWrapper } from "@/components/sections/flights/flight_detail_wrapper"
import { FlightSearchParams } from "@/types/flight_type"

const FlightDetailPage = async ({searchParams}: FlightSearchParams) => {
  const searchProps = await searchParams
  return (
    <FlightDetailWrapper />
  )
}

export default FlightDetailPage