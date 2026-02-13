import { FlightListingWrapper } from "@/components/sections/flights/flight_listing_wrapper";
import { queryFlightData } from "@/helpers/query_flights";
import { FlightSearchParams } from "@/types/flight_type";


const FlightListingPage = async ({ searchParams }: FlightSearchParams) => {
  const searchProps = await searchParams;
  // console.log('search params: ', searchProps)
  const data = await queryFlightData(searchProps);
  // console.log('data response: ', JSON.stringify(data, null, 2))
  return <FlightListingWrapper data={data} />;
};
export default FlightListingPage