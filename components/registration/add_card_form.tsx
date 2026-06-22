"use client";

import { Select } from "antd";
import { Button } from "../reusable/button";
import { inputClassName } from "@/utils/inputClassName";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import countryList from "react-select-country-list";
import { CardFormDataPayload } from "@/types/card_type";
import z from "zod";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { saveCardOnSignup } from "@/lib/actions/card-actions";

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
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const CountryOptions = useMemo(() => countryList().getData(), []);

  const [cardFormData, setCardFormData] = useState<CardFormDataPayload>({
    cardName: "",
    country: "",
  });

  const [errors, setErrors] = useState<ReturnType<
    typeof z.treeifyError<CardFormDataPayload>
  > | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const countrySearch = (value: string) => {
    setCardFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };

  const handleCardInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCardFormData((prev) => ({ ...prev, [name]: value }));
    const fieldName = name as keyof NonNullable<typeof errors>["properties"];

    if (errors?.properties && fieldName in errors.properties) {
      setErrors((prev) => {
        if (!prev || !prev.properties) return prev;

        const { [fieldName]: _, ...remainingProperties } = prev.properties;

        return {
          ...prev,
          properties: remainingProperties,
        };
      });
    }
  };

  const handleCardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrors(null);
    try {
      const cardNumberElement = elements.getElement(CardNumberElement);

      // 1. Tokenize the card — no charge, no intent
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement!,
          billing_details: {
            name: cardFormData.cardName,
            address: { country: cardFormData.country },
          },
        });

      if (stripeError) {
        toast.error(stripeError.message);
        return;
      }

      const saveResult = await saveCardOnSignup({
        stripePaymentMethodId: paymentMethod.id,
        cardType: paymentMethod.card!.brand,
        last4: paymentMethod.card!.last4,
        expMonth: paymentMethod.card!.exp_month,
        expYear: paymentMethod.card!.exp_year,
        cardName: cardFormData.cardName,
        country: cardFormData.country,
      });

      if (saveResult.redirect) {
        router.push(saveResult.redirect);
        return;
      }

      if (saveResult.hasCardAlreadyCreated) {
        toast.error("This card is already saved in your account.");
        return;
      }

      if (!saveResult.success) {
        toast.error(saveResult.message);
        return;
      }

      toast.success("Card saved successfully!");
      router.push("/signin"); // wherever after signup completes
    } catch (error) {
      console.error("Card setup failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form action="" onSubmit={handleCardSubmit}>
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
                value={cardFormData.cardName}
                onChange={handleCardInputChange}
              />
            </fieldset>
            {errors?.properties?.cardName?.errors?.[0] && (
              <span className="text-red-500 text-xs absolute -bottom-4">
                {errors.properties.cardName.errors[0]}
              </span>
            )}
          </div>
          <div className="relative">
            <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
              <legend className="text-blackish-green text-sm">
                Country or Region
              </legend>
              <Select
                options={CountryOptions}
                value={cardFormData.country}
                allowClear
                showSearch={{
                  optionFilterProp: "label",
                }}
                className="w-full text-blackish-green-10"
                onChange={countrySearch}
              />
            </fieldset>
            {errors?.properties?.country?.errors?.[0] && (
              <span className="text-red-500 text-xs absolute -bottom-4">
                {errors.properties.country.errors[0]}
              </span>
            )}
          </div>
        </div>
        <Button
          type="submit"
          className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
          label={isLoading ? "Processing..." : "Add payment method"}
          disabled={isLoading ? true : false}
        />
      </form>
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </>
  );
};
