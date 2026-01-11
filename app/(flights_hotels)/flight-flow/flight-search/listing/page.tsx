import { searchParams } from "@/types/flight_type";


const FlightListingPage = async ({ searchParams }: searchParams) => {
  const { from } = await searchParams;
  return <div>FlightListingPage</div>;
};

export default FlightListingPage