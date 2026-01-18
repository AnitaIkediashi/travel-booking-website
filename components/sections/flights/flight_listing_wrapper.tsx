import { Listings } from "@/components/reusable/listings"
import { FlightDataProps } from "@/types/flight_type";

type FlightListingWrapperProps = {
  data: FlightDataProps[] | undefined
}

export const FlightListingWrapper = ({ data }: FlightListingWrapperProps) => {
  return <Listings data={data} />;
};
