import { SeeMorePlaces } from "@/components/navigation/see_more_places";
import { RandomLocationCard } from "@/components/navigation/random-location-card";
import { TitleAndContent } from "@/components/reusable/title_and_content";
import { randomizeLocations } from "@/helpers/random_flights";

export const PlanTrip = async () => {
  const randomData = await randomizeLocations();

  return (
    <section className="pb-20 lg:w-[77%] md:w-[80%] w-[95%] mx-auto -mt-10 font-montserrat">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <TitleAndContent
          title="Plan your perfect trip"
          para="Search Flights & Places Hire to our most popular destinations"
        />
        <SeeMorePlaces
          label="See more places"
          href="/flight-flow/flight-search"
          width="md:w-[149px]"
        />
      </div>
      <div className="flex flex-wrap gap-8 justify-between">
        {randomData.map((item, index) => {
          const shortenCountryLength =
            item.country.length > 15
              ? `${item.country.slice(0, 15)}...`
              : item.country;
          const shortenCityLength =
            item.city.length > 9 ? `${item.city.slice(0, 9)}...` : item.city;
          return (
            <RandomLocationCard
              key={index}
              item={item}
              index={index}
              shortenCountryLength={shortenCountryLength}
              shortenCityLength={shortenCityLength}
            />
          );
        })}
      </div>
    </section>
  );
};
