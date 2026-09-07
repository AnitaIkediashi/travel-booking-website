import { prisma } from "../lib/prisma";
import { faker } from "@faker-js/faker";

const SUPPORTED_CURRENCIES = [
  { name: "US Dollar", code: "USD", symbol: "$" },
  { name: "Euro", code: "EUR", symbol: "€" },
  { name: "British Pound", code: "GBP", symbol: "£" },
  { name: "Nigerian Naira", code: "NGN", symbol: "₦" },
  { name: "Japanese Yen", code: "JPY", symbol: "¥" },
  { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
  { name: "Canadian Dollar", code: "CAD", symbol: "$" },
  { name: "Australian Dollar", code: "AUD", symbol: "$" },
  { name: "Swiss Franc", code: "CHF", symbol: "Fr" },
  { name: "South African Rand", code: "ZAR", symbol: "R" },
  { name: "UAE Dirham", code: "AED", symbol: "د.إ" },
  { name: "Indian Rupee", code: "INR", symbol: "₹" },
  { name: "Singapore Dollar", code: "SGD", symbol: "$" },
  { name: "Ghanaian Cedi", code: "GHS", symbol: "₵" },
  { name: "Kenyan Shilling", code: "KES", symbol: "KSh" },
  { name: "Egyptian Pound", code: "EGP", symbol: "£" },
  { name: "Brazilian Real", code: "BRL", symbol: "R$" },
  { name: "Mexican Peso", code: "MXN", symbol: "$" },
  { name: "Turkish Lira", code: "TRY", symbol: "₺" },
  { name: "South Korean Won", code: "KRW", symbol: "₩" },
];

// -- Populate fake currencies --
function populateFakeCurrencies() {
  const count = faker.number.int({ min: 10, max: SUPPORTED_CURRENCIES.length });
  return faker.helpers.arrayElements(SUPPORTED_CURRENCIES, count);
  
}
