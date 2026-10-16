import { ArrowDownIcon } from "../icons/arrow_down";

type TitleProps = {
  title: string;
  onClick?: () => void;
  isOpen?: boolean;
};

export const FilterTitle = ({ title, isOpen = false, onClick }: TitleProps) => {
  return (
    <div
      className="mb-4 flex items-center justify-between cursor-pointer"
      onClick={onClick}
      role="button"
      aria-expanded={isOpen}
    >
      <h5 className="text-blackish-green font-semibold capitalize">{title}</h5>
      <span
        className={`inline-flex transition-transform duration-300 ease-in-out ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      >
        <ArrowDownIcon />
      </span>
    </div>
  );
};
