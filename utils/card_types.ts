import { StaticImageData } from "next/image";

export const cardTypeLogoLight: Record<string, { src: string | StaticImageData, alt: string}> = {
    visa: {src: "/logos/light/visa_logo.png", alt: "Visa"},
    mastercard: {src: "/logos/light/mastercard_logo.png", alt: "Mastercard"},
    amex: {src: "/logos/light/american_express_logo.png", alt: "American Express"},
    diners: {src: "/logos/light/diners_club_logo.png", alt: "Diners Club"},
    union: {src: "/logos/light/unionpay_logo.png", alt: "Unionpay"},
    discover: {src: "/logos/light/discovercard_logo.png", alt: "Discover"}
}

export const cardTypeLogoDark: Record<string, { src: string | StaticImageData, alt: string}> = {
  visa: {src: "/logos/dark/visa.png", alt: "Visa"},
  mastercard: {src: "/logos/dark/mastercard.png", alt: "Mastercard"},
  amex: {src: "/logos/dark/american-express.png", alt: "American Express"},
  diners: {src: "/logos/dark/diners-club.png", alt: "Diners Club"},
  union: {src: "/logos/dark/unionpay.png", alt: "Unionpay"},
  discover: {src: "/logos/dark/discover.png", alt: "Discover"},
};