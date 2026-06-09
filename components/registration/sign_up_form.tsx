"use client";

import Image from "next/image";
import { Button } from "../reusable/button";
import { inputClassName } from "@/utils/inputClassName";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "../icons/google";
import { Checkbox } from "antd";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { SignUpFormPayload } from "@/types/authentication_type";
import { z } from "zod";
import { EyeIcon } from "../icons/eye";
import { EyeOffIcon } from "../icons/eye_off";
import { signUpUser } from "@/lib/actions/auth-actions";
import { ToastContainer, toast } from "react-toastify";
import { signIn } from "next-auth/react";

export const SignUpForm = () => {
  const router = useRouter();

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

  const [signUpData, setSignUpData] = useState<SignUpFormPayload>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ReturnType<
    typeof z.treeifyError<SignUpFormPayload>
  > | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignUpData((prev) => ({ ...prev, [name]: value }));

    const fieldName = name as keyof NonNullable<typeof errors>["properties"];

    if (errors?.properties && fieldName in errors.properties) {
      setErrors((prev) => {
        if (!prev || !prev.properties) return prev;

        // 2. Use the asserted fieldName here
        /**
         * The underscore is just a placeholder name. It allows you to "capture" the field
         * you want to remove so that the "rest" of the object stays clean and error-free for that specific field.
         */
        const { [fieldName]: _, ...remainingProperties } = prev.properties;

        return {
          ...prev,
          properties: remainingProperties,
        };
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/signup?step=add-payment", // where to go after Google auth
      });
    } catch (error) {
      console.error("Google sign in failed", error);
      toast.error("Google sign in failed. Please try again.");
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null);

    try {
      const formResponse = await signUpUser(signUpData);

      if (!formResponse.success) {
        if (formResponse.errors) {
          setErrors(
            formResponse.errors as ReturnType<
              typeof z.treeifyError<SignUpFormPayload>
            >,
          );
        } else {
          toast.error(
            formResponse.message || "Sign up failed. Please try again.",
          );
        }
        return;
      }

      if (!formResponse.success && formResponse.message) {
        toast.error(formResponse.message);
        return;
      }

      if (formResponse.success) {
        toast.success("Account created successfully!");
        router.push("/signup?step=add-payment");
      }
    } catch (error) {
      console.error("Sign up form submission failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:w-[60%] w-full h-full ">
      <div className="flex flex-col justify-between gap-6">
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
            <form action="" onSubmit={handleFormSubmit}>
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
                        value={signUpData.firstName}
                        onChange={handleFormInput}
                        className={inputClassName}
                      />
                    </fieldset>
                    {errors?.properties?.firstName?.errors?.[0] && (
                      <span className="text-red-500 text-xs absolute -bottom-4">
                        {errors.properties.firstName.errors[0]}
                      </span>
                    )}
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
                        value={signUpData.lastName}
                        onChange={handleFormInput}
                        className={inputClassName}
                      />
                    </fieldset>
                    {errors?.properties?.lastName?.errors?.[0] && (
                      <span className="text-red-500 text-xs absolute -bottom-4">
                        {errors.properties.lastName.errors[0]}
                      </span>
                    )}
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
                        value={signUpData.email}
                        onChange={handleFormInput}
                        className={inputClassName}
                      />
                    </fieldset>
                    {errors?.properties?.email?.errors?.[0] && (
                      <span className="text-red-500 text-xs absolute -bottom-4">
                        {errors.properties.email.errors[0]}
                      </span>
                    )}
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
                        value={signUpData.phoneNo}
                        onChange={handleFormInput}
                        className={inputClassName}
                      />
                    </fieldset>
                    {errors?.properties?.phoneNo?.errors?.[0] && (
                      <span className="text-red-500 text-xs absolute -bottom-4">
                        {errors.properties.phoneNo.errors[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      password
                    </legend>
                    <input
                      type={seePassword ? "text" : "password"}
                      placeholder="Type your password"
                      name="password"
                      value={signUpData.password}
                      onChange={handleFormInput}
                      className={inputClassName}
                    />
                    <div
                      className="absolute w-8 h-8 -top-1 right-0 z-10 flex items-center justify-center cursor-pointer"
                      onClick={() => setSeePassword((prev) => !prev)}
                    >
                      {seePassword ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                  </fieldset>
                  {errors?.properties?.password?.errors?.[0] && (
                    <span className="text-red-500 text-xs absolute -bottom-4">
                      {errors.properties.password.errors[0]}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      confirm password
                    </legend>
                    <input
                      type={seeConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      name="confirmPassword"
                      value={signUpData.confirmPassword}
                      onChange={handleFormInput}
                      className={inputClassName}
                    />
                    <div
                      className="absolute w-8 h-8 -top-1 right-0 z-10 flex items-center justify-center"
                      onClick={() => setSeeConfirmPassword((prev) => !prev)}
                    >
                      {seeConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                  </fieldset>
                  {errors?.properties?.confirmPassword?.errors?.[0] && (
                    <span className="text-red-500 text-xs absolute -bottom-4">
                      {errors.properties.confirmPassword.errors[0]}
                    </span>
                  )}
                </div>
                <Checkbox
                  name="agreeToTerms"
                  className="text-blackish-green-10"
                >
                  I agree to all the Terms and Privacy Policies
                </Checkbox>
              </div>
              <div className="flex flex-col gap-y-4 w-full">
                <Button
                  type="submit"
                  className="bg-mint-green-100 text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
                  label={
                    isLoading ? "Creating your account..." : "Create account"
                  }
                  disabled={isLoading ? true : false}
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
