"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../reusable/button";
import { LeftArrowIcon } from "../icons/left_arrow";
import { AddCardForm } from "./add_card_form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, // for client 'pk'
);

export const AddPaymentForm = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="lg:w-[45%] w-full h-full flex flex-col justify-between gap-6">
      <div>
        <Image
          src="/logos/logo_mint.svg"
          alt="golobe logo"
          width={110.35}
          height={36}
        />
      </div>
      <div className="flex flex-col gap-6 flex-1">
        <div className="w-full flex items-center justify-between mb-4">
          <Button
            className="flex items-center gap-3 hover:font-semibold hover:underline hover:underline-offset-4 "
            icon={<LeftArrowIcon />}
            label="Back"
            labelClassName="text-sm font-medium"
            onClick={handleGoBack}
          />
          <Button
            label="skip"
            className="capitalize hover:font-semibold hover:underline hover:underline-offset-4 text-sm font-medium"
            href="/signin"
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <h2 className="capitalize font-bold text-[40px]">
            Add a payment method
          </h2>
          <p className="text-blackish-green/75">
            Let’s get you all st up so you can access your personal account.
          </p>
        </div>
        <div>
          <Elements stripe={stripePromise}>
            <AddCardForm />
          </Elements>
          <p className="my-4 text-center">
            By confirming your subscription, you allow The Outdoor Inn Crowd
            Limited to charge your card for this payment and future payments in
            accordance with their terms. You can always cancel your
            subscription.
          </p>
        </div>
      </div>
    </div>
  );
};
