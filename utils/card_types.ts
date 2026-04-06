import { StaticImageData } from "next/image";

export const cardTypeLogoLight: Record<string, { src: string | StaticImageData, alt: string}> = {
    visa: {src: "/logos/light/visa_logo.png", alt: "Visa logo"},
    mastercard: {src: "/logos/light/mastercard_logo.png", alt: "Mastercard logo"},
    amex: {src: "/logos/light/american_express_logo.png", alt: "American Express logo"},
    diners: {src: "/logos/light/diners_club_logo.png", alt: "Diners Club logo"},
    union: {src: "/logos/light/unionpay_logo.png", alt: "Unionpay logo"},
    discover: {src: "/logos/light/discovercard_logo.png", alt: "Discover logo"}
}

export const cardTypeLogoDark: Record<string, { src: string | StaticImageData, alt: string}> = {
  visa: {src: "/logos/dark/visa.png", alt: "Visa logo"},
  mastercard: {src: "/logos/dark/mastercard.png", alt: "Mastercard logo"},
  amex: {src: "/logos/dark/american-express.png", alt: "American Express logo"},
  diners: {src: "/logos/dark/diners-club.png", alt: "Diners Club logo"},
  union: {src: "/logos/dark/unionpay.png", alt: "Unionpay logo"},
  discover: {src: "/logos/dark/discover.png", alt: "Discover logo"},
};