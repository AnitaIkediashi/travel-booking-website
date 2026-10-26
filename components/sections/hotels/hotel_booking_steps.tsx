"use client";

import { BoxShadow } from "@/components/reusable/box_shadow";
import { CardDetails } from "@/components/reusable/card_details";
import { Stepper } from "@/components/reusable/stepper";
import { formateToReadableDate } from "@/helpers/convertNumberToTime";
import { HOTEL_STEP_LABELS } from "@/utils/stepper_variables";
import type { Hotels, Rooms } from "@/app/generated/prisma/client";
import Image from "next/image";
import { useState } from "react";
import { GuestWrapper } from "./guest_wrapper";

type HotelBookingStepsProps = {
  hotel: Hotels;
  room: Rooms;
  booking: {
    id: string;
    totalGuests: number;
    currencyCode: string;
    currencySymbol: string;
    rooms: {
      id: string;
      roomType: string;
      bedCount: number;
      sizeSqft: number | null;
      checkin: Date;
      checkout: Date;
    }[];
    pricing: { base: number; tax: number; discount: number; total: number };
  };
};

export const HotelBookingSteps = ({
  hotel,
  room,
  booking,
}: HotelBookingStepsProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const { totalGuests, currencySymbol, pricing } = booking;
  const roomCount = booking.rooms.length;
  const { checkin, checkout } = booking.rooms[0];

  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkout).getTime() - new Date(checkin).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  // The payment actions compute base + tax + discount + seatFees, so the
  // discount is passed negative to land on room_fee_total.
  const priceInfo = {
    currency_code: booking.currencyCode,
    total_amount: pricing.total,
    base_amount: pricing.base,
    tax_amount: pricing.tax,
    discount_amount: -pricing.discount,
    seat_fees_total: 0,
  };

  const location = [hotel.city, hotel.state, hotel.country]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <Stepper current={currentStep} labels={HOTEL_STEP_LABELS} />
        <div className="w-full flex lg:flex-row flex-col gap-10">
          <div className="xl:w-[60%] lg:w-[55%] w-full h-fit lg:order-1 order-2 flex flex-col gap-y-10">
            <BoxShadow className="shadow-large p-6">
              <div className="border rounded-md border-blackish-green/45 p-6">
                <div className="flex gap-3 pb-4 border-b border-blackish-green/40">
                  <Image
                    src={
                      hotel.thumb_nails[0]?.trim() ||
                      "/hotels/hotel-placeholder.png"
                    }
                    alt={hotel.name}
                    width={96}
                    height={72}
                    loading="eager"
                    className="w-24 h-[72px] object-cover rounded"
                  />
                  <div className="flex flex-col gap-y-1.5">
                    <p className="font-semibold">{hotel.name}</p>
                    <p className="text-sm font-medium opacity-78">{location}</p>
                    <p className="text-sm font-medium opacity-78 hidden md:block">
                      {nights} {nights === 1 ? "night" : "nights"} • {roomCount}{" "}
                      {roomCount === 1 ? "room" : "rooms"} • {totalGuests}{" "}
                      {totalGuests === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-75 font-medium">Check-in</p>
                    <p className="font-semibold">
                      {formateToReadableDate(checkin)}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-75 font-medium">Check-out</p>
                    <p className="font-semibold">
                      {formateToReadableDate(checkout)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {booking.rooms.map((r) => (
                    <small
                      key={r.id}
                      className="opacity-78 font-medium border p-1.5 rounded block border-blackish-green/30 w-fit"
                    >
                      {r.roomType} • {r.bedCount}{" "}
                      {r.bedCount === 1 ? "bed" : "beds"}
                      {r.sizeSqft ? ` • ${r.sizeSqft} sqft` : ""}
                    </small>
                  ))}
                </div>
              </div>
            </BoxShadow>

            <BoxShadow className="shadow-large p-4">
              <div className={currentStep === 0 ? "" : "hidden"}>
                <GuestWrapper
                  nextStep={() => setCurrentStep(1)}
                  totalGuests={totalGuests}
                  bookingId={booking.id}
                />
              </div>
              {currentStep === 1 && (
                <CardDetails
                  priceInfo={priceInfo}
                  flowType="hotel"
                  bookingId={booking.id}
                  liveSeatFeesTotal={0}
                />
              )}
            </BoxShadow>
          </div>

          <div className="xl:w-[40%] lg:w-[45%] w-full lg:order-2 order-1">
            <BoxShadow className="shadow-large p-6">
              <div className="w-full">
                <div className="pb-4 border-b-[0.5px] border-b-blackish-green/25 mb-4">
                  <h4 className="font-bold mb-0.5">Price Details</h4>
                  <p className="font-medium mb-0.5">
                    {room.room_type}
                    {roomCount > 1 ? ` + ${roomCount - 1} more` : ""}
                  </p>
                  <p className="font-medium opacity-75">
                    {nights} {nights === 1 ? "night" : "nights"} • {totalGuests}{" "}
                    {totalGuests === 1 ? "guest" : "guests"}
                  </p>
                </div>
                <div className="w-full pb-4 mb-4 border-b-[0.5px] border-b-blackish-green/25">
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-medium capitalize">base fare</span>
                    <span className="font-semibold">
                      {currencySymbol}
                      {pricing.base}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="font-medium capitalize">taxes</span>
                    <span className="font-semibold">
                      {currencySymbol}
                      {pricing.tax}
                    </span>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="w-full flex items-center justify-between">
                      <span className="font-medium capitalize">discount</span>
                      <span className="font-semibold">
                        -{currencySymbol}
                        {pricing.discount}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="font-medium capitalize">total</span>
                  <span className="font-semibold">
                    {currencySymbol}
                    {pricing.total}
                  </span>
                </div>
              </div>
            </BoxShadow>
          </div>
        </div>
      </div>
    </section>
  );
};
