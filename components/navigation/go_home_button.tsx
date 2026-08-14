"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/reusable/button";
import { RedirectIcon } from "@/components/icons/redirect";

export function GoHomeButton() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      label="Go back home"
      className="flex gap-3 items-center pb-2 border-b border-b-blackish-green md:text-2xl text-lg hover:border-b-2 hover:font-semibold"
      icon={<RedirectIcon />}
      onClick={handleGoHome}
    />
  );
}
