import { FlightDataProps } from "@/types/flight_type";

type FlightFilterProps = {
  isPending: boolean;
  data: FlightDataProps[] | undefined
};

export const FlightDataFilters = ({isPending, data}: FlightFilterProps) => {
  return (
    <>
      {
        isPending ? 'loading...' : <section>hello world</section>
      }
    </>
  )
}
