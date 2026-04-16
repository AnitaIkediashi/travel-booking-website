import { Checkbox, CheckboxChangeEvent, Select } from "antd";
import { CloseIcon } from "../icons/close";
import { Button } from "../reusable/button";
import countryList from "react-select-country-list";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { inputClassName } from "@/utils/inputClassName";
import { processPaymentIntent, saveCardToDatabase } from "@/lib/actions/card-actions";
import { ToastContainer, toast } from "react-toastify";
import { CardFormDataPayload, PriceInfoProps } from "@/types/card_type";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { z } from "zod";
import { useRouter } from "next/navigation";

/**
 * Partial<T> is a built-in utility type that constructs a new type where all properties of the original type T are set to optional
 * test() returns boolean indicating whether the regex matches the string
 */

type CreateCardFormProps = {
  showCardForm: boolean;
  onClose: () => void;
  priceInfo: PriceInfoProps
  flowType: string;
};

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


export const CreateCardForm = ({
  showCardForm,
  onClose,
  priceInfo,
  flowType
}: CreateCardFormProps) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const CountryOptions = useMemo(() => countryList().getData(), []);

  const [cardFormData, setCardFormData] = useState<CardFormDataPayload>({
    cardName: "",
    country: "",
    saveCard: false,
  });

  const [errors, setErrors] =
    useState<z.ZodFormattedError<CardFormDataPayload> | null>(null);

  const [isLoading, setIsLoading] = useState(false);

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

  const handleCardInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCardFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors && name in errors) {
      setErrors((prev) => {
        if (!prev) return null;

        // We create a copy and cast it to 'any' internally just for the deletion,
        // or better, use a rest-spread to omit the key without 'any'
        const {
          [name as keyof z.ZodFormattedError<CardFormDataPayload>]: _,
          ...remainingErrors
        } = prev;

        return remainingErrors as z.ZodFormattedError<CardFormDataPayload>;
      });
    }
  };

  const handleCardSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrors(null);

    try {
      // 1. Initialize the Payment Intent on the server
      const intentResponse = await processPaymentIntent(
        cardFormData,
        priceInfo,
      );

      if (!intentResponse.success) {
        if (intentResponse.errors) {
          // This will now be type-compatible!
          setErrors(
            intentResponse.errors as z.ZodFormattedError<CardFormDataPayload>,
          );
        } else {
          toast.error(intentResponse.message || "Failed to initialize payment");
        }
        setIsLoading(false);
        return;
      }

      // 2. Confirm the payment with the Stripe SDK
      const cardNumberElement = elements.getElement(CardNumberElement);

      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(intentResponse.clientSecret!, {
          payment_method: {
            card: cardNumberElement!,
            billing_details: {
              name: cardFormData.cardName,
              address: { country: cardFormData.country },
            },
          },
        });

      if (stripeError) {
        toast.error(stripeError.message);
        setIsLoading(false);
        return;
      }

      // 3. Finalize DB saving if successful and saveCard was checked
      if (paymentIntent.status === "succeeded") {
        if (cardFormData.saveCard) {
          const saveResult = await saveCardToDatabase(paymentIntent.id);

          // CHECK if the card already exists
          if (saveResult?.hasCardAlreadyCreated) {
            toast.error("This card is already saved in your account.");
            setIsLoading(false);
            return; // STOP the function here so it doesn't redirect
          }
        }

        toast.success("Payment successful!");

        // Reset and close
        setCardFormData({ cardName: "", country: "", saveCard: false });
        onClose();

        const successPath =
          flowType === "flight"
            ? "/flight-flow/booking-confirmation"
            : "/hotel-flow/booking-confirmation";

        // Append the payment_intent ID if your success page needs to fetch details
        router.push(`${successPath}?payment_intent=${paymentIntent.id}`);

        // Optional: Redirect user to a success or booking page
        // window.location.href = "/booking-confirmation";
      }
    } catch (error) {
      console.error("Submission failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                    <CardNumberElement
                      options={{
                        classes: stripeClasses,
                        style: stripeStyle,
                        showIcon: true, // Bonus: Shows the Visa/Mastercard logo
                        disableLink: true, // removes the save card link that appears on some browsers
                      }}
                    />
                  </fieldset>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="relative lg:w-1/2 w-full">
                    <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
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
                  <div className="relative lg:w-1/2 w-full">
                    <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3">
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
                  {errors?.cardName?._errors?.[0] && (
                    <span className="text-red-500 text-xs absolute -bottom-4">
                      {errors.cardName._errors[0]}
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
                  {errors?.country?._errors?.[0] && (
                    <span className="text-red-500 text-xs absolute -bottom-4">
                      {errors.country._errors[0]}
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
                  label={isLoading ? "processing..." : "add card"}
                  className="bg-mint-green-100 capitalize text-sm font-semibold w-full mb-4 h-12 rounded"
                />
                <p className="text-center text-xs opacity-75">
                  By confirming your subscription, you allow Stripe to charge
                  your card for this payment and future payments in accordance
                  with their terms. You can always cancel your subscription.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </>
  );
};
