import { SeeMorePlaces } from "@/components/navigation/see_more_places";
import randomizeLocations from "@/helpers/random_flights";
import { RandomLocationCard } from "@/components/navigation/random-location-card";

export const PlanTrip = async () => {
  const randomData = await randomizeLocations();

  return (
    <section className="pb-20 lg:w-[77%] md:w-[80%] w-[95%] mx-auto -mt-10 font-montserrat">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="flex flex-col gap-y-4">
          <h2 className="font-semibold md:text-[32px] text-xl text-black">
            Plan your perfect trip
          </h2>
          <p className="text-blackish-green">
            Search Flights & Places Hire to our most popular destinations
          </p>
        </div>
        <SeeMorePlaces />
      </div>
      <div className="flex flex-wrap gap-8 justify-between">
        {randomData.map((item, index) => {
          const shortenCountryLength =
            item.country.length > 15
              ? `${item.country.slice(0, 15)}...`
              : item.country;
          const shortenCityLength = item.city.length > 9 ? `${item.city.slice(0, 9)}...` : item.city
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
