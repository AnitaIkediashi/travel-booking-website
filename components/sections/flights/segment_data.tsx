import { Button } from "@/components/reusable/button";
import { FlightDataProps, FlightOffer } from "@/types/flight_type";

type segmentDataProps = {
  offers: FlightOffer
};

export const SegmentData = ({ offers }: segmentDataProps) => {
  if (!offers) return [];
  return (
    <div className="w-full flex md:flex-row flex-col md:justify-between font-montserrat">
      <div className="md:w-[calc(100%-25%)] w-full md:py-6 md:border-r border-r-blackish-green/25"></div>
      <div className="md:w-1/4 w-full md:py-6 md:pl-4 justify-self-end">
        <div className="mb-6 flex flex-col">
          <small className="text-xs font-medium- opacity-75">Starting from</small>
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
}
