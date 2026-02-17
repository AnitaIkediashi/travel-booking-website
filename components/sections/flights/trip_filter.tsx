import { FilterTitle } from "@/components/reusable/filter_title";
import { Checkbox } from "antd";

type TripFilterProps = {
  trips: {
    value: string | undefined;
    label: string | undefined;
  }[];
  openFilter: boolean;
  onClose: () => void;
  onChange: (types: string[]) => void;
  selectedTrips: string[];
};

export const TripFilter = ({ trips, openFilter, onClose, onChange, selectedTrips }: TripFilterProps) => {
  return (
    <div className="flex flex-col font-montserrat mt-8">
      <FilterTitle title="trips" onClick={onClose} />
      {openFilter && (
        <Checkbox.Group
          options={trips}
          onChange={(values) => onChange(values as string[])}
          value={selectedTrips}
        />
      )}
    </div>
  );
}