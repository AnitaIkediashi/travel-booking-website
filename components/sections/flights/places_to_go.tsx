import { SeeMorePlaces } from "@/components/navigation/see_more_places";
import Image from "next/image";
import plainMap from "@/public/flights/plain_map.png";
import { MapCards } from "@/components/reusable/map_cards";

export const PlacesToGo = () => {
  return (
    <section className="md:pt-[266px] pt-[553px] font-montserrat pb-20">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div className="flex flex-col gap-y-4">
            <h2 className="font-semibold md:text-[32px] text-xl text-black">
              Let&apos;s go places together
            </h2>
            <p className="text-blackish-green">
              Discover the latest offers and news and start planning your next
              trip with us.
            </p>
          </div>
          <SeeMorePlaces
            label="See All"
            href="/flight-flow/flight-search/listing"
            width="md:w-20"
          />
        </div>
      </div>
      <div className="w-full relative h-[486px] ">
        <Image src={plainMap} alt="plain map" className="w-full h-full" />
        <MapCards
          className="left-[305px] top-[72px]"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_5.png"
          arrowHeight={28.56}
          arrowWidth={59.5}
          arrowPosition="left-[351px] top-[126px]"
          circlePosition="left-[409.33px] top-[150.76px]"
          sideImg="/flights/places_5.png"
        />
        <MapCards
          className="left-[467px] top-[294px]"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_4.png"
          arrowHeight={28.56}
          arrowWidth={59.5}
          arrowPosition="left-[456px] top-[348px]"
          circlePosition="left-[450.33px] top-[371.71px]"
          sideImg="/flights/places_4.png"
        />
      </div>
    </section>
  );
};
