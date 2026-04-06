/**
 * NOTE: The Luhn Algorithm (also known as the "mod 10" algorithm) is a simple checksum formula used to validate a variety of identification numbers, such as credit card numbers. It catches most accidental typing errors (like swapping two digits).
 * The Benefit: It provides instant feedback. If a user mistypes one digit, the Luhn check will fail immediately.
 */

export const validateLuhn = (number: string) => {
  const digits = number.replace(/\D/g, "");
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0 && digits.length >= 13;
};