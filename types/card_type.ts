export type CardFormDataPayload = {
  cardName: string;
  country: string;
  cardType?: string;
  saveCard?: boolean;
};

export type PriceInfoProps = {
  total?: { currency_code: string | undefined; amount: number | undefined };
  base_fare?: { amount: number | undefined };
  tax?: { amount: number | undefined };
  discount?: { amount: number | undefined };
  service_fee?: { amount: number | undefined };
};

export type SaveCardOnSignupPayload = {
  stripePaymentMethodId: string;
  cardType: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardName: string;
  country: string;
};