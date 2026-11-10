import { getRecentSearchCards } from "@/helpers/recentSearchCards";
import Image from "next/image";
import Link from "next/link";

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const RecentSearches = async () => {
  const cards = await getRecentSearchCards();
  if (!cards.length) return null;
  return (
    <section className="md:pt-[266px] pt-[553px] font-montserrat pb-20">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <h3 className="mb-6 font-bold md:text-[32px] text-xl text-black">
          Your recent searches
        </h3>
        <div className="flex gap-10 overflow-x-auto">
          {cards.map((c) => {
            const params = new URLSearchParams();
            console.log("c", c);
            params.set("destination", c.destination);
            if (c.destinationType)
              params.set("destinationType", c.destinationType);
            if (c.destinationValue)
              params.set("destinationValue", c.destinationValue);
            if (c.adults != null) params.set("adults", String(c.adults));
            if (c.children != null) params.set("children", String(c.children));
            if (c.rooms != null) params.set("rooms", String(c.rooms));

            if (c.checkIn) params.set("checkIn", c.checkIn);
            else params.set("checkIn", todayISO());

            if (c.checkOut) params.set("checkOut", c.checkOut);
            else params.set("checkOut", todayISO());
            

            return (
              <Link
                key={c.id}
                href={`/hotel-flow/hotel-search/listing?${params}`}
                className="flex items-center gap-4 shrink-0 cursor-pointer"
              >
                <div className="relative h-[90px] w-[90px] rounded-lg overflow-hidden">
                  {c.image && (
                    <Image
                      src={c.image}
                      alt={c.destination}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{c.destination}</p>
                  <p className="text-xs">{c.places} places</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
