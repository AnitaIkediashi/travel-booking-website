export type CardFormDataPayload = {
  cardNumber: string;
  expDate: string;
  cvc: string;
  cardName: string;
  country: string;
  cardType?: string;
  saveCard: boolean;
};