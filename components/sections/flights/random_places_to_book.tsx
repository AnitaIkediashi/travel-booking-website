import { RandomLocationCardTwo } from "@/components/navigation/random-location-card-two";
import { SeeMorePlaces } from "@/components/navigation/see_more_places";
import { TitleAndContent } from "@/components/reusable/title_and_content";
import { randomCountriesAndPrice } from "@/helpers/random_flights";

export const RandomPlacesToBook = async () => {
  const data = await randomCountriesAndPrice();

  return (
    <section className="font-montserrat pb-20">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <TitleAndContent
            title="Fall into travel"
            para="Going somewhere to celebrate this season? Whether you’re going home or somewhere to roam, we’ve got the travel tools to get you to your destination."
          />
          <SeeMorePlaces
            label="See All"
            href="/flight-flow/flight-search/listing"
            width="md:w-20"
          />
        </div>
        <div className="w-full flex gap-4 flex-wrap">
          {data.map((item, index) => {
            const shortenCountryLength =
              item.country!.length > 10
                ? `${item.country!.slice(0, 10)}...`
                : item.country;
            return (
              <RandomLocationCardTwo
                key={index}
                shortenCountryLength={shortenCountryLength}
                price={item.price}
                image={item.imageUrl}
                currency={item.currencyCode}
                airportCode={item.airportCode}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
