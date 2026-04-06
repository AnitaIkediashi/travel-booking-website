import { Checkbox, CheckboxChangeEvent, Select } from "antd";
import { CloseIcon } from "../icons/close";
import { Button } from "../reusable/button";
import countryList from "react-select-country-list";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { cardTypeLogoLight } from "@/utils/card_types";
import Image from "next/image";
import { validateLuhn } from "@/utils/luhnCheck";

/**
 * Partial<T> is a built-in utility type that constructs a new type where all properties of the original type T are set to optional
 */

type CreateCardFormProps = {
  showCardForm: boolean;
  onClose: () => void;
};

type CardFormData = {
  cardNumber: string;
  expDate: string;
  cvc: string;
  cardName: string;
  country: string;
  saveCard: boolean;
};

const inputClassName =
  "outline-none text-blackish-green-10 text-base w-full focus:border-2 focus:border-blue-500/10 focus:rounded-sm focus:border-b-blue-500 transition-all duration-100 ease-in-out";

export const CreateCardForm = ({
  showCardForm,
  onClose,
}: CreateCardFormProps) => {
  const CountryOptions = useMemo(() => countryList().getData(), []);

  const [cardFormData, setCardFormData] = useState<CardFormData>({
    cardNumber: "",
    expDate: "",
    cvc: "",
    cardName: "",
    country: "",
    saveCard: false,
  });

  const [errors, setErrors] = useState<Partial<CardFormData>>({});

  const countrySearch = (value: string) => {
    setCardFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };

  const handleCheckedInfo = (e: CheckboxChangeEvent) => {
    setCardFormData((prev) => ({
      ...prev,
      saveCard: e.target.checked,
    }));
  };

  //card type detection
  const detectCardType = useMemo(() => {
    const num = cardFormData.cardNumber.replace(/\s/g, ""); // Remove spaces
    if (/^4/.test(num)) return cardTypeLogoLight.visa;
    if (/^5[1-5]/.test(num)) return cardTypeLogoLight.mastercard;
    if (/^3[47]/.test(num)) return cardTypeLogoLight.amex;
    if (/^3(0[0-5]|[68])/.test(num)) return cardTypeLogoLight.diners;
    if (/^6(011|5)/.test(num)) return cardTypeLogoLight.discover;
    if (/^62/.test(num)) return cardTypeLogoLight.union;
    return "";
  }, [cardFormData.cardNumber]);

  const handleCardInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      // Remove all non-digits and add space every 4 digits
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim()
        .slice(0, 19);
    } else if (name === "expDate") {
      // Format as MM/YY
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(?=\d)/g, "$1/")
        .slice(0, 5);
    } else if (name === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setCardFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Clear error when user starts typing
    if (errors[name as keyof CardFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCardSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<CardFormData> = {};

    if (!validateLuhn(cardFormData.cardNumber))
      newErrors.cardNumber = "Invalid card number";
    if (cardFormData.expDate.length < 5) newErrors.expDate = "Invalid date";
    if (cardFormData.cvc.length < 2) newErrors.cvc = "Invalid CVC";
    if (!cardFormData.cardName) newErrors.cardName = "Name is required";
    if (!cardFormData.country) newErrors.country = "Select a country";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Success:", cardFormData);
      // Proceed with API call or Stripe integration
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-100 font-montserrat transition-opacity duration-300 ease-in-out ${
        showCardForm ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-light p-8 lg:px-16 lg:pb-16 lg:pt-[88.24px] w-full max-w-[640px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-h-[90vh] flex flex-col ${
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
        <div className="overflow-y-auto flex-1 min-h-0 hide_scroll">
          <h2 className="font-bold text-2xl md:text-[4xl] text-black mb-12">
            Add a new Card
          </h2>
          <form action="" onSubmit={handleCardSubmit}>
            <div className="flex flex-col gap-y-6 mb-10">
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    card number
                  </legend>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className={inputClassName}
                    value={cardFormData.cardNumber}
                    onChange={handleCardInputChange}
                  />
                  {detectCardType !== "" && (
                    <Image
                      src={detectCardType.src}
                      alt={detectCardType.alt}
                      width={24}
                      height={16}
                      className="absolute z-10 top-0.5 right-4 w-auto h-auto"
                    />
                  )}
                </fieldset>
                {errors.cardNumber && (
                  <span className="text-red-500 text-xs absolute -bottom-4">
                    {errors.cardNumber}
                  </span>
                )}
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
                      name="expDate"
                      className={inputClassName}
                      value={cardFormData.expDate}
                      onChange={handleCardInputChange}
                    />
                  </fieldset>
                  {errors.expDate && (
                    <span className="text-red-500 text-xs absolute -bottom-4">
                      {errors.expDate}
                    </span>
                  )}
                </div>
                <div className="relative lg:w-1/2 w-full">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
                    <legend className="text-blackish-green text-sm uppercase">
                      cvc
                    </legend>
                    <input
                      type="text"
                      placeholder="123"
                      name="cvc"
                      className={inputClassName}
                      value={cardFormData.cvc}
                      onChange={handleCardInputChange}
                    />
                  </fieldset>
                  {errors.cvc && (
                    <span className="text-red-500 text-xs absolute -bottom-4">
                      {errors.cvc}
                    </span>
                  )}
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
                    name="cardName"
                    className={inputClassName}
                    value={cardFormData.cardName}
                    onChange={handleCardInputChange}
                  />
                </fieldset>
                {errors.cardName && (
                  <span className="text-red-500 text-xs absolute -bottom-4">
                    {errors.cardName}
                  </span>
                )}
              </div>
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 select_wrapper">
                  <legend className="text-blackish-green text-sm">
                    Country or Region
                  </legend>
                  <Select
                    options={CountryOptions}
                    value={cardFormData.country}
                    allowClear
                    showSearch
                    className="w-full text-blackish-green-10"
                    onChange={countrySearch}
                  />
                </fieldset>
                {errors.country && (
                  <span className="text-red-500 text-xs absolute -bottom-4">
                    {errors.country}
                  </span>
                )}
              </div>
              <div className="relative">
                <Checkbox
                  name="saveCard"
                  checked={cardFormData.saveCard}
                  onChange={handleCheckedInfo}
                  className="text-blackish-green-10"
                >
                  Securely save my information for 1-click checkout
                </Checkbox>
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
                card for this payment and future payments in accordance with
                their terms. You can always cancel your subscription.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
