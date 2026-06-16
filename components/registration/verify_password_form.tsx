"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../reusable/button";
import { LeftArrowIcon } from "../icons/left_arrow";
import { inputClassName } from "@/utils/inputClassName";
import { FormEvent, useState } from "react";
import { forgotPassword, verifyOtp } from "@/lib/actions/auth-actions";
import { toast, ToastContainer } from "react-toastify";

export const VerifyPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = decodeURIComponent(searchParams.get("email") || "");

  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState(""); // ← just a string now
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please restart the process.");
      router.push("/forgot-password");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyOtp(email, otp);

      if (!result.valid) {
        toast.error(result.message);
        setOtp(""); // clear on failure
        return;
      }

      router.push(
        `/forgot-password?step=reset-password&token=${result.resetToken}`,
      );
    } catch (error) {
      console.error("OTP verification failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setIsResending(true);

    try {
      await forgotPassword(email);
      toast.success("A new code has been sent to your email.");
      setOtp("");
      // Start 60 second countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to resend code. Please try again. ");
      console.log(error)
    } finally {
      setIsResending(false);
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
          <Button
            className="flex items-center gap-3 hover:font-semibold hover:underline hover:underline-offset-4 mb-4"
            icon={<LeftArrowIcon />}
            label="Back to login"
            labelClassName="text-sm font-medium"
            href="/signin"
          />
          <div className="flex flex-col gap-y-4">
            <h2 className="capitalize font-bold text-[40px]">Verify code</h2>
            <p className="text-blackish-green/75">
              An authentication code has been sent to{" "}
              <span className="font-semibold">{email}</span>
            </p>
          </div>
          <div>
            <form action="" onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-y-4 mb-8">
                <div className="relative">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      enter code
                    </legend>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      name="resetCode"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6} // ← prevents typing more than 6 chars
                      className={inputClassName}
                    />
                  </fieldset>
                </div>
                <p className="text-sm font-medium">
                  Didn&apos;t receive a code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending || countdown > 0}
                    className="text-salmon-100 font-semibold hover:underline hover:underline-offset-4 disabled:opacity-50"
                  >
                    {countdown > 0
                      ? `Resend in ${countdown}s`
                      : isResending
                        ? "Sending..."
                        : "Resend"}
                  </button>
                </p>
              </div>
              <Button
                type="submit"
                className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
                label={isLoading ? "Verifying..." : "Verify"}
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </div>
  );
};
