"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FavouriteHotel } from "@/types/hotel_type";
import { useFavourites } from "@/lib/favourite-context";
import { HOTEL_BOOKING_PATH, HOTEL_FAVOURITES_PATH, HOTEL_HOME_PATH, HOTEL_LISTING_PATH } from "@/utils/page_routes";
import { getFavouriteHotels } from "@/lib/actions/favourites-action";
import { buildDetailHref, formatStayLine, resolveStay } from "@/utils/hotel_functions";
import { Button } from "@/components/reusable/button";
import { HeartIcon } from "@/components/icons/heart";
import { CloseIcon } from "@/components/icons/close";
import { FavouriteButton } from "./favourite_button";
import Image from "next/image";

function Dock() {
  const { ids, open, setOpen } = useFavourites();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [result, setResult] = useState<{
    key: string;
    items: FavouriteHotel[];
  } | null>(null);

  const inSearch = pathname.startsWith(HOTEL_LISTING_PATH);
  const destination = inSearch ? sp.get("destination") : null;
  const hidden =
    pathname.startsWith(HOTEL_FAVOURITES_PATH) ||
    pathname.startsWith(HOTEL_BOOKING_PATH);
  const stay = useMemo(() => resolveStay((k) => sp.get(k)), [sp]);

  const key = `${destination}|${stay.checkIn}|${stay.checkOut}|${stay.adults}|${stay.children}|${stay.rooms}|${ids.size}`;

  useEffect(() => {
    if (!open || hidden) return;
    let cancelled = false;
    getFavouriteHotels({ stay, city: destination, limit: 3 })
      .then((items) => !cancelled && setResult({ key, items }))
      .catch(() => !cancelled && setResult({ key, items: [] }));
    return () => {
      cancelled = true;
    };
  }, [open, hidden, key, stay, destination]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (hidden) return null;

  const items = result?.items ?? [];
  const loading = open && result?.key !== key;
  const title = destination
    ? `Your saved hotels in ${destination}`
    : "Your saved hotels";
  const close = () => setOpen(false);

  return (
    <>
      {/* floating rail */}
      <div className="fixed bottom-24 right-4 z-40">
        <Button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={`Saved hotels (${ids.size})`}
          aria-expanded={open}
          icon={<HeartIcon isLiked={ids.size > 0} />}
          iconClassName="flex"
          label={String(ids.size)}
          labelClassName="text-[10px] leading-none"
          className="flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-full bg-white shadow-lg hover:shadow-xl"
        />
      </div>

      {open && (
        <section
          role="dialog"
          aria-label={title}
          className="fixed inset-x-3 bottom-44 z-50 max-h-[75vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-24 sm:w-[480px] font-montserrat"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button
              type="button"
              onClick={close}
              aria-label="Close"
              icon={<CloseIcon />}
              iconClassName="flex"
              className="p-1"
            />
          </div>

          {items.length > 0 && (
            <p className="mt-2 text-sm text-neutral-600">
              {formatStayLine(stay)}
            </p>
          )}

          {loading && items.length === 0 ? (
            <div className="mt-6 h-40 animate-pulse rounded-xl bg-neutral-100" />
          ) : items.length === 0 ? (
            <div className="mt-6 flex items-center gap-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-blue-50">
                <HeartIcon />
              </div>
              <div>
                <p className="font-semibold">Your saved hotels</p>
                <p className="text-sm text-neutral-500">
                  {destination
                    ? `No items saved in ${destination} yet. Explore and save your favorites now!`
                    : "No items saved yet. Explore and save your favorites now!"}
                </p>
              </div>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {items.map((h) => (
                <li key={h.id}>
                  <Link
                    href={buildDetailHref(h, stay)}
                    onClick={close}
                    className="flex gap-3"
                  >
                    <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {h.image && (
                        <Image
                          src={h.image}
                          alt={h.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      )}
                      <FavouriteButton
                        hotelId={h.id}
                        className="right-1.5! top-1.5! h-7! w-7!"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{h.name}</h3>
                      {h.rating !== null && (
                        <p className="text-sm">
                          <span className="font-semibold text-blue-700">
                            {h.rating}
                          </span>
                          /5 · {h.reviewCount} reviews
                        </p>
                      )}
                      <p className="text-sm text-neutral-500">{h.city}</p>
                      {h.price && (
                        <p className="mt-2 text-right">
                          {h.price.original && (
                            <span className="mr-1 text-xs line-through">
                              {h.price.currency}
                              {h.price.amount}
                            </span>
                          )}
                          <span className="text-lg font-bold">
                            {h.price.currency}
                            {h.price.amount}
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {items.length === 0 && !loading && (
            <Button
              href={HOTEL_HOME_PATH}
              onClick={close}
              label="Explore hotels & homes"
              className="mt-5 block rounded-md bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
            />
          )}
          <Button
            href={HOTEL_FAVOURITES_PATH}
            onClick={close}
            label={`View all saved items (${ids.size})`}
            className="mt-3 block rounded-md border border-blue-600 py-3 text-center font-semibold text-blue-600 hover:bg-blue-50"
          />
        </section>
      )}
    </>
  );
}

export function FavouritesDock() {
  // useSearchParams needs a Suspense boundary
  return (
    <Suspense fallback={null}>
      <Dock />
    </Suspense>
  );
}
