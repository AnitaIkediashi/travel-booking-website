import { getRecentSearchCards } from "@/helpers/recentSearchCards";
import { HOTEL_LISTING_PATH } from "@/utils/page_routes";
import Image from "next/image";
import Link from "next/link";

const toISO = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const addDaysISO = (iso: string, days: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return toISO(new Date(y, m - 1, d + days)); // local date, avoids UTC shifts
};

function resolveStayDates(checkIn?: string | null, checkOut?: string | null) {
  const today = toISO(new Date());

  // Missing or in the past -> 7 days from today, one night
  if (!checkIn || checkIn < today) {
    const start = addDaysISO(today, 7);
    return { checkIn: start, checkOut: addDaysISO(start, 1) };
  }

  // Valid check-in, but check-out is missing or not after it -> one night
  if (!checkOut || checkOut <= checkIn) {
    return { checkIn, checkOut: addDaysISO(checkIn, 1) };
  }

  return { checkIn, checkOut };
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
        <div className="flex gap-6 overflow-x-auto py-6 -my-6 px-2 -mx-2">
          {cards.map((c) => {
            const params = new URLSearchParams();
            const dates = resolveStayDates(c.checkIn, c.checkOut);
            params.set("destination", c.destination);
            if (c.destinationType)
              params.set("destinationType", c.destinationType);
            if (c.destinationValue)
              params.set("destinationValue", c.destinationValue);
            if (c.adults != null) params.set("adults", String(c.adults));
            if (c.children != null) params.set("children", String(c.children));
            if (c.rooms != null) params.set("rooms", String(c.rooms));

            if (c.checkIn) params.set("checkIn", c.checkIn);
            params.set("checkIn", dates.checkIn);
            params.set("checkOut", dates.checkOut);

            return (
              <Link
                key={c.id}
                href={`${HOTEL_LISTING_PATH}?${params}`}
                className="flex items-center gap-4 shrink-0 w-[280px] cursor-pointer rounded-lg bg-white p-4 border border-transparent transition-all duration-300 ease-in-out hover:shadow-lg hover:border-mint-green-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint-green-100"
              >
                <div className="relative h-[90px] w-[90px] shrink-0 rounded-lg overflow-hidden">
                  {c.image && (
                    <Image
                      src={c.image}
                      alt={c.destination}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{c.destination}</p>
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
