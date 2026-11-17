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
                <span className="absolute right-3 top-3 rounded-lg bg-white/30 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                  {h.imageCount} {h.imageCount === 1 ? "image" : "images"}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg md:text-xl font-semibold text-blackish-green leading-tight">
                    {h.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs opacity-75">
                    <LocationIcon /> {h.city}, {h.country}
                  </p>
                  {h.amenityCount > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold">
                      <CupIcon /> {h.amenityCount}+ Amenities
                    </p>
                  )}
                  {h.rating !== null && (
                    <p className="mt-3 flex items-center gap-2 text-xs">
                      <span className="border border-mint-green-100 rounded px-2 py-1 font-medium">
                        {h.rating.toFixed(1)}
                      </span>
                      <strong>{getRatingLabel(h.rating)}</strong>
                      <span>{h.reviewCount} reviews</span>
                    </p>
                  )}
                </div>

                {h.price && (
                  <div className="shrink-0 text-right text-xs ">
                    <p className="font-medium opacity-75">starting from</p>
                    <p className="text-xl md:text-2xl font-bold text-salmon-100">
                      {h.price.currency}
                      {h.price.amount}
                      <span className="text-sm">/night</span>
                    </p>
                    <p className="text-xs font-medium opacity-75">excl. tax</p>
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-3 border-t border-neutral-100 pt-3">
                <FavouriteButton hotelId={h.id} variant="square" />
                <Link
                  href={buildDetailHref(h, stay)}
                  className="flex-1 rounded-md bg-mint-green-100 h-12 text-blackish-green text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity"
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
