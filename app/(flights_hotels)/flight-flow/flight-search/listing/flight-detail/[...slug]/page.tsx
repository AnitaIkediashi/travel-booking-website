import { FlightDetailWrapper } from "@/components/sections/flights/flight_detail_wrapper"
import { queryFlightToken } from "@/helpers/query_flights"
import { FlightSearchParams } from "@/types/flight_type"
import { redirect } from "next/navigation"

const FlightDetailPage = async ({searchParams}: FlightSearchParams) => {
  const searchProps = await searchParams

  const {
    from,
    to,
    depart,
    return: returnDate,
    adults,
    cabin,
    child,
    infant,
    token,
    trip,
  } = searchProps;

  if (!depart) return []; // to check it depart exists or not

  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  const departDate = new Date(depart);

  const isPastDate = departDate < currentDate;

  const isReturnDateValid =
    trip === "round-trip" && returnDate && new Date(returnDate) < departDate;

  const adultCount = +(adults ?? 0)
  const childCount = +(child ?? 0)
  const infantCount = +(infant ?? 0)
  const totalTravelers = adultCount + childCount + infantCount

  const isValidQuery =
      from &&
      to &&
      depart &&
      trip &&
      cabin &&
      token && 
      !isPastDate &&
      !isReturnDateValid &&
      (adultCount > 0 || childCount > 0 || infantCount > 0);
  
    if (!isValidQuery) {
      redirect("/flight-flow/flight-search/listing");
    }

  const data = await queryFlightToken(searchProps)
  
  return (
    <FlightDetailWrapper offers={data} totalTravelers={totalTravelers} searchProps={searchProps} />
  )
}

export default FlightDetailPage