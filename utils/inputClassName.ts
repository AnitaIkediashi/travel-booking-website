export const inputClassName =
  "outline-none text-blackish-green-10 text-base w-full focus:border-2 focus:border-blue-500/10 focus:rounded-sm focus:border-b-blue-500 transition-all duration-100 ease-in-out";

export const autoCapitalizeWords = (value: string): string => {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const cleanCardName = (v: string) =>
  v.replace(/[^\p{L}\p{M} '’.-]/gu, "").replace(/\s{2,}/g, " ");