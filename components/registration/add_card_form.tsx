import { Checkbox, Select } from "antd";
import { Button } from "../reusable/button";
import { inputClassName } from "@/utils/inputClassName";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { useMemo } from "react";
import countryList from "react-select-country-list";

const stripeStyle = {
  base: {
    color: "#1c1b1f",
    fontWeight: "400",
    fontSize: "16px",
    fontFamily: "Montserrat, sans-serif",
    lineHeight: "24px",
  },
};

const stripeClasses = {
  base: "outline-none w-full transition-all duration-100",
  focus: "border-2 border-blue-500/10 border-b-blue-500 rounded-sm",
  invalid: "border-red-500 text-red-500",
};

export const AddCardForm = () => {
  const CountryOptions = useMemo(() => countryList().getData(), []);
  return (
    <form action="">
      <div className="flex flex-col gap-y-6 mb-8">
        <div className="relative">
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
            <legend className="text-blackish-green text-sm capitalize">
              card number
            </legend>
            <CardNumberElement
              options={{
                classes: stripeClasses,
                style: stripeStyle,
                showIcon: true,
                disableLink: true,
              }}
            />
          </fieldset>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-1/2">
            <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
              <legend className="text-blackish-green text-sm capitalize">
                exp. date
              </legend>
              <CardExpiryElement
                options={{
                  classes: stripeClasses,
                  style: stripeStyle,
                }}
              />
            </fieldset>
          </div>
          <div className="relative w-full md:w-1/2">
            <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
              <legend className="text-blackish-green text-sm uppercase">
                cvc
              </legend>
              <CardCvcElement
                options={{
                  classes: stripeClasses,
                  style: stripeStyle,
                }}
              />
            </fieldset>
          </div>
        </div>
        <div className="relative">
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
            <legend className="text-blackish-green text-sm">
              Name on Card
            </legend>
            <input
              type="text"
              placeholder="Type your name"
              name="cardName"
              className={inputClassName}
            />
          </fieldset>
        </div>
        <div className="relative">
          <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
            <legend className="text-blackish-green text-sm">
              Country or Region
            </legend>
            <Select
              options={CountryOptions}
              // value={cardFormData.country}
              allowClear
              showSearch={{
                optionFilterProp: "label",
              }}
              className="w-full text-blackish-green-10"
              // onChange={countrySearch}
            />
          </fieldset>
        </div>
        <Checkbox>Securely save my information for 1-click checkout</Checkbox>
      </div>
      <Button
        type="button"
        className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
        label={"Add payment method"}
      />
    </form>
  );
};
