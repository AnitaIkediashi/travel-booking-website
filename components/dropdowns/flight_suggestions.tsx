import { AirportProps } from "@/types/flight_type"

type FlightSuggestionsProps = {
    airports: AirportProps[]
}

export const FlightSuggestions = ({ airports }: FlightSuggestionsProps) => {
  return (
    <ul
      className={`${
        airports.length === 0 ? "h-auto" : "max-h-[300px]"
      } absolute w-full bg-white shadow-light left-0 right-0 z-20 font-montserrat text-blackish-green rounded-sm overflow-y-auto p-4`}
    >
      flight_suggestions
    </ul>
  );
}
