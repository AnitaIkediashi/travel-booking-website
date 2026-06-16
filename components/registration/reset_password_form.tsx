'use client'

import { inputClassName } from "@/utils/inputClassName";
import Image from "next/image";
import { Button } from "../reusable/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import z from "zod";
import { resetPassword } from "@/lib/actions/auth-actions";
import { toast, ToastContainer } from "react-toastify";
import { EyeIcon } from "../icons/eye";
import { EyeOffIcon } from "../icons/eye_off";

type ResetFormPayload = {
  password: string;
  confirmPassword: string;
};

export const ResetPasswordForm = () => {

  const router = useRouter()
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState<ResetFormPayload>({
    password: "",
    confirmPassword: "",
  });

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type ResetFormErrors = ReturnType<
    typeof z.treeifyError<ResetFormPayload>
  > | null;

  const [errors, setErrors] = useState<ResetFormErrors>(null);;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldName = name as keyof NonNullable<typeof errors>["properties"];
    if (errors?.properties && fieldName in errors.properties) {
      setErrors((prev) => {
        if (!prev || !prev.properties) return prev;
        const { [fieldName]: _, ...remainingProperties } = prev.properties;
        return { ...prev, properties: remainingProperties };
      });
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token missing. Please restart the process.");
      router.push("/forgot-password");
      return;
    }

    setIsLoading(true);
    setErrors(null);

    try {
      const result = await resetPassword({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (!result.success && result.errors) {
        setErrors(
          result.errors as ReturnType<typeof z.treeifyError<ResetFormPayload>>,
        );
        return;
      }

      if (!result.success && result.message) {
        toast.error(result.message);
        return;
      }

      if (result.success) {
        toast.success("Password reset successfully!");
        router.push("/signin");
      }
    } catch (error) {
      console.error("Reset password failed", error);
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
            <h2 className="capitalize font-bold text-[40px]">Set a password</h2>
            <p className="text-blackish-green/75">
              Your previous password has been reseted. Please set a new password
              for your account.
            </p>
          </div>
          <div>
            <form action="" onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-y-6 mb-8">
                <div className="relative">
                  <fieldset className="h-14 border border-blackish-green-20 rounded-tl-sm rounded-tr-sm pl-3 relative">
                    <legend className="text-blackish-green text-sm capitalize">
                      create password
                    </legend>
                    <input
                      type={seePassword ? "text" : "password"}
                      placeholder="Create Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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
                      re-enter password
                    </legend>
                    <input
                      type={seeConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                    <div
                      className="absolute w-8 h-8 -top-1 right-0 z-10 flex items-center justify-center cursor-pointer"
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
              </div>
              <Button
                type="submit"
                className="bg-mint-green-100 capitalize text-sm font-semibold w-full h-12 rounded hover:bg-blackish-green hover:text-white mb-4"
                label={isLoading ? "setting password..." : "set password"}
                disabled={isLoading}
              />
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="dark" closeOnClick={true} />
    </div>
  );
}
