'use client'

import { useRouter } from "next/navigation";
import { Button } from "../reusable/button";

type seePlacesProp = {
  label: string;
  href: string
}

export const SeeMorePlaces = ({label, href}: seePlacesProp) => {
    const router = useRouter()
    const handlePlaceSearch = () => {
        router.push(href)
    }
  return (
    <Button
      label={label}
      className="md:w-[149px] w-full h-10 flex items-center justify-center border border-mint-green-100 rounded text-blackish-green font-medium text-sm hover:bg-mint-green-100"
      onClick={handlePlaceSearch}
    />
  );
}