"use client";

import { HeartIcon } from "@/components/icons/heart";
import { Button } from "@/components/reusable/button";
import { useFavourites } from "@/lib/favourite-context";


type Props = {
  hotelId: string;
  /** overlay: round white button on top of images (listing card, gallery)
   *  inline: "♡ Save" text button (detail page header)
   *  square: outlined square (Favourites page card) */
  variant?: "overlay" | "inline" | "square";
  className?: string;
};

export function FavouriteButton({
  hotelId,
  variant = "overlay",
  className = "",
}: Props) {
  const { isSaved, toggle } = useFavourites();
  const saved = isSaved(hotelId);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    void toggle(hotelId);
  };

  const shared = {
    type: "button" as const, // your Button has no default type, so be explicit
    onClick,
    icon: <HeartIcon isLiked={saved} />,
    iconClassName: "flex",
    "aria-pressed": saved,
    "aria-label": saved ? "Remove from saved hotels" : "Save hotel",
  };

  if (variant === "inline") {
    return (
      <Button
        {...shared}
        label={saved ? "Saved" : "Save"}
        className={`inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 ${className}`}
      />
    );
  }

  if (variant === "square") {
    return (
      <Button
        {...shared}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 ${className}`}
      />
    );
  }

  return (
    <Button
      {...shared}
      className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow transition hover:scale-105 ${className}`}
    />
  );
}
