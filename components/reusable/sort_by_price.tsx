
type SortByPriceProps = {
    title: string;
    price?: number
    placesCount?: number;
}

export const SortByPrice = ({ title, price, placesCount }: SortByPriceProps) => {
  return (
    <>
      <h5 className="font-montserrat font-semibold text-blackish-green capitalize">
        {title}
      </h5>
      {price !== undefined && (
        <p className="font-montserrat text-sm text-blackish-green/40">
          ${price}
        </p>
      )}
      {placesCount !== undefined && (
        <p className="font-montserrat text-sm text-blackish-green/40">
          {placesCount} places
        </p>
      )}
    </>
  );
}
