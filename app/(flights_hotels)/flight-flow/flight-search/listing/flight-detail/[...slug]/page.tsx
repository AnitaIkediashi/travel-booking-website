import { FlightDetailWrapper } from "@/components/sections/flights/flight_detail_wrapper"
import { queryFlightToken } from "@/helpers/query_flights"
import { FlightSearchParams } from "@/types/flight_type"

const FlightDetailPage = async ({searchParams}: FlightSearchParams) => {
  const searchProps = await searchParams
  const data = await queryFlightToken(searchProps)
  // console.log('data filtered: ', JSON.stringify(data, null, 2))
  return (
    <FlightDetailWrapper />
  )
}

export default FlightDetailPage