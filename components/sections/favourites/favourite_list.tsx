"use client";

import { CupIcon } from "@/components/icons/cup";
import { LocationIcon } from "@/components/icons/location";
import { useFavourites } from "@/lib/favourite-context";
import { FavouriteHotel, Stay } from "@/types/hotel_type";
import { getRatingLabel } from "@/utils/getRating";
import Link from "next/link";
import { FavouriteButton } from "./favourite_button";
import { buildDetailHref } from "@/utils/hotel_functions";
import { StarRating } from "../hotels/star_rating";
import { HotelImageCarousel } from "@/components/reusable/hotel_image_carousel";


export function FavouritesList({
  items,
  stay,
}: {
  items: FavouriteHotel[];
  stay: Stay;
}) {
  const { ids } = useFavourites();
  // Unhearting removes the card instantly (the store is the source of truth).
  const visible = items.filter((h) => ids.has(h.id));

  if (visible.length === 0) {
    return (
      <p className="mt-10 text-center text-neutral-500">
        No hotels saved yet. Tap the heart on any hotel to save it here.
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-4">
      {visible.map((h) => (
        <li key={h.id}>
          <article className="w-full flex flex-col md:flex-row md:justify-between md:items-stretch gap-4 md:gap-0 font-montserrat overflow-hidden rounded-xl bg-white shadow-[0px_4px_16px_rgba(17,34,17,0.05)]">
            {/* Image */}
            <HotelImageCarousel images={h.images} alt={h.name} />

            {/* Hotel prices and content */}
            <div className="flex-1 flex flex-col justify-between md:p-6 p-3 gap-6">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg md:text-xl font-semibold text-blackish-green leading-tight">
                    {h.name}
                  </h3>

                  <div className="flex flex-col gap-y-3 text-xs">
                    <p className="flex items-center gap-0.5 opacity-75">
                      <LocationIcon />
                      {h.city}, {h.country}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <StarRating rating={h.rating ?? 0} />
                      {h.amenityCount > 0 && (
                        <div className="flex items-center">
                          <CupIcon />
                          <span className="ml-1 font-semibold">
                            {h.amenityCount}+
                          </span>{" "}
                          <span className="font-medium">Amenities</span>
                        </div>
                      )}
                    </div>

                    {h.rating !== null && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="border border-mint-green-100 rounded px-2 py-1 font-medium">
                          {h.rating.toFixed(1)}
                        </span>
                        <span>
                          <strong>{getRatingLabel(h.rating)}</strong>{" "}
                          {h.reviewCount} reviews
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {h.price && (
                  <div className="sm:text-right shrink-0">
                    <p className="text-xs font-medium opacity-75">
                      starting from
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-salmon-100">
                      {h.price.currency}
                      {h.price.amount}
                      <span className="text-sm">/night</span>
                    </p>
                    <p className="text-xs font-medium opacity-75">excl. tax</p>
                  </div>
                )}
              </div>

              <div className="border-t border-blackish-green/25 pt-4 flex items-center gap-4">
                <FavouriteButton hotelId={h.id} variant="square" />
                <Link
                  href={buildDetailHref(h, stay)}
                  className="flex-1 h-12 rounded bg-mint-green-100 text-blackish-green text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  View Place
                </Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
