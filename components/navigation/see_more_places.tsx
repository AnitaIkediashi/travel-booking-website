'use client'

import { useRouter } from "next/navigation";
import { Button } from "../reusable/button";

export const SeeMorePlaces = () => {
    const router = useRouter()
    const handlePlaceSearch = () => {
        router.push('/flight-flow/flight-search')
    }
  return (
    <Button
      label="See more places"
      className="md:w-[149px] w-full h-10 flex items-center justify-center border border-mint-green-100 rounded text-blackish-green font-medium text-sm hover:bg-mint-green-100"
      onClick={handlePlaceSearch}
    />
  );
}
