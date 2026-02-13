import { Button } from "./button";
import { CustomRadioTag } from "./custom_radio_tag";

type FlightDropdownProps = {
  adultCount: number;
  child: number;
  infant: number;
  cabinType: string;
  onAdultIncrement: () => void;
  onAdultDecrement: () => void;
  onChildIncrement: () => void;
  onChildDecrement: () => void;
  onInfantIncrement: () => void;
  onInfantDecrement: () => void;
  onCabinClassChange: (value: string) => void;
  showDropDown?: boolean;
  onClose?: () => void;
};

export const FlightDropdown = ({
  adultCount,
  child,
  infant,
  cabinType,
  onAdultIncrement,
  onAdultDecrement,
  onChildIncrement,
  onChildDecrement,
  onInfantIncrement,
  onInfantDecrement,
  onCabinClassChange,
  showDropDown,
  onClose,
}: FlightDropdownProps) => {
  return (
    <div
      className={`absolute top-[59px] left-0 right-0 z-20 p-4 min-h-[200px] bg-white shadow-light rounded-sm font-montserrat text-blackish-green ${
        showDropDown ? "block" : "hidden"
      }`}
    >
      <h4 className="border-b-[0.5px] border-b-blackish-green/40 mb-3 pb-2  text-sm font-semibold capitalize">
        passenger
      </h4>
      <div className="flex mb-3 items-center justify-between">
        <div className="flex flex-col">
          <span className="capitalize font-medium">adult</span>
          <span className="capitalize font-medium text-blackish-green/60">
            18+ years
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onAdultIncrement}
          />
          <span>{adultCount}</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onAdultDecrement}
          />
        </div>
      </div>
      <div className="flex mb-3 items-center justify-between">
        <div className="flex flex-col">
          <span className="capitalize font-medium">child</span>
          <span className="capitalize font-medium text-blackish-green/60">
            5 - 17 years
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onChildIncrement}
          />
          <span>{child}</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onChildDecrement}
          />
        </div>
      </div>
      <div className="flex mb-3 items-center justify-between">
        <div className="flex flex-col">
          <span className="capitalize font-medium">infant</span>
          <span className="capitalize font-medium text-blackish-green/60">
            0 - 5 years
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onInfantIncrement}
          />
          <span>{infant}</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onInfantDecrement}
          />
        </div>
      </div>
      <h4 className="border-b-[0.5px] border-b-blackish-green/40 mb-3 pb-2  text-sm font-semibold capitalize">
        cabin class
      </h4>
      <div className="flex flex-col gap-2">
        <CustomRadioTag
          label="Economy"
          value="Economy"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected={cabinType}
          onClick={(value) => onCabinClassChange(value)}
        />
        <CustomRadioTag
          label="Premium Economy"
          value="Premium"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected={cabinType}
          onClick={(value) => onCabinClassChange(value)}
        />
        <CustomRadioTag
          label="Business"
          value="Business"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected={cabinType}
          onClick={(value) => onCabinClassChange(value)}
        />
        <CustomRadioTag
          label="First Class"
          value="First"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected={cabinType}
          onClick={(value) => onCabinClassChange(value)}
        />
      </div>
      <Button
        type="button"
        label="confirm"
        className="w-full h-12 flex items-center justify-center capitalize text-blackish-green bg-mint-green-100 hover:bg-blackish-green-10/30 transition ease-in-out duration-300 font-medium text-sm rounded-sm mt-3"
        onClick={onClose}
      />
    </div>
  );
};
