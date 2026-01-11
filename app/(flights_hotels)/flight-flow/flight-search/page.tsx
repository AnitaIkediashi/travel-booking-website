import { PlacesToGo } from "@/components/sections/flights/places_to_go"
import { RandomPlacesToBook } from "@/components/sections/flights/random_places_to_book"
import { SearchHomeWrapper } from "@/components/sections/flights/search_home_wrapper"
import { searchParams } from "@/types/flight_type"


const FlightSearchPage = async ({ searchParams }: searchParams) => {
  const {from} = await searchParams

  return (
    <div className="min-h-screen">
      <SearchHomeWrapper from={from} />
      <PlacesToGo />
      <RandomPlacesToBook />
    </div>
  );
};

export default FlightSearchPage