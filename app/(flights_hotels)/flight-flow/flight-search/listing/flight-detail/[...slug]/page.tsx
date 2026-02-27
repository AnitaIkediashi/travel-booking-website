import { FlightDetailWrapper } from "@/components/sections/flights/flight_detail_wrapper"
import { queryFlightToken } from "@/helpers/query_flights"
import { FlightSearchParams } from "@/types/flight_type"

const FlightDetailPage = async ({searchParams}: FlightSearchParams) => {
  const searchProps = await searchParams
  const adultCount = +(searchProps.adults ?? 0)
  const childCount = +(searchProps.child ?? 0)
  const infantCount = +(searchProps.infant ?? 0)
  const totalTravelers = adultCount + childCount + infantCount
  const data = await queryFlightToken(searchProps)
  
  return (
    <FlightDetailWrapper offers={data} totalTravelers={totalTravelers} />
  )
}

export default FlightDetailPage