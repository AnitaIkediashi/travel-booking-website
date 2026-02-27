import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";

type FlightDetailWrapperProps = {
  offers: NewFlightOffer[] | undefined;
};

export const FlightDetailWrapper = async ({offers}: FlightDetailWrapperProps) => {
  if (!offers || offers.length === 0) return;
  const departAirportCode = offers[0].segments[0].departure_airport_code

  const arrivalAirportCode = offers[0].segments[0].arrival_airport_code;

  const departCityAndCountry = await fetchCountryName(departAirportCode)

  const arrivalCityAndCountry = await fetchCountryName(arrivalAirportCode)

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between"></div>
      </div>
    </section>
  );
}
