
export const SearchFlights = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_120px_1fr_1fr] xl:grid-cols-[1fr_140px_1fr_1fr] gap-6 font-montserrat">
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">
          from - to
        </legend>
      </fieldset>
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">trip</legend>
      </fieldset>
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">
          depart - return
        </legend>
      </fieldset>
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">
          passenger - class
        </legend>
      </fieldset>
    </div>
  );
}
