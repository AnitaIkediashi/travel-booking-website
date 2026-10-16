import { CloseIcon } from "@/components/icons/close";

type FiltersProps = {
  showFilters: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Filters = ({ showFilters, onClose, children }: FiltersProps) => {
  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-xs flex items-end justify-center z-100 font-montserrat transition-opacity duration-300 ease-in-out lg:hidden ${
        showFilters ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-tl-2xl rounded-tr-2xl shadow-light p-8 w-[500px] relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showFilters ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      >
        <div
          className="absolute top-4 right-4 cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-blackish-green-10/50 transition-colors duration-200"
          onClick={onClose}
        >
          <CloseIcon />
        </div>
        <h3 className="pb-8 text-blackish-green font-semibold text-xl capitalize">
          filters
        </h3>
        {children}
      </div>
    </div>
  );
};
