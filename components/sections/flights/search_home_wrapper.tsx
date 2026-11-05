import { SearchFlights } from "@/components/reusable/search_flights";

export const SearchHomeWrapper = ({ from }: { from?: string | undefined }) => {
  return (
    <section className="w-full">
      <div className="pt-[90px] w-full lg:h-[537px] h-[462px] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/flights/flight-hero.jpg)] bg-no-repeat bg-top bg-cover font-montserrat">
        <div className="lg:mt-20 mt-10 lg:ml-[147px] ml-0 mx-8 lg:w-[440px] w-full text-white px-8 lg:px-0">
          <h2 className="font-bold lg:text-[45px] text-3xl">
            Make your travel wishlist, we’ll do the rest
          </h2>
          <p className="lg:text-xl text-lg font-medium">
            Special offers to suit your plan
          </p>
        </div>
        <div className="relative top-[109px]">
          <div className="lg:w-[77%] md:w-[80%] w-full mx-auto rounded-2xl bg-white shadow-light px-6 pt-4 pb-8 font-montserrat">
            <h4 className="capitalize md:text-xl text-lg font-semibold md:mb-8 mb-6">
              Where are you flying?
            </h4>
            <SearchFlights from={from} />
          </div>
        </div>
      </div>
    </section>
  );
};
