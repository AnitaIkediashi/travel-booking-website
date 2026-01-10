import { PlacesToGo } from "@/components/sections/flights/places_to_go"
import { RandomPlacesToBook } from "@/components/sections/flights/random_places_to_book"
import { SearchHomeWrapper } from "@/components/sections/flights/search_home_wrapper"


const FlightSearchPage = () => {
  return (
    <div className="min-h-screen">
      <SearchHomeWrapper />
      <PlacesToGo />
      <RandomPlacesToBook />
    </div>
  )
}

export default FlightSearchPage