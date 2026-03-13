import { Select } from "antd";
import { CloseIcon } from "../icons/close";
import { Button } from "../reusable/button";
import countryList from "react-select-country-list";
import { useMemo, useState } from "react";

type CreateCardFormProps = {
  showCardForm: boolean;
  onClose: () => void;
};

const inputClassName =
  "outline-none text-blackish-green-10 text-base w-full focus:border-2 focus:border-blue-500/10 focus:rounded-sm focus:border-b-blue-500 transition-all duration-100 ease-in-out";

export const CreateCardForm = ({
  showCardForm,
  onClose,
}: CreateCardFormProps) => {
  const CountryOptions = useMemo(() => countryList().getData(), []);

  const [searchCountry, setSearchCountry] = useState('')

  const countrySearch = (value: string) => {
    setSearchCountry(value)
  }

  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-100 font-montserrat transition-opacity duration-300 ease-in-out ${
        showCardForm ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-light p-8 md:px-16 md:pb-16 md:pt-[88.24px] w-full max-w-[640px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          showCardForm
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        <div className="flex justify-end">
          <div
            className="cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-blackish-green-10/50 transition-colors duration-200"
            onClick={onClose}
          >
            <CloseIcon />
          </div>
        </div>
        <h2 className="font-bold text-2xl md:text-[4xl] text-black mb-12">
          Add a new Card
        </h2>
        <form action="">
          <div className="flex flex-col gap-y-6 mb-10">
            <div className="relative">
              <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
                <legend className="text-blackish-green text-sm capitalize">
                  card number
                </legend>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className={inputClassName}
                />
              </fieldset>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative lg:w-1/2 w-full">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
                  <legend className="text-blackish-green text-sm capitalize">
                    exp. date
                  </legend>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <div className="relative lg:w-1/2 w-full">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
                  <legend className="text-blackish-green text-sm uppercase">
                    cvc
                  </legend>
                  <input
                    type="text"
                    placeholder="123"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
            </div>
            <div className="relative">
              <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
                <legend className="text-blackish-green text-sm">
                  Name on Card
                </legend>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={inputClassName}
                />
              </fieldset>
            </div>
            <div className="relative">
              <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 select_wrapper">
                <legend className="text-blackish-green text-sm">
                  Country or Region
                </legend>
                <Select
                  options={CountryOptions}
                  value={searchCountry}
                  allowClear
                  showSearch
                  className="w-full text-blackish-green-10"
                  onChange={countrySearch}
                />
              </fieldset>
            </div>
          </div>
          <div className="w-full">
            <Button
              type="submit"
              label="add card"
              className="bg-mint-green-100 capitalize text-sm font-semibold w-full mb-4 h-12 rounded"
            />
            <p className="text-center text-xs opacity-75">
              By confirming your subscription, you allow Stripe to charge your
              card for this payment and future payments in accordance with their
              terms. You can always cancel your subscription.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
