"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/reusable/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-[150px] h-12 rounded bg-mint-green-100 text-sm font-semibold 
        flex items-center justify-center hover:bg-blackish-green hover:text-white
        disabled:opacity-60 disabled:cursor-not-allowed"
      label={pending ? "Booking..." : "Book now"}
    />
  );
}
