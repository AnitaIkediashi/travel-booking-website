import Image from "next/image";
import { Button } from "../reusable/button";
import { PaperPlaneIcon } from "../icons/paperPlane";

const cardContents = [
  {
    bg: "/landing_page/flight-tour.svg",
    title: "flights",
    content: "Search Flights & Places Hire to our most popular destinations",
    cta: 'show flights',
    href: '/flight-flow/flight-search'
  },
  {
    bg: "/landing_page/hotel-tour.svg",
    title: "hotels",
    content: "Search hotels & Places Hire to our most popular destinations",
    cta: 'show hotels',
    href: '/hotel-flow/hotel-search'
  },
];

export const FlightHotelCard = () => {
  return (
    <section className="pb-[70px] lg:w-[77%] md:w-[80%] w-[95%] mx-auto font-montserrat">
      <div className="flex flex-wrap justify-between gap-6">
        {cardContents.map((Item, index) => (
          <div
            key={index}
            className="min-w-[300px] flex-1 h-[559px] rounded-[20px] relative"
          >
            <Image
              src={Item.bg}
              alt={`${Item.title} image`}
              width={604}
              height={559}
              className="w-full h-full object-cover rounded-[20px]"
            />
            <div className="absolute bottom-0 right-0 left-0 z-20 w-full h-[280px]">
              <div className="w-full flex items-center justify-center h-full">
                <div className="mt-[90px] mb-6 max-w-[82%] mx-auto flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h4 className="text-white md:text-[40px] text-3xl font-bold capitalize">
                      {Item.title}
                    </h4>
                    <p className="text-white text-center">{Item.content}</p>
                  </div>
                  <Button className="w-[141px] h-12 flex items-center justify-center rounded gap-1 text-blackish-green bg-mint-green-100 capitalize text-sm font-medium hover:bg-blackish-green-20" label={Item.cta} href={Item.href} icon={<PaperPlaneIcon />} iconClassName="text-sm" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
