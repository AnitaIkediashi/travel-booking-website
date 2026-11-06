import { HomeHotelWrapper } from "@/components/sections/hotels/home_hotel_wrapper";
import { RandomHotelsToGo } from "@/components/sections/hotels/random_hotels_to_go";
import { RecentSearches } from "@/components/sections/hotels/recent_searches";
import { HotelSearchParams } from "@/types/hotel_type";

const HotelSearchPage = async ({ searchParams }: HotelSearchParams) => {
  const { destination } = await searchParams;
  return (
    <div className="min-h-screen">
      <HomeHotelWrapper destination={destination} />
      <RecentSearches />
      <RandomHotelsToGo />
    </div>
  );
};

export default HotelSearchPage;
