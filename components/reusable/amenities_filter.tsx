import { useState } from "react";
import { Checkbox } from "antd";
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

  const amenityOptions = visibleAmenities.map((amenity) => ({
    label: amenity,
    value: amenity,
  }));

  const handleChange = (checkedValues: string[]) => {
    const hiddenSelected = selectedAmenities.filter(
      (amenity) => !visibleAmenities.includes(amenity),
    );
    onChange([...hiddenSelected, ...checkedValues]);
  };

  return (
    <div className="flex flex-col font-montserrat">
      <FilterTitle title="amenities" onClick={onClose} isOpen={openFilter} />
      {openFilter && (
        <div className="flex flex-col gap-3">
          <Checkbox.Group
            options={amenityOptions}
            value={selectedAmenities}
            onChange={(checkedValues) =>
              handleChange(checkedValues as string[])
            }
            style={{ flexDirection: "column", gap: 8 }}
          />

          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="self-start text-sm font-medium text-salmon-100"
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
