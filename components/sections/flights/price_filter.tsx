import { Slider } from "antd";

type PriceFilterProps = {
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
  priceRange: [number, number] | null;
};


export const PriceFilter = ({
  min,
  max,
  onChange,
  priceRange,
}: PriceFilterProps) => {

  return (
    <div className="flex flex-col gap-4 font-montserrat">
      <h5 className="text-blackish-green font-semibold capitalize">price</h5>
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
      <div className="w-full flex items-center justify-between">
        <small className="text-xs text-blackish-green font-medium">
          ${priceRange?.[0] || min}
        </small>
        <small className="text-xs text-blackish-green font-medium">
          ${priceRange?.[1] || max}
        </small>
      </div>
    </div>
  );
};
