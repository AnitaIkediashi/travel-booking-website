"use client"

import { usePathname } from "next/navigation";
import { Button } from "./button";
import { FLIGHT_SEARCH_PATH, HOTEL_SEARCH_PATH } from "@/utils/page_routes";

export const GoBackBtn = () => {
  const pathname = usePathname();

  if (pathname.startsWith(FLIGHT_SEARCH_PATH)) {
    return (
      <Button
        href={FLIGHT_SEARCH_PATH}
        label="Go back to flight search"
        className="h-12 rounded bg-mint-green-100 text-blackish-green text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity px-6 py-2.5 sm:px-8"
      />
    );
  }

  if (pathname.startsWith(HOTEL_SEARCH_PATH)) {
    return <Button href={HOTEL_SEARCH_PATH} label="Go back to hotel search" className="h-12 rounded bg-mint-green-100 text-blackish-green text-sm font-semibold flex items-center justify-center hover:opacity-90 transition-opacity px-6 py-2.5 sm:px-8" />;
  }

  return null;
};
