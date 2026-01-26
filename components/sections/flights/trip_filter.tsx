import { FilterTitle } from "@/components/reusable/filter_title";
import { Checkbox } from "antd";

type TripFilterProps = {
  trips: {
    value: "one-way" | "round-trip";
    label: string;
  }[];
  openFilter: boolean;
  onClose: () => void;
  onChange: (types: string[]) => void;
};

export const TripFilter = ({ trips, openFilter, onClose, onChange }: TripFilterProps) => {
  return (
    <div className="flex flex-col font-montserrat mt-8">
      <FilterTitle title="trips" onClick={onClose} />
      {openFilter && (
        <Checkbox.Group
          options={trips}
          onChange={(values) => onChange(values as string[])}
        />
      )}
    </div>
  );
}