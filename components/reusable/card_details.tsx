"use client";

import { useState } from "react";
import { AddCard } from "./add_card";
import { CreateCardForm } from "../modals/create_card_form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PriceInfoProps } from "@/types/card_type";

type CardDetailsProps = {
  priceInfo: PriceInfoProps;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export const CardDetails = ({ priceInfo }: CardDetailsProps) => {
  const [showCardForm, setShowCardForm] = useState(false);

  const handleOpenCardForm = () => {
    setShowCardForm(true);
  };

  const handleCloseCardForm = () => {
    setShowCardForm(false);
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 font-montserrat">
        <div className="w-full h-20 flex items-center justify-between bg-mint-green-100 rounded-xl p-4">
          {/* card info */}
          <div className="flex items-center gap-8">
            {/* card type, last 4 digits, expiry date */}
          </div>
          {/* radio button */}
        </div>
        <AddCard onClick={handleOpenCardForm} />
      </div>
      <Elements stripe={stripePromise}>
        <CreateCardForm
          showCardForm={showCardForm}
          onClose={handleCloseCardForm}
          priceInfo={priceInfo}
          flowType="flight"
        />
      </Elements>
    </>
  );
};
