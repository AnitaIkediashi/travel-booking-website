import { Slider } from "antd";

type PriceFilterProps = {
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
  priceRange: [number, number] | null;
};

export const PriceFilter = ({min, max, onChange, priceRange}: PriceFilterProps) => {
    
  return (
    <div className="flex flex-col gap-4 font-montserrat">
      <h5 className="text-blackish-green font-semibold capitalize">price</h5>
      <Slider
        range
        min={min}
        max={max}
        value={priceRange || [min, max]}
        onChange={onChange}
        tooltip={{ formatter: (val) => `$${val}` }}
      />
    </div>
  );
};
