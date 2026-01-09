import { SeeMorePlaces } from "@/components/navigation/see_more_places";
import Image from "next/image";
import plainMap from "@/public/flights/plain_map.png";
import { MapCards } from "@/components/reusable/map_cards";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger); 

export const PlacesToGo = () => {
  const mapRef = useRef(null);
  const boxOneRef = useRef(null)
  const circleOneRef = useRef(null)
  const arrowOneRef = useRef(null)
  const boxTwoRef = useRef(null)
  const circleTwoRef = useRef(null)
  const arrowTwoRef = useRef(null)
  const boxThreeRef = useRef(null)
  const circleThreeRef = useRef(null)
  const arrowThreeRef = useRef(null)
  const boxFourRef = useRef(null)
  const circleFourRef = useRef(null)
  const arrowFourRef = useRef(null)
  const boxFiveRef = useRef(null)
  const circleFiveRef = useRef(null)
  const arrowFiveRef = useRef(null)

  // gsap.to()

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
      <div className="w-full relative h-[486px]" ref={mapRef}>
        <Image src={plainMap} alt="plain map" className="w-full h-full" />
        <MapCards
          className="xl:left-[305px] lg:left-[174px] md:left-[95px] left-4 md:top-[72px] top-[100px]"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_5.png"
          arrowHeight={28.56}
          arrowWidth={59.5}
          arrowPosition="xl:left-[351px] lg:left-[238px] md:left-[139px] left-10 md:top-[126px] top-[154px]"
          circlePosition="xl:left-[409.33px] lg:left-[291.33px] md:left-[188px] left-[88px] md:top-[150.76px] top-[177px]"
          sideImg="/flights/places_5.png"
        />
        <MapCards
          className="xl:left-[467px] lg:left-[286px] md:left-[169px] left-20 lg:top-[294px] top-[335px]"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_4.png"
          arrowHeight={28.56}
          arrowWidth={59.5}
          arrowPosition="xl:left-[456px] lg:left-[316px] md:left-[231px] left-[129px] lg:top-[348px] top-[387px]"
          circlePosition="xl:left-[450.33px] lg:left-[312px] lg:top-[371.71px] md:left-[234px] left-[132px] top-[411px]"
          sideImg="/flights/places_4.png"
        />
        <MapCards
          className="xl:left-[774px] lg:left-[542px] md:left-[335px] left-4 md:top-[280px] top-[243px]"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_3.png"
          arrowHeight={28.56}
          arrowWidth={59.5}
          arrowPosition="xl:left-[762px] lg:left-[586px] md:left-[372px] left-[72px] md:top-[248px] top-[210px]"
          circlePosition="xl:left-[761.56px] lg:left-[589.56px] md:left-[375px] left-[74px] md:top-[243.68px] top-[205px]"
          sideImg="/flights/places_3.png"
        />
        <MapCards
          className="lg:right-[309px] md:right-[100px] right-[34px] md:top-[89px] top-8"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_2.png"
          arrowHeight={46}
          arrowWidth={95}
          arrowPosition="lg:right-[384px] md:right-[155px] right-[54px] md:top-[144px] top-[85px]"
          circlePosition="lg:right-[468.99px] md:right-[224.99px] right-[129px] md:top-[185.56px] top-[127px]"
          sideImg="/flights/places_2.png"
        />
        <MapCards
          className="lg:right-[162px] md:right-[84px] right-4 md:top-[260px] top-[169px]"
          userName="jane doe"
          location="Boarding Pass N’123"
          arrowImg="/flights/arrow_1.png"
          arrowHeight={28.56}
          arrowWidth={59.5}
          arrowPosition="lg:right-[242.5px] md:right-[134.5px] right-14 md:top-[313px] top-[222px]"
          circlePosition="lg:right-[292.75px] md:right-[184px] right-[104px] md:top-[336.91px] top-[245px]"
          sideImg="/flights/places_1.png"
        />
      </div>
    </section>
  );
};
