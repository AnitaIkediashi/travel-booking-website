'use client'

import { inputClassName } from "@/utils/inputClassName";
import { Checkbox } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../reusable/button";
import { GoogleIcon } from "../icons/google";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { signIn } from "next-auth/react";
import { EyeIcon } from "../icons/eye";
import { EyeOffIcon } from "../icons/eye_off";

export const SignInForm = () => {

  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl,
      });
    } catch (error) {
      toast.error(`Google sign in failed. Please try again. || ${error}` );
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.success("Welcome back!");
      router.push(callbackUrl); 
      router.refresh();
    } catch (error) {
      console.error("Sign in failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:w-[45%] w-full h-full">
      <div className="w-full h-full flex flex-col justify-between gap-6">
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
            <form action="" onSubmit={handleFormSubmit}>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      type={seePassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClassName}
                    />
                    <div
                      className="absolute w-8 h-8 -top-1 right-0 z-10 flex items-center justify-center cursor-pointer"
                      onClick={() => setSeePassword((prev) => !prev)}
                    >
                      {seePassword ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                  </fieldset>
                </div>
                <div className="flex items-center justify-between">
                  <Checkbox
                    name="rememberMe"
                    className="text-blackish-green-10"
                  >
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
                  label={isLoading ? "Logging in..." : "login"}
                  disabled={isLoading}
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
              <Button
                type="button"
                icon={<GoogleIcon />}
                className="h-14 w-full bg-transparent border rounded border-mint-green-100 hover:bg-mint-green-50 flex items-center justify-center"
                onClick={handleGoogleSignIn}
              />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </div>
  );
};
