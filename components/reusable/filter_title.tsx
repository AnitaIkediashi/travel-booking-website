import { ArrowDownIcon } from "../icons/arrow_down";

type TitleProps = {
    title: string;
    onClick?: () => void;
}

export const FilterTitle = ({title, onClick}: TitleProps) => {
  return (
    <div className="mb-4 flex items-center justify-between cursor-pointer" onClick={onClick}>
      <h5 className="text-blackish-green font-semibold capitalize">{title}</h5>
      <ArrowDownIcon />
    </div>
  );
}
