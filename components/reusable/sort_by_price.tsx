
type SortByPriceProps = {
    title: string;
    price?: number
    duration?: string;
    placesCount?: number;
}

export const SortByPrice = ({ title, price, duration, placesCount }: SortByPriceProps) => {
  return (
    <>
      <h5 className="font-montserrat font-semibold text-blackish-green capitalize">
        {title}
      </h5>
      {price !== undefined && (
        <p className="font-montserrat text-sm text-blackish-green/40">
          ${price} . <span>{duration}</span>
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
