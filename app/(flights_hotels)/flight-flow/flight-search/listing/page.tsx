import { FlightListingWrapper } from "@/components/sections/flights/flight_listing_wrapper";
import { queryFlightData } from "@/helpers/query_flights";
import { FlightSearchParams } from "@/types/flight_type";


const FlightListingPage = async ({ searchParams }: FlightSearchParams) => {
  const searchProps = await searchParams;
  const data = await queryFlightData(searchProps);
  return <FlightListingWrapper data={data} />;
};
export default FlightListingPage