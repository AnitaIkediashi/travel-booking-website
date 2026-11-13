
import { FavouritesList } from "@/components/sections/favourites/favourite_list";
import { getFavouriteHotels } from "@/lib/actions/favourites-action";
import { HotelSearchParams } from "@/types/hotel_type";
import { resolveStay } from "@/utils/hotel_functions";

export const dynamic = "force-dynamic";

const FavouritePage = async ({ searchParams }: HotelSearchParams) => {
  const searchProps = await searchParams;
  const stay = resolveStay(
    (k) => (searchProps as Record<string, string | undefined>)[k],
  );
  const items = await getFavouriteHotels({ stay });

  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        <h1 className="text-3xl font-bold">Favourites</h1>
        <div className="mt-6 rounded-lg bg-white shadow-[0px_4px_16px_rgba(17,34,17,0.05)]">
          <div className="relative py-[17.5px] px-6">
            <p className="font-semibold">Places</p>
            <p className="text-sm opacity-40">{items.length} marked</p>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-mint-green-100" />
          </div>
        </div>

        <FavouritesList items={items} stay={stay} />
      </div>
    </section>
  );
};

export default FavouritePage;
