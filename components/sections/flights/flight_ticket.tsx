"use client";

import { BuildingSingleIcon } from "@/components/icons/building_single";
import { CalenderIcon } from "@/components/icons/calender";
import { FlightDesc } from "@/components/icons/flight_desc";
import { ShareIcon } from "@/components/icons/share";
import { TimeIcon } from "@/components/icons/time";
import { WideSeatTypeIcon } from "@/components/icons/wide_seat_type";
import { BarcodeDisplay } from "@/components/reusable/barcode_to_display";
import { Button } from "@/components/reusable/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

type FlightTicketProps = {
  ticketInfo: TicketInfoProps;
};

type TicketInfoProps = {
  departAirportCode: string | undefined;
  arrivalAirportCode: string | undefined;
  departCity: string | null | undefined;
  departCountry: string | null | undefined;
  arriveCity: string | null | undefined;
  arriveCountry: string | null | undefined;
  departTime: string;
  arrivalTime: string;
  stopLabel: string;
  flightNumber: string;
  dateToDepart: string;
  seatNo: string;
  carrier: string;
  gateType: string;
  tripType: string;
  paymentIntentId: string;
  cardName: string;
  totalTravelers: number;
  cabin: string | undefined;
  totalPrice: number | undefined;
};

export const FlightTicket = ({ ticketInfo }: FlightTicketProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: () => `flight-ticket-${ticketInfo.departAirportCode}-${ticketInfo.arrivalAirportCode}-${ticketInfo.dateToDepart}`,
    
  });

  const flightInfo = [
    {
      id: 1,
      icon: <CalenderIcon />,
      label: "from",
      value: ticketInfo.departCountry,
    },
    {
      id: 2,
      icon: <TimeIcon />,
      label: "depart time",
      value: ticketInfo.dateToDepart,
    },
    {
      id: 3,
      icon: <BuildingSingleIcon />,
      label: "gate",
      value: ticketInfo.gateType,
    },
    {
      id: 4,
      icon: <WideSeatTypeIcon fillColor="#8DD3BB" />,
      label: "seat",
      value: ticketInfo.seatNo,
    },
  ];
  return (
    <div className="md:mb-16 mb-10">
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div className="flex flex-col gap-y-2">
          <div className="flex">
            <div className="flex flex-col">
              <p className="font-bold md:text-2xl text-lg">
                {ticketInfo.departCity} ({ticketInfo.departAirportCode})
              </p>
              <small className="text-blackish-green/75 font-medium text-sm">
                {ticketInfo.departCountry}
              </small>
            </div>
            <span className="mx-4">-</span>
            <div className="flex flex-col">
              <p className="font-bold md:text-2xl text-lg">
                {ticketInfo.arriveCity} ({ticketInfo.arrivalAirportCode})
              </p>
              <small className="text-blackish-green/75 font-medium text-sm">
                {ticketInfo.arriveCountry}
              </small>
            </div>
          </div>
          <small className="text-sm text-blackish-green/50">
            {ticketInfo.tripType}
          </small>
        </div>
        <div className="flex flex-col gap-4">
          <p className="md:text-[32px] text-2xl font-bold text-blackish-green lg:text-right">
            ${ticketInfo.totalPrice}
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
              onClick={reactToPrintFn}
            />
          </div>
        </div>
      </div>
      <div
        className="flex md:flex-row flex-col border rounded-2xl border-[#EAEAEA]"
        ref={contentRef}
      >
        <div className="w-full md:w-1/4 bg-[#EBF6F2] py-[34.5px] px-6 rounded-tl-2xl rounded-bl-2xl flex flex-col justify-between">
          <div className="flex flex-col mb-4">
            <p className="lg:text-[32px] text-2xl font-semibold">
              {ticketInfo.departTime}
            </p>
            <small className="text-blackish-green/60 font-medium text-xs">
              {ticketInfo.departCountry} ({ticketInfo.departAirportCode})
            </small>
          </div>
          <div className="flex items-center mb-4">
            <FlightDesc />
            <span className="text-xs text-blackish-green/60">
              {ticketInfo.stopLabel}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="lg:text-[32px] text-2xl font-semibold">
              {ticketInfo.arrivalTime}
            </p>
            <small className="text-blackish-green/60 font-medium text-xs">
              {ticketInfo.arriveCountry} ({ticketInfo.arrivalAirportCode})
            </small>
          </div>
        </div>
        <div className="w-full md:w-3/4 grow rounded-tr-2xl rounded-br-2xl flex flex-col">
          <div className="bg-mint-green-100 p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-xl font-bold capitalize">
                {ticketInfo.cardName}
              </p>
              <p className="text-sm capitalize">
                {ticketInfo.totalTravelers}{" "}
                {ticketInfo.totalTravelers === 1 ? "traveler" : "travelers"}
              </p>
            </div>
            <p className="text-sm font-bold">{ticketInfo.cabin} class</p>
          </div>
          <div className="flex-1 bg-white flex flex-col justify-between p-6 gap-10">
            <div className="flex w-full md:justify-between gap-8 flex-wrap">
              {flightInfo.map((info) => (
                <div key={info.id} className="flex items-center gap-[5px]">
                  <div className="w-8 h-8 grid place-items-center bg-mint-green-40 rounded">
                    {info.icon}
                  </div>
                  <div className="flex flex-col">
                    <p className="opacity-60 text-sm font-semibold capitalize">
                      {info.label}
                    </p>
                    <small className="text-xs font-medium">{info.value}</small>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex lg:justify-between flex-1 lg:flex-row flex-col">
              <div className="flex flex-col gap-1">
                <p className="text-[32px] font-semibold">
                  {ticketInfo.carrier}
                </p>
                <small className="opacity-60 text-xs">
                  {ticketInfo.flightNumber}
                </small>
              </div>
              <div className="lg:self-end">
                <BarcodeDisplay value={ticketInfo.paymentIntentId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
