import { FilterTitle } from "@/components/reusable/filter_title";

type RatingFilterProps = {
  selectedRating: number | null;
  onChange: (rating: number | null) => void;
  openFilter: boolean;
  onClose: () => void;
  className?: string;
};

const RATINGS = [0, 1, 2, 3, 4];

export const RatingFilter = ({
  selectedRating,
  onChange,
  openFilter,
  onClose,
  className
}: RatingFilterProps) => {
  return (
    <div className={`flex flex-col font-montserrat ${className}`}>
      <FilterTitle title="rating" onClick={onClose} isOpen={openFilter} />
      {openFilter && (
        <div className="flex items-center gap-4 flex-wrap">
          {RATINGS.map((rating) => {
            const isActive = selectedRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(isActive ? null : rating)} // click again to clear
                className={`min-w-10 h-8 px-2 rounded border text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-blackish-green text-white border-blackish-green"
                    : "border-blackish-green/50 text-blackish-green hover:bg-mint-green-100"
                }`}
              >
                {rating}+
              </button>
            );
          })}
        </div>
      )}
      <div className="mt-8 w-full h-[0.5px] bg-blackish-green/25" />
    </div>
  );
};
