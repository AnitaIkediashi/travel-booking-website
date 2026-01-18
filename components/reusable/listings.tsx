'use client'

import { usePathname } from "next/navigation"

export const Listings = () => {
    const pathname = usePathname()
    
  return (
    <section className="pt-[137px] md:pb-[120px] pb-12 font-montserrat">
      <div className="lg:w-[77%] md:w-[80%] mx-auto px-8 md:px-0">
        hello world
      </div>
    </section>
  );
}
