import { Button } from "./button";

type HotelDropdownProps = {
  onClose: () => void;
  showDropDown?: boolean;
  adultCount: number;
  childrenCount: number;
  roomCount: number;
  onAdultIncrement: () => void;
  onAdultDecrement: () => void;
  onChildrenIncrement: () => void;
  onChildrenDecrement: () => void;
  onRoomIncrement: () => void;
  onRoomDecrement: () => void;
};

export const StaysDropdown = ({
  onClose,
  showDropDown,
  adultCount,
  childrenCount,
  roomCount,
  onAdultIncrement,
  onAdultDecrement,
  onChildrenIncrement,
  onChildrenDecrement,
  onRoomIncrement,
  onRoomDecrement,
}: HotelDropdownProps) => {
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
            18 or above
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
          <span className="capitalize font-medium">children</span>
          <span className="capitalize font-medium text-blackish-green/60">
            0 - 17 years
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onChildrenIncrement}
          />
          <span>{childrenCount}</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onChildrenDecrement}
          />
        </div>
      </div>
      <h4 className="border-b-[0.5px] border-b-blackish-green/40 mb-3 pb-2  text-sm font-semibold capitalize">
        no of rooms
      </h4>
      <div className="flex mb-3 items-center justify-between">
        <div className="flex flex-col">
          <span className="capitalize font-medium">rooms</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            label="+"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onRoomIncrement}
          />
          <span>{roomCount}</span>
          <Button
            type="button"
            label="-"
            className="md:w-[30px] md:h-[30px] w-7 h-7 rounded-lg grid place-items-center border border-blackish-green/40 font-medium text-lg"
            onClick={onRoomDecrement}
          />
        </div>
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