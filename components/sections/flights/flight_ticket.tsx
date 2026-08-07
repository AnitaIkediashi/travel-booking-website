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
import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * Note: I had to use default style attribute for the print of the content ref-
 * for it to work properly due to html2canvas does not support external css - recent version of tailwind
 * I had to use react-to-print library to handle the print functionality and used the custom print function to generate the pdf using jsPDF and html2canvas, this is because react-to-print shows the native print window box before downloading the pdf, and I wanted to directly download the pdf without showing the print window, using html2canvas to capture the content of the ticket and then generate a pdf using jsPDF.
 */

type FlightTicketProps = {
  ticketInfo: TicketInfoProps;
};

type PassengerSeat = {
  name: string;
  seatNo: string;
};

type LegGate = {
  from: string | undefined;
  to: string | undefined;
  departureGate: string;
  arrivalGate: string;
};

type SegmentDetail = {
  sliceIndex: number | undefined;
  departAirportCode: string | undefined;
  arrivalAirportCode: string | undefined;
  departTime: string;
  arrivalTime: string;
  dateToDepart: string;
  dateToArrive: string;
  flightNumber: string;
  carrier: string;
  stopLabel: string;
  gateType: string;
  legGates: LegGate[];
};

type TicketInfoProps = {
  departAirportCode: string | undefined;
  arrivalAirportCode: string | undefined;
  departCity: string | null | undefined;
  departCountry: string | null | undefined;
  arriveCity: string | null | undefined;
  arriveCountry: string | null | undefined;
  tripType: string;
  paymentIntentId: string;
  totalTravelers: number;
  cabin: string | undefined;
  totalPrice: number | undefined;
  passengerNames: string[];
  passengerSeats: PassengerSeat[]; 
  segmentDetails: SegmentDetail[]; 
};

export const FlightTicket = ({ ticketInfo }: FlightTicketProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: () =>
      `flight-ticket-${ticketInfo.departAirportCode}-${ticketInfo.arrivalAirportCode}-${ticketInfo.segmentDetails[0]?.dateToDepart}`,
    print: async (printIframe: HTMLIFrameElement) => {
      const iframeDocument = printIframe.contentDocument;
      if (iframeDocument) {
        const targetElement =
          (iframeDocument.body.firstElementChild as HTMLElement) ||
          iframeDocument.body;

        try {
          await new Promise((resolve) => setTimeout(resolve, 150));

          const canvas = await html2canvas(targetElement, {
            scale: 2,
            useCORS: true,
            logging: false,
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "l",
            unit: "mm",
            format: "a4",
          });

          // 1. Define your margin (in mm)
          const margin = 10;

          // 2. Calculate available space (Page size minus margins on both sides)
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;

          // 3. Calculate the image ratio to fit within the "available space"
          const imgProps = pdf.getImageProperties(imgData);
          const ratio = Math.min(
            maxWidth / imgProps.width,
            maxHeight / imgProps.height,
          );

          const finalWidth = imgProps.width * ratio;
          const finalHeight = imgProps.height * ratio;

          // 4. Center the image in the remaining space
          // (Page width - image width) / 2 creates equal margins
          const xCoordinate = (pageWidth - finalWidth) / 2;
          const yCoordinate = (pageHeight - finalHeight) / 2;

          pdf.addImage(
            imgData,
            "PNG",
            xCoordinate,
            yCoordinate,
            finalWidth,
            finalHeight,
          );
          pdf.save(
            `ticket-${ticketInfo.paymentIntentId}-${ticketInfo.segmentDetails[0]?.dateToDepart}-${ticketInfo.departAirportCode}-${ticketInfo.arrivalAirportCode}.pdf`,
          );
        } catch (error) {
          console.error("PDF Generation Error:", error);
        } finally {
          setIsDownloading(false); 
        }
      } else {
        setIsDownloading(false);
      }
    },
  });

   const handleDownloadClick = () => {
     setIsDownloading(true);
     reactToPrintFn();
   };

  const outboundFlightNumber = ticketInfo.segmentDetails.find(
    (s) => s.sliceIndex === 0,
  )?.flightNumber;

  const inboundFlightNumber = ticketInfo.segmentDetails.find(
    (s) => s.sliceIndex === 1,
  )?.flightNumber;

  const flightNumberLabel =
    ticketInfo.tripType === "Round trip" && inboundFlightNumber
      ? `Flights ${outboundFlightNumber} / ${inboundFlightNumber}`
      : `Flight ${outboundFlightNumber}`;

   const handleCopyLink = async () => {
     const shareText = `My flight: ${ticketInfo.departAirportCode} → ${ticketInfo.arrivalAirportCode} on ${ticketInfo.tripType === "Round trip" ? `${ticketInfo.segmentDetails[0]?.dateToDepart} to ${ticketInfo.segmentDetails[0]?.dateToArrive}` : ticketInfo.segmentDetails[0]?.dateToDepart}. ${flightNumberLabel}.`;

     try {
       await navigator.clipboard.writeText(shareText);
       setCopied(true);
       setTimeout(() => setCopied(false), 2000);
     } catch (err) {
       console.error("Copy failed:", err);
     }
   };

   const handleShareClick = async () => {
     const shareText = `My flight: ${ticketInfo.departAirportCode} → ${ticketInfo.arrivalAirportCode} on ${ticketInfo.tripType === "Round trip" ? `${ticketInfo.segmentDetails[0]?.dateToDepart} to ${ticketInfo.segmentDetails[0]?.dateToArrive}` : ticketInfo.segmentDetails[0]?.dateToDepart}. ${flightNumberLabel}.`;

     if (navigator.share) {
       try {
         await navigator.share({ title: "My Flight Ticket", text: shareText });
       } catch (err) {
         if ((err as Error).name !== "AbortError") {
           console.error("Share failed:", err);
         }
       }
     } else {
       await handleCopyLink();
     }
   };

  return (
    <div className="md:mb-16 mb-10">
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col md:flex-row">
            <div className="flex flex-col">
              <p className="font-bold md:text-2xl text-lg">
                {ticketInfo.departCity} ({ticketInfo.departAirportCode})
              </p>
              <small className="text-blackish-green/75 font-medium text-sm">
                {ticketInfo.departCountry}
              </small>
            </div>
            <span className="md:mx-4">-</span>
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
            {ticketInfo.tripType} &#8594;{" "}
            <span className="ml-2">
              {ticketInfo.totalTravelers} traveler
              {ticketInfo.totalTravelers === 1 ? "" : "s"}
            </span>
          </small>
        </div>
        <div className="flex flex-col gap-4">
          <p className="md:text-[32px] text-2xl font-bold text-blackish-green lg:text-right">
            ${ticketInfo.totalPrice}
          </p>
          <div className="flex items-center gap-[15px]">
            <Button
              className={`h-12 w-12 flex items-center justify-center rounded border border-mint-green-100 ${
                copied
                  ? "border-mint-green-100/50 bg-mint-green-100/50 cursor-not-allowed pointer-events-none"
                  : "hover:bg-mint-green-50"
              }`}
              type="button"
              icon={<ShareIcon />}
              onClick={handleShareClick}
            />
            <Button
              type="button"
              label={isDownloading ? "downloading..." : "download"}
              disabled={isDownloading}
              className={`capitalize w-[150px] h-12 rounded text-sm font-semibold flex items-center justify-center transition-colors
                ${
                  isDownloading
                    ? "bg-mint-green-100/50 text-blackish-green/50 cursor-not-allowed"
                    : "bg-mint-green-100 hover:bg-blackish-green hover:text-white"
                }`}
              onClick={handleDownloadClick}
            />
          </div>
        </div>
      </div>

      {/* contentRef wraps EVERYTHING so print/PDF captures all passengers and all segments */}
      <div className="flex flex-col gap-y-10" ref={contentRef}>
        {ticketInfo.passengerNames.map((passenger, pIndex) => {
          const seatNo =
            ticketInfo.passengerSeats[pIndex]?.seatNo ?? "Not assigned";

          return (
            <div key={pIndex} className="flex flex-col gap-y-5">
              {ticketInfo.segmentDetails.map((segment, sIndex) => {
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
                    value: segment.dateToDepart,
                  },
                  {
                    id: 3,
                    icon: <BuildingSingleIcon />,
                    label: "gate",
                    value: segment.gateType,
                  },
                  {
                    id: 4,
                    icon: <WideSeatTypeIcon fillColor="#8DD3BB" />,
                    label: "seat",
                    value: seatNo,
                  },
                ];

                return (
                  <div key={sIndex} className="flex flex-col gap-y-3">
                    {ticketInfo.segmentDetails.length > 1 && (
                      <p className="text-xs font-semibold uppercase opacity-60">
                        {segment.sliceIndex === 0 ? "Outbound" : "Return"}
                      </p>
                    )}

                    <div
                      className="flex md:flex-row flex-col border rounded-2xl"
                      style={{ borderColor: "#EAEAEA" }}
                    >
                      <div
                        className="w-full md:w-1/4 py-[34.5px] px-6 rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl flex flex-col justify-between"
                        style={{ backgroundColor: "#EBF6F2" }}
                      >
                        <div className="flex flex-col mb-4">
                          <p className="lg:text-[32px] text-2xl font-semibold">
                            {segment.departTime}
                          </p>
                          <small
                            className="font-medium text-xs"
                            style={{ opacity: "60%" }}
                          >
                            {segment.departAirportCode}
                          </small>
                        </div>
                        <div className="flex items-center mb-4">
                          <FlightDesc />
                          <span className="text-xs" style={{ opacity: "60%" }}>
                            {segment.stopLabel}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <p className="lg:text-[32px] text-2xl font-semibold">
                            {segment.arrivalTime}
                          </p>
                          <small
                            className="font-medium text-xs"
                            style={{ opacity: "60%" }}
                          >
                            {segment.arrivalAirportCode}
                          </small>
                        </div>
                      </div>
                      <div className="w-full md:w-3/4 grow rounded-tr-2xl rounded-br-2xl flex flex-col">
                        <div
                          className="p-6 flex items-center justify-between md:rounded-tr-2xl"
                          style={{ backgroundColor: "#8dd3bb" }}
                        >
                          <div className="flex flex-col">
                            <p className="text-xl font-bold capitalize">
                              {passenger}
                            </p>
                          </div>
                          <p className="text-sm font-bold">
                            {ticketInfo.cabin} class
                          </p>
                        </div>
                        <div
                          className="flex-1 flex flex-col justify-between p-6 gap-10"
                          style={{ backgroundColor: "#fff" }}
                        >
                          <div className="flex w-full md:justify-between gap-8 flex-wrap">
                            {flightInfo.map((info) => (
                              <div
                                key={info.id}
                                className="flex items-center gap-[5px]"
                              >
                                <div
                                  className="w-8 h-8 grid place-items-center rounded"
                                  style={{ backgroundColor: "#ebf6f2" }}
                                >
                                  {info.icon}
                                </div>
                                <div className="flex flex-col">
                                  <p className="opacity-60 text-sm font-semibold capitalize">
                                    {info.label}
                                  </p>
                                  <small className="text-xs font-medium">
                                    {info.value}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex lg:justify-between flex-1 lg:flex-row flex-col">
                            <div className="flex flex-col gap-1">
                              <p className="text-[32px] font-semibold">
                                {segment.carrier}
                              </p>
                              <small className="opacity-60 text-xs">
                                {segment.flightNumber}
                              </small>
                            </div>
                            <div className="lg:self-end">
                              <BarcodeDisplay
                                value={ticketInfo.paymentIntentId}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {segment.legGates.length > 1 && (
                      <div
                        className="border rounded-2xl p-6 flex flex-col gap-3"
                        style={{
                          borderColor: "#EAEAEA",
                          backgroundColor: "#FFF9EB",
                        }}
                      >
                        <p className="text-sm font-semibold">
                          This leg has a connection — check your gate at each
                          stop
                        </p>
                        {segment.legGates.map((leg, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm flex-wrap gap-2"
                          >
                            <span className="font-medium">
                              {leg.from} &#8594; {leg.to}
                            </span>
                            <span className="opacity-75">
                              Board at gate {leg.departureGate}
                              {i < segment.legGates.length - 1 &&
                                ` · Arrive gate ${leg.arrivalGate}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
