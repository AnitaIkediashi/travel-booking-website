import { inputClassName } from "@/utils/inputClassName";
import { Checkbox } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../reusable/button";
import { GoogleIcon } from "../icons/google";

export const SignInForm = () => {
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
          <h2 className="capitalize font-bold text-[40px]">login</h2>
          <p className="text-blackish-green/75">
            Login to access your Golobe account
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
              <div className="relative">
                <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                  <legend className="text-blackish-green text-sm capitalize">
                    password
                  </legend>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className={inputClassName}
                  />
                </fieldset>
              </div>
              <div className="flex items-center justify-between">
                <Checkbox name="rememberMe" className="text-blackish-green-10">
                  Remember me
                </Checkbox>
                <Link
                  href="/forgot-password"
                  className="capitalize text-sm text-salmon-100 font-medium hover:underline hover:underline-offset-4"
                >
                  forgot password
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                type="submit"
                className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white"
                label={"login"}
              />
              <p className="text-center text-sm font-semibold">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  className="capitalize text-salmon-100 hover:underline hover:underline-offset-4"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          <div className="mt-4 flex w-full gap-4 items-center">
            <hr className="bg-blackish-green/25 w-[calc(100%/3)] h-[0.5px]" />
            <span className="text-blackish-green/50 text-sm text-center">
              Or login with
            </span>
            <hr className="bg-blackish-green/25 w-[calc(100%/3)] h-[0.5px]" />
          </div>
          <div className="my-4">
            <Button type="button" icon={<GoogleIcon />} className="h-14 w-full bg-transparent border rounded border-mint-green-100 hover:bg-mint-green-50 flex items-center justify-center" />
          </div>
        </div>
      </div>
    </div>
  );
};
