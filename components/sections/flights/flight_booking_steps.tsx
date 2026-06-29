"use client";

import { ConnectivityIcon } from "@/components/icons/connectivity";
import { MealIcon } from "@/components/icons/meal";
import { MediaIcon } from "@/components/icons/media";
import { StandardSeatTypeIcon } from "@/components/icons/standard_seat_type";
import { WideSeatTypeIcon } from "@/components/icons/wide_seat_type";
import { WifiIcon } from "@/components/icons/wifi";
import { BoxShadow } from "@/components/reusable/box_shadow";
import { CardDetails } from "@/components/reusable/card_details";
import {
  formatDateTime,
  formateToReadableDate,
  getDuration,
} from "@/helpers/convertNumberToTime";
import { Leg, NewFlightOffer } from "@/types/flight_type";
import Image from "next/image";
import { useState } from "react";
import { PassengerWrapper } from "./passenger_wrapper";
import { SelectSeatsWrapper } from "./select_seats_wrapper";
import { Stepper } from "@/components/reusable/stepper";

type BookingStepsProps = {
  offer: NewFlightOffer;
  totalTravelers: number;
  segments: SegmentsPropsArray[];
};

type SegmentsPropsArray = {
  departCity: string;
  arrivalCity: string;
  id?: number | undefined;
  segment_id?: string | undefined;
  departure_airport_code?: string | undefined;
  arrival_airport_code?: string | undefined;
  departure_time?: Date | undefined;
  arrival_time?: Date | undefined;
  total_time?: number | undefined;
  legs?: Leg[] | undefined;
};

export const FlightBookingSteps = ({
  offer,
  totalTravelers,
  segments,
}: BookingStepsProps) => {
   const [currentStep, setCurrentStep] = useState(0);

  const priceInfoObj = offer.price_breakdown;
  const totalPrice = priceInfoObj?.total?.amount;
  const basefare = priceInfoObj?.base_fare?.amount;
  const tax = priceInfoObj?.tax?.amount;
  const discount = priceInfoObj?.discount?.amount;

  const newPriceObj = {
    total: {
      currency_code: priceInfoObj?.total?.currency_code,
      amount: priceInfoObj?.total?.amount,
    },
    base_fare: { amount: priceInfoObj?.base_fare?.amount },
    tax: { amount: priceInfoObj?.tax?.amount },
    discount: { amount: priceInfoObj?.discount?.amount },
  };

  const cabin = offer.branded_fareinfo?.cabin_class;

  const featureSrc = (offer.branded_fareinfo?.features || [])
    .map((feature, index) => {
      const { feature_name: name, availability: avail } = feature;
      if (name === "WIFI" && avail === "INCLUDED")
        return <WifiIcon key={`wifi-${index}`} />;
      if (name === "MEAL" && avail === "INCLUDED")
        return <MealIcon key={`meal-${index}`} />;
      if (name === "SEAT TYPE" && avail === "STANDARD")
        return <StandardSeatTypeIcon key={`std-seat-${index}`} />;
      if (
        name === "SEAT TYPE" &&
        (avail === "WIDE" || avail === "FULLY-RECLINED")
      )
        return (
          <WideSeatTypeIcon key={`wide-seat-${index}`} fillColor="#112211" />
        );
      if (name === "CONNECTIVITY" && avail === "INCLUDED")
        return <ConnectivityIcon key={`conn-${index}`} />;
      if (name === "SEATBACK SCREEN" && avail === "INCLUDED")
        return <MediaIcon key={`media-${index}`} />;

      return null;
    })
    .filter(Boolean);

  const totalLegs =
    segments?.reduce((acc, segment) => acc + (segment.legs?.length ?? 0), 0) ??
    0;

  const stopCount = Math.max(0, totalLegs - 1);

  const stopLabel =
    stopCount === 0 ? "non stop" : stopCount === 1 ? "1 stop" : "2 stop";

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <Stepper current={currentStep} />
        <div className="w-full flex lg:flex-row flex-col gap-10">
          <div className="xl:w-[60%] lg:w-[55%] w-full h-fit lg:order-1 order-2 flex flex-col gap-y-10">
            <BoxShadow className="shadow-large p-6">
              <div className="flex flex-col gap-y-6 h-full justify-between">
                {segments.map(async (segment, idx) => {
                  const firstLeg = segment.legs?.[0];
                  const carrier = firstLeg?.carriers?.[0];

                  if (!firstLeg || !carrier) return null;

                  const flightNumber = firstLeg?.flight_info?.flight_number;

                  const departCity = segment.departCity;

                  const arrivalCity = segment.arrivalCity;

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
                        <div className="mt-1.5 flex gap-1.5 items-center">
                          {featureSrc.map((icon, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1.5"
                            >
                              {icon}
                              {/* If it's NOT the last icon, add a separator */}
                              {index < featureSrc.length - 1 && (
                                <span className="h-3 w-px bg-blackish-green/30" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </BoxShadow>
            <BoxShadow className="shadow-large p-4">
              {currentStep === 0 && <PassengerWrapper nextStep={() => goToStep(1)} />}
              {currentStep === 1 && (
                <SelectSeatsWrapper nextStep={() => goToStep(2)} />
              )}
              {currentStep === 2 && (
                <CardDetails priceInfo={newPriceObj} flowType="flight" />
              )}
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
