import { FilterTitle } from "@/components/reusable/filter_title";
import { Slider } from "antd";

type PriceFilterProps = {
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
  priceRange: [number, number] | null;
  openFilter: boolean;
  onClose: () => void;
};


export const PriceFilter = ({
  min,
  max,
  onChange,
  priceRange,
  openFilter,
  onClose
}: PriceFilterProps) => {

  return (
    <div className="flex flex-col font-montserrat">
      <FilterTitle title="price" onClick={onClose} />
      {openFilter && (
        <>
          <Slider
            range
            min={min}
            max={max}
            value={priceRange || [min, max]}
            onChange={onChange}
            onChangeComplete={onChange}
            tooltip={{
              formatter: (val) => `$${val}`,
            }}
          />
          <div className="w-full flex items-center justify-between mt-2">
            <small className="text-xs text-blackish-green font-medium">
              ${priceRange?.[0] || min}
            </small>
            <small className="text-xs text-blackish-green font-medium">
              ${priceRange?.[1] || max}
            </small>
          </div>
        </>
      )}

      <div className="mt-8 w-full h-[0.5px] bg-blackish-green/25" />
    </div>
  );
};
