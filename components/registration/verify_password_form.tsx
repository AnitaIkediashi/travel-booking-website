'use client'


import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../reusable/button";
import { LeftArrowIcon } from "../icons/left_arrow";
import { inputClassName } from "@/utils/inputClassName";

export const VerifyPasswordForm = () => {
    const router = useRouter();

  function resetPasswordClick() {
      router.push('/forgot-password?step=reset-password')
    }
  
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
            label="Back to login"
            labelClassName="text-sm font-medium"
            href={"/signin"}
          />
          <div className="flex flex-col gap-y-4">
            <h2 className="capitalize font-bold text-[40px]">Verify code</h2>
            <p className="text-blackish-green/75">
              An authentication code has been sent to your email.
            </p>
          </div>
          <div>
            <form action="">
              <div className="flex flex-col gap-y-4 mb-8">
                <div className="relative">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      enter code
                    </legend>
                    <input
                      type="text"
                      placeholder="Reset code"
                      name="resetCode"
                      className={inputClassName}
                    />
                  </fieldset>
                </div>
                <p className="text-sm font-medium">
                  Didn’t receive a code? <Button type="button" className="capitalize text-salmon-100 font-semibold hover:underline hover:underline-offset-4" label="resend" />
                </p>
              </div>
              <Button
                type="button"
                className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
                label={"verify"}
                onClick={resetPasswordClick}
              />
            </form>
          </div>
        </div>
      </div>
    );
}
