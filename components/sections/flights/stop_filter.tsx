import { FilterTitle } from "@/components/reusable/filter_title";
import { Checkbox } from "antd";

type StopFilterProps = {
  openFilter: boolean;
  onClose: () => void;
  onChange: (codes: number[]) => void;
  selectedStops: number[];
};

const options = [
    {label: 'non stop', value: 0},
    {label: '1 stop', value: 1},
    {label: '2 stop', value: 2},
]

export const StopFilter = ({openFilter, onChange, onClose, selectedStops}: StopFilterProps) => {
  return (
    <div className="flex flex-col font-montserrat mt-8">
      <FilterTitle title="stops" onClick={onClose} />
      {openFilter && (
        <Checkbox.Group
          options={options}
          onChange={(checkedValues) => onChange(checkedValues as number[])}
          value={selectedStops}
        />
      )}
    </div>
  );
}
