import { useState } from "react";
import { FilterTitle } from "@/components/reusable/filter_title";

type AmenitiesFilterProps = {
  amenities: string[];
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
  openFilter: boolean;
  onClose: () => void;
};

const INITIAL_VISIBLE = 4;

export const AmenitiesFilter = ({
  amenities,
  selectedAmenities,
  onChange,
  openFilter,
  onClose,
}: AmenitiesFilterProps) => {
  const [showAll, setShowAll] = useState(false);

  const visibleAmenities = showAll
    ? amenities
    : amenities.slice(0, INITIAL_VISIBLE);
  const hiddenCount = amenities.length - INITIAL_VISIBLE;

  const handleToggle = (amenity: string) => {
    onChange(
      selectedAmenities.includes(amenity)
        ? selectedAmenities.filter((a) => a !== amenity)
        : [...selectedAmenities, amenity],
    );
  };

  return (
    <div className="flex flex-col font-montserrat">
      <FilterTitle title="amenities" onClick={onClose} isOpen={openFilter} />
      {openFilter && (
        <div className="flex flex-col gap-3">
          {visibleAmenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 cursor-pointer text-sm text-blackish-green"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleToggle(amenity)}
                className="w-5 h-5 rounded border border-blackish-green accent-blackish-green cursor-pointer"
              />
              {amenity}
            </label>
          ))}

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="self-start text-sm font-medium text-[#ff8682]" // swap for your coral token
            >
              {showAll ? "Show less" : `+${hiddenCount} more`}
            </button>
          )}
        </div>
      )}
      <div className="mt-8 w-full h-[0.5px] bg-blackish-green/25" />
    </div>
  );
};
