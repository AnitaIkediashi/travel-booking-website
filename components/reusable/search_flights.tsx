'use client'
import { useState } from "react";
import { SwapIcon } from "../icons/swap";

export const SearchFlights = () => {
    const [swapInput, setSwapInput] = useState(false);
    const [initialValues, setInitialValues] = useState({
        fromValue: '',
        toValue: ''
    });

    const handleSwap = () => {
        setSwapInput(prev => !prev)
    }

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInitialValues(prevValues => {
            return {
              ...prevValues,
              [name]: value,
            };
        })
    };

    const inputClassName =
      "outline-none text-black-20 text-base w-full caret-black-20 focus:border-b-2 border-b-blue-500 transition-all duration-100 ease-in-out";

    const inputA = (
      <input
        key={swapInput ? "to" : "from"}
        name={swapInput ? "toValue" : "fromValue"}
        type="text"
        size={12}
        value={swapInput ? initialValues.toValue : initialValues.fromValue}
        className={inputClassName}
        onChange={handleLocationChange}
      />
    );
    const inputB = (
      <input
        key={swapInput ? "from" : "to"}
        name={swapInput ? "fromValue" : "toValue"}
        type="text"
        size={12}
        value={swapInput ? initialValues.fromValue : initialValues.toValue}
        className={inputClassName}
        onChange={handleLocationChange}
      />
    );
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_120px_1fr_1fr] xl:grid-cols-[1fr_140px_1fr_1fr] gap-6 font-montserrat">
      <div>
        <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
          <legend className="text-blackish-green text-sm capitalize">
            from - to
          </legend>
          <div className="w-full flex items-center space-between relative h-full">
            <div className="w-[calc(100%-48px)] flex items-center">
              <div className="w-1/2 mr-1">
                {inputA}
              </div>
              -
              <div className="w-1/2 ml-1">
                {inputB}
              </div>
            </div>
            <div className="w-12 h-12 grid place-items-center cursor-pointer" onClick={handleSwap}>
              <SwapIcon />
            </div>
          </div>
        </fieldset>
      </div>
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">trip</legend>
      </fieldset>
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">
          depart - return
        </legend>
      </fieldset>
      <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
        <legend className="text-blackish-green text-sm capitalize">
          passenger - class
        </legend>
      </fieldset>
    </div>
  );
};
