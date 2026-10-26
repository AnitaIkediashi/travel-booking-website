"use client";

import { BuildingSingleIcon } from "@/components/icons/building_single";
import { CalenderIcon } from "@/components/icons/calender";
import { ShareIcon } from "@/components/icons/share";
import { TimeIcon } from "@/components/icons/time";
import { BarcodeDisplay } from "@/components/reusable/barcode_to_display";
import { Button } from "@/components/reusable/button";
import { useReactToPrint } from "react-to-print";
import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

type RoomDetail = {
  id: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  nights: number;
};

type HotelTicketInfo = {
  hotelName: string;
  city: string;
  country: string;
  location: string;
  paymentIntentId: string;
  totalGuests: number;
  totalRooms: number;
  totalPrice: number;
  currencySymbol: string;
  guestNames: string[];
  roomDetails: RoomDetail[];
};

type HotelTicketProps = {
  ticketInfo: HotelTicketInfo;
};

export const HotelTicket = ({ ticketInfo }: HotelTicketProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const first = ticketInfo.roomDetails[0];

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: () =>
      `hotel-reservation-${ticketInfo.hotelName}-${first?.checkInDate}`,
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

          const margin = 10;
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;

          const imgProps = pdf.getImageProperties(imgData);
          const ratio = Math.min(
            maxWidth / imgProps.width,
            maxHeight / imgProps.height,
          );

          const finalWidth = imgProps.width * ratio;
          const finalHeight = imgProps.height * ratio;
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
            `reservation-${ticketInfo.paymentIntentId}-${first?.checkInDate}-${ticketInfo.hotelName}.pdf`,
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

  const shareText = `My stay: ${ticketInfo.hotelName}, ${ticketInfo.location}. ${first?.checkInDate} to ${first?.checkOutDate} (${first?.nights} night${first?.nights === 1 ? "" : "s"}).`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Hotel Reservation",
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      await handleCopyLink();
    }
  };

  const leadGuest = ticketInfo.guestNames[0] ?? "Guest";

  return (
    <div className="md:mb-16 mb-10">
      <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div className="flex flex-col gap-y-2">
          <p className="font-bold md:text-2xl text-lg">
            {ticketInfo.hotelName}
          </p>
          <small className="text-blackish-green/75 font-medium text-sm">
            {ticketInfo.city}, {ticketInfo.country}
          </small>
          <small className="text-sm text-blackish-green/50">
            {ticketInfo.totalRooms} room{ticketInfo.totalRooms === 1 ? "" : "s"}{" "}
            &#8594;{" "}
            <span className="ml-2">
              {ticketInfo.totalGuests} guest
              {ticketInfo.totalGuests === 1 ? "" : "s"}
            </span>
          </small>
        </div>
        <div className="flex flex-col gap-4">
          <p className="md:text-[32px] text-2xl font-bold text-blackish-green lg:text-right">
            {ticketInfo.currencySymbol}
            {ticketInfo.totalPrice}
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

      {/* contentRef wraps EVERY room so print/PDF captures the whole reservation */}
      <div className="flex flex-col gap-y-10" ref={contentRef}>
        {ticketInfo.roomDetails.map((room, rIndex) => {
          const roomInfo = [
            {
              id: 1,
              icon: <CalenderIcon />,
              label: "check-in",
              value: `${room.checkInDate} · ${room.checkInTime}`,
            },
            {
              id: 2,
              icon: <CalenderIcon />,
              label: "check-out",
              value: `${room.checkOutDate} · ${room.checkOutTime}`,
            },
            {
              id: 3,
              icon: <TimeIcon />,
              label: "nights",
              value: String(room.nights),
            },
            {
              id: 4,
              icon: <BuildingSingleIcon />,
              label: "guests",
              value: String(ticketInfo.totalGuests),
            },
          ];

          return (
            <div key={room.id} className="flex flex-col gap-y-3">
              {ticketInfo.roomDetails.length > 1 && (
                <p className="text-xs font-semibold uppercase opacity-60">
                  Room {rIndex + 1} of {ticketInfo.roomDetails.length}
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
                    <small
                      className="font-medium text-xs"
                      style={{ opacity: "60%" }}
                    >
                      Check-in
                    </small>
                    <p className="lg:text-2xl text-xl font-semibold">
                      {room.checkInDate}
                    </p>
                    <small
                      className="font-medium text-xs"
                      style={{ opacity: "60%" }}
                    >
                      {room.checkInTime}
                    </small>
                  </div>
                  <div className="flex items-center mb-4 gap-2">
                    <span
                      className="h-px flex-1"
                      style={{ backgroundColor: "#112211", opacity: "30%" }}
                    />
                    <span className="text-xs" style={{ opacity: "60%" }}>
                      {room.nights} night{room.nights === 1 ? "" : "s"}
                    </span>
                    <span
                      className="h-px flex-1"
                      style={{ backgroundColor: "#112211", opacity: "30%" }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <small
                      className="font-medium text-xs"
                      style={{ opacity: "60%" }}
                    >
                      Check-out
                    </small>
                    <p className="lg:text-2xl text-xl font-semibold">
                      {room.checkOutDate}
                    </p>
                    <small
                      className="font-medium text-xs"
                      style={{ opacity: "60%" }}
                    >
                      {room.checkOutTime}
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
                        {leadGuest}
                      </p>
                      {ticketInfo.guestNames.length > 1 && (
                        <small className="text-xs font-medium opacity-75">
                          + {ticketInfo.guestNames.length - 1} more guest
                          {ticketInfo.guestNames.length - 1 === 1 ? "" : "s"}
                        </small>
                      )}
                    </div>
                    <p className="text-sm font-bold">{room.roomType}</p>
                  </div>

                  <div
                    className="flex-1 flex flex-col justify-between p-6 gap-10"
                    style={{ backgroundColor: "#fff" }}
                  >
                    <div className="flex w-full md:justify-between gap-8 flex-wrap">
                      {roomInfo.map((info) => (
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

                    {ticketInfo.guestNames.length > 1 && (
                      <div className="flex flex-col gap-1">
                        <p className="opacity-60 text-sm font-semibold">
                          Guests
                        </p>
                        <small className="text-xs font-medium">
                          {ticketInfo.guestNames.join(", ")}
                        </small>
                      </div>
                    )}

                    <div className="flex lg:justify-between flex-1 lg:flex-row flex-col">
                      <div className="flex flex-col gap-1">
                        <p className="text-[32px] font-semibold">
                          {ticketInfo.hotelName}
                        </p>
                        <small className="opacity-60 text-xs">
                          {ticketInfo.location}
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
        })}
      </div>
    </div>
  );
};
