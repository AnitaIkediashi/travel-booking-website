"use client";

import { useEffect, useState } from "react";
import { AddCard } from "./add_card";
import { CreateCardForm } from "../modals/create_card_form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PriceInfoProps } from "@/types/card_type";
import { useCurrentUser } from "@/lib/auth-context";
import { MiniLogin } from "./mini_login";
import { CardDetails as CardDetailsType } from "@/app/generated/prisma/client";
import { getCardInfo, processPaymentWithSavedCard } from "@/lib/actions/card-actions";
import { toast, ToastContainer } from "react-toastify";
import { getSecureBookingUrl } from "@/lib/actions/encrypt-url-action";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./button";

type CardDetailsProps = {
  priceInfo: PriceInfoProps;
  flowType: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, // for client 'pk'
);

export const CardDetails = ({ priceInfo, flowType }: CardDetailsProps) => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const { isAuthenticated } = useCurrentUser();
  const [showCardForm, setShowCardForm] = useState(false);
  const [cards, setCards] = useState<CardDetailsType[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCards = async () => {
      const result = await getCardInfo();
      if (result.success && result.cards.length > 0) {
        setCards(result.cards);
        // setSelectedCardId(result.cards[0].id); // default select first card
      }
    };

    fetchCards();
  }, [isAuthenticated]);

  const handleOpenCardForm = () => {
    setShowCardForm(true);
  };

  const handleCloseCardForm = () => {
    setShowCardForm(false);
  };

  const handlePayWithSavedCard = async () => {
    if (!selectedCardId) {
      toast.error("Please select a card.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await processPaymentWithSavedCard(
        selectedCardId,
        priceInfo,
      );

      if (result.redirect) {
        router.push(result.redirect);
        return;
      }

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      if (result.status === "succeeded") {
        toast.success("Payment successful!");
        const currentParams = new URLSearchParams(searchParams.toString());
        const from = currentParams.get("from");
        const to = currentParams.get("to");
        const trip = currentParams.get("trip");
        const depart = currentParams.get("depart");
        const returnDate = currentParams.get("return");
        const adults = +(currentParams.get("adults") ?? 0); //convert to number
        const child = +(currentParams.get("child") ?? 0);
        const infant = +(currentParams.get("infant") ?? 0);
        const cabin = currentParams.get("cabin");
        const token = currentParams.get("token");
        const paymentIntentId = result.paymentIntentId

        const selectedCard = cards.find((card) => card.id === selectedCardId);
        const cardName = selectedCard ? selectedCard.cardName : "-";

        const bookingPayLoad = {
          flowType,
          cardName,
          from,
          to,
          depart,
          return: returnDate,
          adults,
          child,
          infant,
          cabin,
          trip,
          token,
          paymentIntentId,
        };

        const urlResponse = await getSecureBookingUrl(bookingPayLoad);

        if (urlResponse.success && urlResponse.bookingId) {
          const successPath =
            flowType === "flight"
              ? "/flight-flow/flight-search/booking-success"
              : "/hotel-flow/flight-search/booking-success";

          router.push(
            `${successPath}?bookingId=${encodeURIComponent(urlResponse.bookingId)}`,
          );
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="font-montserrat">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-3">
              {cards.length > 0 ? (
                cards.map((card) => {
                  const padMonth =
                    card.expMonth < 10
                      ? String(card.expMonth).padStart(2, "0")
                      : card.expMonth;
                  const shortenYear = String(card.expYear).slice(2);
                  return (
                    <div
                      className="w-full h-20 flex items-center justify-between bg-mint-green-100 rounded-xl p-4"
                      key={card.id}
                      onClick={() => {
                        setSelectedCardId(card.id);
                      }}
                    >
                      {/* card info */}
                      <div className="flex items-center gap-8">
                        {/* card type, last 4 digits, expiry date */}
                        <h2 className="text-xl font-bold">{card.cardType}</h2>
                        <div>
                          <span className="font-bold mr-2">
                            **** {card.last4}
                          </span>
                          <span className="text-sm">
                            {padMonth}/{shortenYear}
                          </span>
                        </div>
                      </div>
                      {/* radio button */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedCardId === card.id
                            ? "border-white border-2"
                            : "border-blackish-green-20"
                        }`}
                      >
                        {selectedCardId === card.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-blackish-green/75">
                  No saved cards yet.
                </p>
              )}
              {/* Pay button — only shows if a card is selected */}
              {selectedCardId && (
                <Button
                  type="button"
                  label={isLoading ? "Processing..." : "Pay now"}
                  className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded"
                  onClick={handlePayWithSavedCard}
                  disabled={isLoading}
                />
              )}
            </div>

            <AddCard onClick={handleOpenCardForm} />
          </div>
          <Elements stripe={stripePromise}>
            <CreateCardForm
              showCardForm={showCardForm}
              onClose={handleCloseCardForm}
              priceInfo={priceInfo}
              flowType={flowType}
            />
          </Elements>
        </div>
      ) : (
        <MiniLogin />
      )}
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </>
  );
};
