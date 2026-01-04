import { HomeNavbar } from "@/components/navigation/home_navbar";
import { PlanTrip } from "@/components/sections/home/plan-trip";


export default function Home() {
  return (
    <section className="w-full">
      <HomeNavbar />
      <PlanTrip />
    </section>
  );
}
