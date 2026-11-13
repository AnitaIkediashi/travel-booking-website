import { RandomHotels } from "@/components/navigation/random_hotels";
import { SeeMorePlaces } from "@/components/navigation/see_more_places";
import { TitleAndContent } from "@/components/reusable/title_and_content";
import { randomHotelsToBook } from "@/helpers/random_hotels_to_book";
import { getRecentSearchCards } from "@/helpers/recentSearchCards";
import { HOTEL_LISTING_PATH } from "@/utils/page_routes";

export const RandomHotelsToGo = async () => {
  const hotelLists = await randomHotelsToBook()
  const cards = await getRecentSearchCards();
  return (
    <section className={`font-montserrat pb-20 lg:pb-[120px] ${!cards.length ? "md:pt-[266px] pt-[553px]" : ""}`}>
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <TitleAndContent
            title="Fall into travel"
            para="Going somewhere to celebrate this season? Whether you’re going home or somewhere to roam, we’ve got the travel tools to get you to your destination."
          />
          <SeeMorePlaces
            label="See All"
            href={HOTEL_LISTING_PATH}
            width="md:w-20"
          />
        </div>
        <div className="w-full flex gap-4 flex-wrap">
          {
            hotelLists.map((hotel) => {
              return <RandomHotels key={hotel.id} hotel={hotel} />
            })
          }
        </div>
      </div>
    </section>
  );
};
