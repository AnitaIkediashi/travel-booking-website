"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../reusable/button";
import { LeftArrowIcon } from "../icons/left_arrow";
import { inputClassName } from "@/utils/inputClassName";
import { Checkbox } from "antd";

export const AddPaymentForm = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="lg:w-[45%] w-full h-full flex flex-col justify-between gap-6">
      <div>
        <Image
          src="/logos/logo_mint.svg"
          alt="golobe logo"
          width={110.35}
          height={36}
        />
      </div>
      <div className="flex flex-col gap-6 flex-1">
        <Button
          className="flex items-center gap-3 hover:font-semibold hover:underline hover:underline-offset-4 mb-4"
          icon={<LeftArrowIcon />}
          label="Back"
          labelClassName="text-sm font-medium"
          onClick={handleGoBack}
        />
        <div className="flex flex-col gap-y-4">
          <h2 className="capitalize font-bold text-[40px]">
            Add a payment method
          </h2>
          <p className="text-blackish-green/75">
            Let’s get you all st up so you can access your personal account.
          </p>
        </div>
        <div>
          <form action="">
            <div className="flex flex-col gap-y-6 mb-8">
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    card number
                  </legend>
                  <input
                    type="Email"
                    placeholder="Email"
                    name="email"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-1/2">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      first name
                    </legend>
                    <input
                      type="text"
                      placeholder="Type your first name"
                      name="firstName"
                      className={inputClassName}
                    />
                  </fieldset>
                </div>
                <div className="relative w-full md:w-1/2">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      last name
                    </legend>
                    <input
                      type="text"
                      placeholder="Type your last name"
                      name="lastName"
                      className={inputClassName}
                    />
                  </fieldset>
                </div>
              </div>
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    card number
                  </legend>
                  <input
                    type="Email"
                    placeholder="Email"
                    name="email"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    card number
                  </legend>
                  <input
                    type="Email"
                    placeholder="Email"
                    name="email"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <Checkbox>
                Securely save my information for 1-click checkout
              </Checkbox>
            </div>
            <Button
              type="button"
              className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
              label={"Add payment method"}
            />
          </form>
          <p className="my-4 text-center">
            By confirming your subscription, you allow The Outdoor Inn Crowd
            Limited to charge your card for this payment and future payments in
            accordance with their terms. You can always cancel your
            subscription.
          </p>
        </div>
      </div>
    </div>
  );
};
