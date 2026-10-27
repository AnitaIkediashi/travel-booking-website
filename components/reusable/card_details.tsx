"use client";

import { useEffect, useState } from "react";
import { AddCard } from "./add_card";
import { CreateCardForm } from "../modals/create_card_form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCurrentUser } from "@/lib/auth-context";
import { CardDetails as CardDetailsType } from "@/app/generated/prisma/client";
import {
  getCardInfo,
  processPaymentWithSavedCard,
} from "@/lib/actions/card-actions";
import { toast, ToastContainer } from "react-toastify";
import { getSecureBookingUrl } from "@/lib/actions/encrypt-url-action";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { CardForm } from "./card_form";
import {
  confirmBookingByFlow,
  getSuccessPath,
} from "@/lib/booking_flow";

type CardDetailsProps = {
  flowType: string;
  bookingId: string | undefined;
  liveSeatFeesTotal?: number;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, // for client 'pk'
);

export const CardDetails = ({
  flowType,
  bookingId,
}: CardDetailsProps) => {
  const router = useRouter();
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
    if (!bookingId) {
      toast.error("Booking not found.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await processPaymentWithSavedCard(
        selectedCardId,
        bookingId,
        flowType,
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
        const confirmResult = await confirmBookingByFlow(
          flowType,
          bookingId,
          result.paymentIntentId,
        );
        if (!confirmResult.success) {
          toast.error(
            "Payment succeeded but booking confirmation failed. Please contact support.",
          );
          return;
        }

        toast.success("Payment successful!");

        const urlResponse = await getSecureBookingUrl(
          bookingId,
          flowType === "hotel" ? "hotel" : "flight",
        );
        if (urlResponse.success && urlResponse.bookingId) {
          router.push(
            `${getSuccessPath(flowType)}?bookingId=${encodeURIComponent(urlResponse.bookingId)}`,
          );
        }
      }
    } catch (error) {
      console.error(error);
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
                      <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-3">
                        {/* card type, last 4 digits, expiry date */}
                        <h2 className="md:text-xl text-lg font-bold uppercase">
                          {card.cardType}
                        </h2>
                        <div>
                          <span className="font-bold mr-2 text-sm md:text-base">
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
                <p className="text-sm text-blackish-green/75 font-medium">
                  No saved cards yet.
                </p>
              )}
              {/* Pay button — only shows if a card is selected */}
              {selectedCardId && (
                <Button
                  type="button"
                  label={isLoading ? "Processing..." : "Pay now"}
                  className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded disabled:opacity-60 disabled:cursor-not-allowed"
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
              flowType={flowType}
              bookingId={bookingId}
            />
          </Elements>
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <CardForm flowType={flowType} bookingId={bookingId} />
        </Elements>
      )}
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </>
  );
};

