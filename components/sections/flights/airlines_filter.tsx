import { FilterTitle } from "@/components/reusable/filter_title"
import { Checkbox } from "antd";

type AirlinesFilterProps = {
  airlines: Airlines | undefined;
  openFilter: boolean;
  onClose: () => void;
};

type Airlines = {
  name: string | undefined;
  code: string | undefined;
}[]

export const AirlinesFilter = ({ airlines, openFilter, onClose }: AirlinesFilterProps) => {
    const airlineOptions = airlines?.map((airline) => {
        return {
            label: airline.name,
            value: airline.code
        }
    })
  return (
    <div className="flex flex-col font-montserrat mt-8">
      <FilterTitle title="airlines" onClick={onClose} />
      {openFilter && <Checkbox.Group options={airlineOptions} />}
      <div className="mt-8 w-full h-[0.5px] bg-blackish-green/25" />
    </div>
  );
}
