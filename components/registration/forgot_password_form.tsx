"use client";

import { Button } from "../reusable/button";
import Image from "next/image";
import { LeftArrowIcon } from "../icons/left_arrow";
import { inputClassName } from "@/utils/inputClassName";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { forgotPassword } from "@/lib/actions/auth-actions";
import { GoogleIcon } from "../icons/google";
import { signIn } from "next-auth/react";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleGoBackToLogin = () => {
    router.back();
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl,
      });
    } catch (error) {
      toast.error(`Google sign in failed. Please try again. || ${error}`);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSubmitted(true);
        // Wait 2 seconds then redirect to verify step
        setTimeout(() => {
          router.push(
            `/forgot-password?step=verify-password&email=${encodeURIComponent(email)}`,
          );
        }, 2000);
      }
    } catch (error) {
      console.error("Forgot password failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
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
            <Button
              className="flex items-center gap-3 hover:font-semibold hover:underline hover:underline-offset-4 mb-4"
              icon={<LeftArrowIcon />}
              label="Back to login"
              labelClassName="text-sm font-medium"
              onClick={handleGoBackToLogin}
            />
            <div className="flex flex-col gap-y-4">
              <h2 className="capitalize font-bold text-[40px]">
                Check your email
              </h2>
              <p className="text-blackish-green/75">
                If an account exists for{" "}
                <span className="font-semibold">{email}</span>, you will receive
                an otp shortly.
              </p>
            </div>
            {/* <Button
            type="button"
            className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white"
            label="Back to login"
            onClick={() => router.push("/signin")}
          /> */}
          </div>
        </div>
        <ToastContainer
          position="top-center"
          theme="dark"
          closeOnClick={true}
        />
      </div>
    );
  }
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
              Don’t worry, happens to all of us. Enter your email below to
              recover your password
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
              </div>
              <Button
                type="submit"
                className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
                label={isLoading ? "sending..." : "submit"}
                disabled={isLoading}
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
