import { AirportProps } from "@/types/flight_type";

type FlightSuggestionsProps = {
  airports: AirportProps[];
};

export const FlightSuggestions = ({ airports }: FlightSuggestionsProps) => {
  return (
    <ul
      className={`${
        airports.length === 0 ? "h-auto" : "max-h-[300px]"
      } absolute w-full bg-white shadow-light left-0 right-0 z-20 font-montserrat text-blackish-green rounded-sm overflow-y-auto p-4 flex flex-col gap-y-3`}
    >
      {airports.length === 0 ? (
        <li className="font-semibold text-lg text-red-500">
          No airports found
        </li>
      ) : (
        airports.map((airport) => (
          <li className="flex flex-col gap-2 p-2 hover:bg-mint-green-100 cursor-pointer rounded-sm" key={airport.airport_code}>
            <h4 className="font-semibold text-blackish-green-10">
              {airport.airport_name},{" "}
              <span className="text-blackish-green-10/40">
                {airport.airport_code}
              </span>
            </h4>
            <small className="text-blackish-green-10 text-sm">
              {airport.city}, {airport.country}
            </small>
          </li>
        ))
      )}
    </ul>
  );
};
