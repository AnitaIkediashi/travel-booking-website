"use client";

import { CupIcon } from "@/components/icons/cup";
import { LocationIcon } from "@/components/icons/location";
import { useFavourites } from "@/lib/favourite-context";
import { FavouriteHotel, Stay } from "@/types/hotel_type";
import { getRatingLabel } from "@/utils/getRating";
import Image from "next/image";
import Link from "next/link";
import { FavouriteButton } from "./favourite_button";
import { buildDetailHref } from "@/utils/hotel_functions";


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
          <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-[0px_4px_16px_rgba(17,34,17,0.05)] sm:flex-row">
            <div className="relative h-52 shrink-0 bg-neutral-100 sm:h-auto sm:w-[270px]">
              {h.image && (
                <Image
                  src={h.image}
                  alt={h.name}
                  fill
                  sizes="(min-width: 640px) 270px, 100vw"
                  className="object-cover"
                />
              )}
              {h.imageCount > 0 && (
                <span className="absolute right-3 top-3 rounded bg-black/40 px-2 py-0.5 text-[11px] text-white">
                  {h.imageCount} Images
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold">{h.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
                    <LocationIcon /> {h.city}, {h.country}
                  </p>
                  {h.amenityCount > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold">
                      <CupIcon /> {h.amenityCount}+ Amenities
                    </p>
                  )}
                  {h.rating !== null && (
                    <p className="mt-3 flex items-center gap-2 text-xs">
                      <span className="rounded border border-neutral-300 px-1.5 py-0.5">
                        {h.rating}
                      </span>
                      <b>{getRatingLabel(h.rating)}</b>
                      <span className="text-neutral-500">
                        {h.reviewCount} reviews
                      </span>
                    </p>
                  )}
                </div>

                {h.price && (
                  <div className="shrink-0 text-right text-xs text-neutral-500">
                    <p>starting from</p>
                    <p className="text-xl font-bold text-salmon-100">
                      {h.price.currency}
                      {h.price.amount}
                      <span className="text-xs font-normal">/night</span>
                    </p>
                    <p>excl. tax</p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-3 border-t border-neutral-100 pt-3">
                <FavouriteButton hotelId={h.id} variant="square" />
                <Link
                  href={buildDetailHref(h, stay)}
                  className="flex-1 rounded-md bg-[#8fd1b9] py-2.5 text-center text-sm font-medium hover:brightness-95"
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
