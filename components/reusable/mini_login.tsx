"use client";

import { inputClassName } from "@/utils/inputClassName";
import { FormEvent, useState } from "react";
import { EyeOffIcon } from "../icons/eye_off";
import { EyeIcon } from "../icons/eye";
import { Button } from "./button";
import Link from "next/link";
import { GoogleIcon } from "../icons/google";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export const MiniLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
      });
      if (result?.error) {
        toast.error("Google sign in failed. Please try again.");
        return;
      }

      // Refresh the server components on the current page to reflect the new session
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error(`Google sign in failed. Please try again.`);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

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

      router.refresh();
    } catch (error) {
      console.error("Sign in failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col w-full gap-y-4">
        <h3 className="font-bold text-xl ">Login or Sign up to book</h3>
        <form
          action=""
          className="w-full flex flex-col gap-y-4"
          onSubmit={handleFormSubmit}
        >
          <div className="w-full relative">
            <div className="w-full h-14 rounded-tl-sm rounded-tr-sm border border-blackish-green-20 pl-3">
              <input
                type="Email"
                placeholder="Your Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClassName} h-full`}
              />
            </div>
          </div>
          <div className="w-full relative">
            <div className="w-full h-14 rounded-tl-sm rounded-tr-sm border border-blackish-green-20 pl-3 relative">
              <input
                type={seePassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClassName} h-full`}
              />
              <div
                className="absolute w-8 h-8 top-3 right-0 z-10 flex items-center justify-center cursor-pointer"
                onClick={() => setSeePassword((prev) => !prev)}
              >
                {seePassword ? <EyeIcon /> : <EyeOffIcon />}
              </div>
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
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </div>
  );
};
