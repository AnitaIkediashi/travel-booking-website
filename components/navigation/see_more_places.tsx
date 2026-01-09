
import { Button } from "../reusable/button";

type seePlacesProp = {
  label: string;
  href: string
  width: string
}

export const SeeMorePlaces = ({label, href, width}: seePlacesProp) => {
  return (
    <Button
      label={label}
      className={`${width} w-full h-10 flex items-center justify-center border border-mint-green-100 rounded text-blackish-green font-medium text-sm hover:bg-mint-green-100`}
      href={href}
    />
  );
}