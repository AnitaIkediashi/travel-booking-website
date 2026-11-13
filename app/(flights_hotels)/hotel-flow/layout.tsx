import { FavouritesProvider } from "@/lib/favourite-context";
import { getFavouriteIds } from "@/lib/actions/favourites-action";
import { FavouritesDock } from "@/components/sections/favourites/favourite_dock";


export default async function HotelFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialIds = await getFavouriteIds();
  return (
    <FavouritesProvider initialIds={initialIds}>
      {children}
      <FavouritesDock />
    </FavouritesProvider>
  );
}
