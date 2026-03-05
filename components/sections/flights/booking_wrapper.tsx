import { MealIcon } from "@/components/icons/meal";
import { WifiIcon } from "@/components/icons/wifi";
import { AddCard } from "@/components/reusable/add_card";
import { BoxShadow } from "@/components/reusable/box_shadow";
import {
  formatDateTime,
  formateToReadableDate,
  getDuration,
} from "@/helpers/convertNumberToTime";
import { fetchCountryName } from "@/helpers/query_flights";
import { NewFlightOffer } from "@/types/flight_type";
import Image from "next/image";

type BookingWrapperProps = {
  offers: NewFlightOffer[] | undefined;
  totalTravelers: number;
};

export const BookingWrapper = async ({
  offers,
  totalTravelers,
}: BookingWrapperProps) => {
  if (!offers || offers.length === 0) return;

  const totalPrice = offers[0].price_breakdown?.total?.amount;
  const basefare = offers[0].price_breakdown?.base_fare?.amount;
  const tax = offers[0].price_breakdown?.tax?.amount;
  const discount = offers[0].price_breakdown?.discount?.amount;

  const cabin = offers[0].branded_fareinfo?.cabin_class;

  const segments = offers[0].segments;

  const featureSrc = offers[0].branded_fareinfo?.features?.flatMap(
    (feature, index) =>
      feature.feature_name === "WIFI" && feature.availability === "INCLUDED" ? (
        <WifiIcon key={index} />
      ) : feature.feature_name === "MEAL" &&
        feature.availability === "INCLUDED" ? (
        <MealIcon key={index} />
      ) : (
        []
      ),
  );

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="w-full flex lg:flex-row flex-col gap-10">
          <div className="xl:w-[60%] lg:w-[55%] w-full h-fit lg:order-1 order-2">
            <BoxShadow className="shadow-large p-6">
              <div className="flex flex-col gap-y-6 h-full justify-between">
                {segments.map(async (segment, idx) => {
                  const stopCount = segment.legs?.length ?? 0;
                  const stopLabel =
                    stopCount <= 1
                      ? "non stop"
                      : `${stopCount - 1} Stop${stopCount > 2 ? "s" : ""}`;

                  const firstLeg = segment.legs?.[0];
                  const carrier = firstLeg?.carriers?.[0];

                  if (!firstLeg || !carrier) return null;

                  const flightNumber = firstLeg?.flight_info?.flight_number;

                  const departCity = await fetchCountryName(
                    segment.departure_airport_code,
                  ).then((data) => data?.city);

                  const arrivalCity = await fetchCountryName(
                    segment.arrival_airport_code,
                  ).then((data) => data?.city);

                  return (
                    <div
                      key={idx}
                      className="border rounded-md border-blackish-green/45 p-6"
                    >
                      <div className="flex gap-2 pb-4 border-b border-blackish-green/40">
                        <Image
                          src={
                            carrier.logo?.trim() ||
                            "/flights/airplane-ticket.png"
                          }
                          alt={`${carrier.name} logo`}
                          width={60}
                          height={30}
                          loading="eager"
                          className="w-10 h-10"
                        />
                        <div className="flex flex-col gap-y-1.5">
                          <p className="font-semibold">
                            {segment.departure_airport_code} ({departCity})
                            &#8594; {segment.arrival_airport_code} (
                            {arrivalCity})
                          </p>
                          <span className="inline-block">
                            {formateToReadableDate(segment.departure_time)}
                          </span>
                          <p className="text-sm font-medium opacity-78 hidden md:block">
                            {stopLabel} •{" "}
                            <span className="inline-block">
                              {getDuration(
                                segment.departure_time,
                                segment.arrival_time,
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="pt-4">
                        <div className="flex gap-1.5">
                          <p className="font-semibold">
                            {formatDateTime(segment.departure_time)} -{" "}
                            {formatDateTime(segment.arrival_time)}{" "}
                          </p>
                          <span>
                            (
                            {getDuration(
                              segment.departure_time,
                              segment.arrival_time,
                            )}
                            )
                          </span>
                        </div>
                        <small className="my-0.5 block opacity-78 font-medium">
                          {carrier.name}
                        </small>
                        <small className="opacity-78 font-medium border p-1.5 rounded block mt-1 border-blackish-green/30 w-fit">
                          {flightNumber}
                        </small>
                        <div className="mt-1.5 flex gap-1.5">{featureSrc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </BoxShadow>
            <BoxShadow className="shadow-large p-6">
              <AddCard />
            </BoxShadow>
          </div>
          <div className="xl:w-[40%] lg:w-[45%] w-full lg:order-2 order-1">
            <BoxShadow className="shadow-large p-6">
              <div className="w-full">
                <div className="pb-4 border-b-[0.5px] border-b-blackish-green/25 mb-4">
                  <h4 className="font-bold mb-0.5">Price Details</h4>
                  <p className="font-medium mb-0.5">{cabin}</p>
                  <p className="font-medium opacity-75">
                    {totalTravelers}{" "}
                    {totalTravelers === 1 ? "traveler" : "travelers"}
                  </p>
                </div>
                <div className="w-full pb-4 mb-4 border-b-[0.5px] border-b-blackish-green/25">
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-medium capitalize">base fare</span>
                    <span className="font-semibold">${basefare}</span>
                  </div>
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-medium capitalize">tax</span>
                    <span className="font-semibold">${tax}</span>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="font-medium capitalize">discount</span>
                    <span className="font-semibold">${discount}</span>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="font-medium capitalize">total</span>
                  <span className="font-semibold">${totalPrice}</span>
                </div>
              </div>
            </BoxShadow>
          </div>
        </div>
      </div>
    </section>
  );
};
