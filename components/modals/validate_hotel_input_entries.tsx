import { CloseIcon } from "../icons/close";
import { Button } from "../reusable/button";
import { InitialState } from "../reusable/search_stays";

type ValidateHotelEntries = {
  hotelInputEntries: InitialState;
  onClose: () => void;
  showModal: boolean;
};

export const ValidateHotelInputEntries = ({hotelInputEntries, onClose, showModal}: ValidateHotelEntries) => {
  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-100 font-montserrat transition-opacity duration-300 ease-in-out ${
        showModal ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-light p-8 w-[500px] relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          showModal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        <div
          className="absolute top-4 right-4 cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-blackish-green-10/50 transition-colors duration-200"
          onClick={onClose}
        >
          <CloseIcon />
        </div>
        <h2 className="font-semibold text-xl py-2">
          An error occurred while trying to perform your search
        </h2>
        <ul className="flex flex-col gap-2">
          {hotelInputEntries.destination.trim() === "" && (
            <li className="text-sm font-medium">
              Please enter a &apos;destination&apos;
            </li>
          )}

          {!hotelInputEntries.checkInDate && (
            <li className="text-sm font-medium">
              Please select a &apos;Check in date&apos;
            </li>
          )}

          {!hotelInputEntries.checkOutDate && (
            <li className="text-sm font-medium">
              Please select a &apos;Check out date&apos;
            </li>
          )}
        </ul>
        <Button
          className="mt-6 w-full h-12 flex items-center justify-center bg-mint-green-100 text-blackish-green hover:bg-blackish-green-10 hover:text-white duration-200 capitalize font-semibold rounded-xl"
          label="dismiss"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
