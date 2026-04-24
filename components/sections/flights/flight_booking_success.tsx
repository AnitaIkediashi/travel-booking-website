import { FlightDesc } from "@/components/icons/flight_desc";
import { ShareIcon } from "@/components/icons/share";
import { Button } from "@/components/reusable/button";
import { formatDateTime } from "@/helpers/convertNumberToTime";
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";

type FlightBookingSuccessProps = {
  offers: NewFlightOffer[] | undefined;
  totalTravelers: number;
    cardName: string;
};

export const FlightBookingSuccess = async ({
  offers,
  cardName,
  totalTravelers,
}: FlightBookingSuccessProps) => {
  if (!offers || offers.length === 0) return;

  const segments = offers[0].segments;

  const departAirportCode = segments[0].departure_airport_code;

  const arrivalAirportCode = segments[segments.length - 1].arrival_airport_code;

  const departCityAndCountry = await fetchCountryName(departAirportCode);

  const arrivalCityAndCountry = await fetchCountryName(arrivalAirportCode);

  const priceInfoObj = offers[0].price_breakdown;
  const totalPrice = priceInfoObj?.total?.amount;

  const cabin = offers[0].branded_fareinfo?.cabin_class;

  const departTime = formatDateTime(segments[0].departure_time);

  const arrivalTime = formatDateTime(
    segments[segments.length - 1].arrival_time,
  );

  const totalLegs =
    segments?.reduce((acc, segment) => acc + (segment.legs?.length ?? 0), 0) ??
    0;

  const stopCount = Math.max(0, totalLegs - 1);

  const stopLabel =
    stopCount === 0 ? "non stop" : stopCount === 1 ? "1 stop" : "2 stop";

  const flightNumber = segments[0]?.legs?.[0]?.flight_info?.flight_number ?? "N/A";

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div className="flex flex-col gap-y-2">
            <div className="flex">
              <div className="flex flex-col">
                <p className="font-bold md:text-2xl text-lg">
                  {departCityAndCountry?.city} ({departAirportCode})
                </p>
                <small className="text-blackish-green/75 font-medium text-sm">
                  {departCityAndCountry?.country}
                </small>
              </div>
              <span className="mx-4">-</span>
              <div className="flex flex-col">
                <p className="font-bold md:text-2xl text-lg">
                  {arrivalCityAndCountry?.city} ({arrivalAirportCode})
                </p>
                <small className="text-blackish-green/75 font-medium text-sm">
                  {arrivalCityAndCountry?.country}
                </small>
              </div>
            </div>
            <small className="text-sm text-blackish-green/50">
              {offers[0].trip_type === "round-trip" ? "Round trip" : "One way"}
            </small>
          </div>
          <div className="flex flex-col gap-4">
            <p className="md:text-[32px] text-2xl font-bold text-blackish-green text-right">
              ${totalPrice}
            </p>
            <div className="flex items-center gap-[15px]">
              <Button
                className="h-12 w-12 flex items-center justify-center rounded border border-mint-green-100"
                icon={<ShareIcon />}
              />
              <Button
                type="button"
                label="download"
                className="capitalize w-[150px] h-12 rounded bg-mint-green-100 text-sm font-semibold flex items-center justify-center hover:bg-blackish-green hover:text-white"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-16">
          <div className="flex border rounded-2xl border-[#EAEAEA]">
            <div className="w-1/4 bg-[#EBF6F2] py-[34.5px] px-6 rounded-tl-2xl rounded-bl-2xl">
              <div className="flex flex-col mb-4">
                <p className="text-[32px] font-semibold">{departTime}</p>
                <small className="text-blackish-green/60 font-medium text-xs">
                  {departCityAndCountry?.country} ({departAirportCode})
                </small>
              </div>
              <div className="flex items-center mb-4">
                <FlightDesc />
                <span className="text-xs text-blackish-green/60">
                  {stopLabel}
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-[32px] font-semibold">{arrivalTime}</p>
                <small className="text-blackish-green/60 font-medium text-xs">
                  {arrivalCityAndCountry?.country} ({arrivalAirportCode})
                </small>
              </div>
            </div>
            <div className="w-3/4 grow rounded-tr-2xl rounded-br-2xl flex flex-col">
              <div className="bg-mint-green-100 p-6 flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-xl font-bold capitalize">{cardName}</p>
                  <p className="text-sm capitalize">
                    {totalTravelers}{" "}
                    {totalTravelers === 1 ? "traveler" : "travelers"}
                  </p>
                </div>
                <p className="text-sm font-bold">{cabin} class</p>
              </div>
              <div className="flex-1 bg-white flex flex-col justify-between p-6">
                <div className="flex flex-wrap gap-8"></div>
                <div></div>
              </div>
            </div>
          </div>
          <article></article>
        </div>
      </div>
    </section>
  );
};
