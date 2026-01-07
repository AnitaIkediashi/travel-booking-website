import { SeeMorePlaces } from "@/components/navigation/see_more_places";

export const PlacesToGo = () => {
  return (
    <section className="pt-[266px] font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] w-full mx-auto">
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
          <SeeMorePlaces label="See All" href="/flight-flow/flight-search/listing" />
        </div>
      </div>
      <div className="w-full">
        
      </div>
    </section>
  );
}
