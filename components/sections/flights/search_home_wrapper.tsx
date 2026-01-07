import { SearchPlaces } from "@/components/reusable/search_places";

export const SearchHomeWrapper = () => {
  return (
    <section className="w-full">
      <div className="pt-[90px] w-full lg:h-[537px] h-[462px] bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.7)),url(/flights/flight-hero.jpg)] bg-no-repeat bg-center bg-cover font-montserrat">
        <div className="lg:mt-20 mt-10 lg:ml-[147px] ml-0 mx-8 lg:w-[440px] w-full text-white">
          <h2 className="font-bold lg:text-[45px] text-3xl">
            Make your travel whishlist, we’ll do the rest
          </h2>
          <p className="lg:text-xl text-lg font-medium">
            Special offers to suit your plan
          </p>
        </div>
        <div className="relative top-[109px]">
          <SearchPlaces />
        </div>
      </div>
    </section>
  );
}
