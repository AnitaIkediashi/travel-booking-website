'use client'

import Image from "next/image";
import { Button } from "../reusable/button";
import { inputClassName } from "@/utils/inputClassName";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "../icons/google";
import { Checkbox } from "antd";
import Link from "next/link";


export const SignUpForm = () => {

    const router = useRouter()

    function addPaymentOption() {
        router.push("/signup?step=add-payment");
    }

  return (
    <div className="lg:w-[60%] w-full h-full flex flex-col justify-between gap-6">
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
          <h2 className="capitalize font-bold text-[40px]">Sign up</h2>
          <p className="text-blackish-green/75">
            Let’s get you all st up so you can access your personal account.
          </p>
        </div>
        <div>
          <form action="">
            <div className="flex flex-col gap-y-6 mb-8">
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
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-1/2">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      email
                    </legend>
                    <input
                      type="email"
                      placeholder="Type your email"
                      name="email"
                      className={inputClassName}
                    />
                  </fieldset>
                </div>
                <div className="relative w-full md:w-1/2">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      phone number
                    </legend>
                    <input
                      type="number"
                      placeholder="Type your phone number"
                      name="phoneNo"
                      className={inputClassName}
                    />
                  </fieldset>
                </div>
              </div>
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    password
                  </legend>
                  <input
                    type="password"
                    placeholder="Type your password"
                    name="password"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    confirm password
                  </legend>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <Checkbox name="rememberMe" className="text-blackish-green-10">
                I agree to all the Terms and Privacy Policies
              </Checkbox>
            </div>
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                type="button"
                className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
                label={"Create account"}
                onClick={addPaymentOption}
              />
              <p className="text-center text-sm font-semibold">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="capitalize text-salmon-100 hover:underline hover:underline-offset-4"
                >
                  login
                </Link>
              </p>
            </div>
          </form>
          <div className="mt-4 flex w-full gap-4 items-center">
            <hr className="bg-blackish-green/25 w-[calc(100%/3)] h-[0.5px]" />
            <span className="text-blackish-green/50 text-sm text-center">
              Or sign up with
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
}
