export type CardFormDataPayload = {
  cardName: string;
  country: string;
  cardType?: string;
  saveCard?: boolean;
};

export type PriceInfoProps = {
  currency_code: string | undefined;
  total_amount: number | undefined;
  base_amount: number | undefined;
  tax_amount: number | undefined;
  discount_amount: number | null | undefined;
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