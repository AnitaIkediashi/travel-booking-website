import { Button } from "./button";
import { CustomRadioTag } from "./custom_radio_tag";

export const FlightDropdown = () => {
  return (
    <div
      className={`absolute top-[42px] left-0 right-0 z-10 p-4 min-h-[200px] bg-white shadow-light rounded-sm font-montserrat text-blackish-green transition-all duration-300`}
    >
      <h4 className="border-b-[0.5px] border-b-blackish-green/40 mb-3 pb-2  text-sm font-semibold capitalize">
        passenger
      </h4>
      <div className="flex mb-3 items-center justify-between">
        <div className="flex flex-col">
          <span className="capitalize font-medium">adult</span>
          <span className="capitalize font-medium text-blackish-green/60">
            12+ years
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
          />
          <span>2</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
          />
        </div>
      </div>
      <div className="flex mb-3 items-center justify-between">
        <div className="flex flex-col">
          <span className="capitalize font-medium">children</span>
          <span className="capitalize font-medium text-blackish-green/60">
            0 - 11 years
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
          />
          <span>2</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
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
          selected="Economy"
          onClick={(value) => value}
        />
        <CustomRadioTag
          label="Premium Economy"
          value="PremiumEconomy"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected="PremiumEconomy"
          onClick={(value) => value}
        />
        <CustomRadioTag
          label="Business"
          value="Business"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected="Business"
          onClick={(value) => value}
        />
        <CustomRadioTag
          label="First Class"
          value="First"
          outerCircleClassName="border-mint-green-100"
          innerCircleClassName="bg-mint-green-100"
          selected="First"
          onClick={(value) => value}
        />
      </div>
    </div>
  );
}
