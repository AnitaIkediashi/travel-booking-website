import { BoxShadow } from "@/components/reusable/box_shadow";
import { Button } from "@/components/reusable/button";
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";
import Image from "next/image";

type FlightDetailWrapperProps = {
  offers: NewFlightOffer[] | undefined;
  totalTravelers: number;
};

export const FlightDetailWrapper = async ({
  offers,
  totalTravelers,
}: FlightDetailWrapperProps) => {
  if (!offers || offers.length === 0) return;
  const departAirportCode = offers[0].segments[0].departure_airport_code;

  const arrivalAirportCode = offers[0].segments[0].arrival_airport_code;

  const departCityAndCountry = await fetchCountryName(departAirportCode);

  const arrivalCityAndCountry = await fetchCountryName(arrivalAirportCode);

  const totalPrice = offers[0].price_breakdown?.total?.amount;

  const cabin = offers[0].branded_fareinfo?.cabin_class;

  const features = offers[0].branded_fareinfo?.features

  const segments = offers[0].segments

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex flex-col gap-y-2">
            <div className="flex">
              <div className="flex flex-col">
                <p className="font-bold md:text-2xl text-lg">
                  {departCityAndCountry?.city}
                </p>
                <small className="text-blackish-green/75 font-medium text-sm">
                  {departCityAndCountry?.country}
                </small>
              </div>
              <span className="mx-4">-</span>
              <div className="flex flex-col">
                <p className="font-bold md:text-2xl text-lg">
                  {arrivalCityAndCountry?.city}
                </p>
                <small className="text-blackish-green/75 font-medium text-sm">
                  {arrivalCityAndCountry?.country}
                </small>
              </div>
            </div>
            <small className="text-sm text-blackish-green/50">{offers[0].trip_type === 'round-trip' ? 'Round trip' : 'One way'}</small>
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[32px] text-2xl font-bold text-salmon-100">
              ${totalPrice}
            </p>
            <Button
              type="button"
              label="Book now"
              className="w-[150px] h-12 rounded bg-mint-green-100 text-sm font-semibold flex items-center justify-center hover:bg-blackish-green hover:text-white"
            />
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-6">
          <BoxShadow className="shadow-large p-6 lg:w-[60%] w-full">
            <div className="flex flex-col pb-5 border-b border-b-blackish-green/45 mb-6">
              <p className="font-semibold text-lg">{cabin}</p>
              <p className="text-sm font-medium capitalize text-blackish-green/75">
                {totalTravelers}{" "}
                {totalTravelers === 1 ? "traveler" : "travelers"}
              </p>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              {features?.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Image
                    src={
                      feature.availability === "INCLUDED"
                        ? "/flights/check-mark.png"
                        : "/flights/optional_mark_in_circle.png"
                    }
                    alt={
                      feature.availability === "INCLUDED"
                        ? "Included feature"
                        : "Optional feature"
                    }
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-medium ml-2">
                    {feature.feature_name}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm">
              {" "}
              Seats available: {offers[0].seat_availability?.seats_left}
            </p>
          </BoxShadow>
          <BoxShadow className="shadow-large p-6 lg:w-[40%] w-full">
            <div className="flex flex-col gap-y-6">
              {segments.map((segment, idx) => {
                const stopCount = segment.legs?.length ?? 0;
                const stopLabel =
                  stopCount <= 1
                    ? "non stop"
                    : `${stopCount - 1} Stop${stopCount > 2 ? "s" : ""}`;

                const firstLeg = segment.legs?.[0];
                const carrier = firstLeg?.carriers?.[0];

                const flightNumber = firstLeg?.flight_info?.flight_number;
                return (
                  <div
                    key={idx}
                    className="border rounded-md border-blackish-green/45 p-6"
                  ></div>
                );
              })}
            </div>
          </BoxShadow>
        </div>
      </div>
    </section>
  );
};
