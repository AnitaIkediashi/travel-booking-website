'use client'

import { inputClassName } from "@/utils/inputClassName";
import Image from "next/image";
import { Button } from "../reusable/button";



export const ResetPasswordForm = () => {
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
        <div className="flex flex-col gap-y-4">
          <h2 className="capitalize font-bold text-[40px]">Set a password</h2>
          <p className="text-blackish-green/75">
            Your previous password has been reseted. Please set a new password
            for your account.
          </p>
        </div>
        <div>
          <form action="">
            <div className="flex flex-col gap-y-6 mb-8">
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    create password
                  </legend>
                  <input
                    type="password"
                    placeholder="Create Password"
                    name="createPassword"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    re-enter password
                  </legend>
                  <input
                    type="password"
                    placeholder="Re-enter Password"
                    name="reEnterPassword"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
              label={"set password"}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
