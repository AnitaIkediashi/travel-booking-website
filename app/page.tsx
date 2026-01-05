import { FlightHotelCard } from "@/components/navigation/flight_hotels_card";
import { HomeNavbar } from "@/components/navigation/home_navbar";
import { PlanTrip } from "@/components/sections/home/plan-trip";
import { Reviews } from "@/components/sections/home/reviews";

export default function Home() {
  return (
    <section className="w-full">
      <HomeNavbar />
      <PlanTrip />
      <FlightHotelCard />
      <Reviews />
    </section>
  );
}
