import { ViewMoreIcon } from "@/components/icons/view_more";
import { Button } from "@/components/reusable/button";
import { formatDateTime, getDuration } from "@/helpers/convertNumberToTime";
import { FlightOffer } from "@/types/flight_type";
import Image from "next/image";

type segmentDataProps = {
  offers: FlightOffer;
};

export const SegmentData = ({ offers }: segmentDataProps) => {
  if (!offers) return [];
  return (
    <div className="w-full flex flex-row justify-between items-center md:items-start gap-4 md:gap-0 font-montserrat">
      <div className="md:w-[calc(100%-25%)] w-full md:py-6 md:pr-4 md:border-r border-r-blackish-green/25 flex flex-col gap-y-4 justify-center">
        {offers.segments?.map((segment, index) => {
          if (!segment.legs) return null;
          const stopCount = segment.legs?.length ?? 0;
          const stopLabel =
            stopCount <= 1
              ? "non stop"
              : `${stopCount - 1} Stop${stopCount > 2 ? "s" : ""}`;
          return segment.legs?.map((leg) =>
            leg.carriers?.map((carrier) => {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center md:items-start relative"
                >
                  <div className="md:flex md:gap-6 gap-1.5 hidden">
                    <Image
                      src={
                        carrier.logo?.trim() || "/flights/airplane-ticket.png"
                      }
                      alt={`${carrier.name} logo`}
                      width={100}
                      height={40}
                      loading="eager"
                      className="w-[50px] h-[50px]"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold">
                        {formatDateTime(segment.departure_time)} -{" "}
                        {formatDateTime(segment.arrival_time)}
                      </p>
                      <p className="text-sm opacity-40">{carrier.name}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold opacity-78 hidden md:block">
                    {stopLabel}
                  </p>
                  <div className="md:flex flex-col hidden">
                    <p className="opacity-78 font-semibold">
                      {getDuration(
                        segment.departure_time,
                        segment.arrival_time,
                      )}
                    </p>
                    <p className="text-sm opacity-40">
                      {segment.departure_airport_code} -{" "}
                      {segment.arrival_airport_code}
                    </p>
                  </div>
                  <div className="flex md:hidden flex-col items-center gap-0.5">
                    <Image
                      src={
                        carrier.logo?.trim() || "/flights/airplane-ticket.png"
                      }
                      alt={`${carrier.name} logo`}
                      width={24}
                      height={20}
                      loading="eager"
                      className="w-6 h-5"
                    />
                    <small className="text-[10px] opacity-40">{carrier.name}</small>
                  </div>
                  <div className="flex md:hidden flex-col">
                    <small className="text-xs font-semibold">
                      {formatDateTime(segment.departure_time).slice(0, -1)}
                    </small>
                    <small className="text-xs opacity-40">
                      {segment.departure_airport_code}
                    </small>
                  </div>
                  <div className="md:hidden flex flex-col items-center gap-y-2">
                    <hr className="min-w-16 bg-blackish-green opacity-50" />
                    <small className="text-[10px] opacity-78">
                      {getDuration(
                        segment.departure_time,
                        segment.arrival_time,
                      )}
                    </small>
                  </div>
                  <div className="flex md:hidden flex-col">
                    <small className="text-xs font-semibold">
                      {formatDateTime(segment.arrival_time).slice(0, -1)}
                    </small>
                    <small className="text-xs opacity-40">
                      {segment.arrival_airport_code}
                    </small>
                  </div>
                </div>
              );
            }),
          );
        })}
      </div>
      <div className="md:w-1/4 max-w-1/4 md:py-6 md:pl-4 flex flex-col justify-end">
        <div className="md:mb-6 mb-4 flex flex-col">
          <small className="text-xs font-medium- opacity-75">
            Starting from
          </small>
          <p className="text-salmon-100 font-bold md:text-2xl text-xl">
            ${offers.price_breakdown?.total?.amount ?? 0}
          </p>
        </div>
        <Button
          type="button"
          className="capitalize h-12 w-full bg-mint-green-100 text-sm font-semibold hidden md:flex items-center justify-center rounded hover:bg-blackish-green hover:text-white"
          label="view deal"
        />
        <Button
          type="button"
          className="capitalize h-10 w-full bg-mint-green-100 text-sm font-semibold flex md:hidden items-center justify-center rounded hover:bg-blackish-green hover:text-white"
          icon={<ViewMoreIcon />}
        />
      </div>
    </div>
  );
};
