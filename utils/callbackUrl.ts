export const getSafeCallbackUrl = (raw: string | null | undefined) =>
  raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")
    ? raw
    : "/";
