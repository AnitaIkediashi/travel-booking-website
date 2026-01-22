import { FilterTitle } from "@/components/reusable/filter_title";
import { convertMinutesToTime } from "@/helpers/convertNumberToTime";
import { Slider } from "antd";

type TimeFilterProps = {
  min: number;
  max: number;
  onChange: (value: number | number[]) => void;
  timeRange: [number, number] | null;
  openFilter: boolean;
  onClose: () => void;
};

export const TimeFilter = ({min, max, onChange, timeRange, openFilter, onClose}: TimeFilterProps) => {
  return (
    <div className="flex flex-col font-montserrat mt-8">
      <FilterTitle title="departure time" onClick={onClose} />
      {openFilter && (
        <>
          <Slider
            range
            min={min}
            max={max}
            value={timeRange || [min, max]}
            onChange={onChange}
            onChangeComplete={onChange}
            tooltip={{
              formatter: (val) => convertMinutesToTime(val || 0),
            }}
          />
          <div className="w-full flex items-center justify-between mt-2">
            <small className="text-xs text-blackish-green font-medium">
              {convertMinutesToTime(timeRange?.[0] || min)}
            </small>
            <small className="text-xs text-blackish-green font-medium">
              {convertMinutesToTime(timeRange?.[1] || max)}
            </small>
          </div>
        </>
      )}
      <div className="mt-8 w-full h-[0.5px] bg-blackish-green/25" />
    </div>
  );
}