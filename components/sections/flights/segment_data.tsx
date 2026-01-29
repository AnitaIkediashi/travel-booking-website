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
    <div className="w-full flex md:flex-row flex-col md:justify-between font-montserrat">
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
                <div key={index} className="flex justify-between">
                  <div className="flex gap-6">
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
                  <p className="text-sm font-semibold opacity-78">
                    {stopLabel}
                  </p>
                  <div className="flex flex-col">
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
                </div>
              );
            }),
          );
        })}
      </div>
      <div className="md:w-1/4 w-full md:py-6 md:pl-4 flex flex-col justify-end">
        <div className="mb-6 flex flex-col">
          <small className="text-xs font-medium- opacity-75">
            Starting from
          </small>
          <p className="text-salmon-100 font-bold text-2xl ">
            ${offers.price_breakdown?.total?.amount ?? 0}
          </p>
        </div>
        <Button
          type="button"
          className="capitalize h-12 w-full bg-mint-green-100 text-sm font-semibold flex items-center justify-center rounded hover:bg-blackish-green hover:text-white"
          label="view deal"
        />
      </div>
    </div>
  );
};
