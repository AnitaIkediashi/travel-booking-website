'use client'

import { GoogleIcon } from "../icons/google";
import { Button } from "../reusable/button";
import Image from "next/image";
import { LeftArrowIcon } from "../icons/left_arrow";
import { inputClassName } from "@/utils/inputClassName";
import { useRouter } from "next/navigation";


export const ForgotPasswordForm = () => {

  const router = useRouter()

  const handleGoBackToLogin = () => {
    router.back()
  }

  function verifyPasswordClick() {
    router.push('/forgot-password?step=verify-password')
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
          onClick={handleGoBackToLogin}
        />
        <div className="flex flex-col gap-y-4">
          <h2 className="capitalize font-bold text-[40px]">
            Forgot your password?
          </h2>
          <p className="text-blackish-green/75">
            Don’t worry, happens to all of us. Enter your email below to recover
            your password
          </p>
        </div>
        <div>
          <form action="">
            <div className="flex flex-col gap-y-6 mb-8">
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    email
                  </legend>
                  <input
                    type="Email"
                    placeholder="Email"
                    name="email"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
            </div>
            <Button
              type="button"
              className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
              label={"submit"}
              onClick={verifyPasswordClick}
            />
          </form>
          <div className="mt-4 flex w-full gap-4 items-center">
            <hr className="bg-blackish-green/25 w-[calc(100%/3)] h-[0.5px]" />
            <span className="text-blackish-green/50 text-sm text-center">
              Or login with
            </span>
            <hr className="bg-blackish-green/25 w-[calc(100%/3)] h-[0.5px]" />
          </div>
          <div className="my-4">
            <Button
              type="button"
              icon={<GoogleIcon />}
              className="h-14 w-full bg-transparent border rounded border-mint-green-100 hover:bg-mint-green-50 flex items-center justify-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
