import { PlacesToGo } from "@/components/sections/flights/places_to_go"
import { SearchHomeWrapper } from "@/components/sections/flights/search_home_wrapper"


const FlightSearchPage = () => {
  return (
    <div className="min-h-screen">
      <SearchHomeWrapper />
      <PlacesToGo />
    </div>
  )
}

export default FlightSearchPage