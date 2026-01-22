import { FilterTitle } from "@/components/reusable/filter_title";
import { Checkbox } from "antd";

type TripFilterProps = {
  trips: {
    value: "one-way" | "round-trip";
    label: string;
  }[];
  openFilter: boolean;
  onClose: () => void;
};

export const TripFilter = ({ trips, openFilter, onClose }: TripFilterProps) => {
  return (
    <div className="flex flex-col font-montserrat mt-8">
      <FilterTitle title="trips" onClick={onClose} />
      {openFilter && <Checkbox.Group options={trips} />}
    </div>
  );
}