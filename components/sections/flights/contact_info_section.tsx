"use client";

import { ContactInfoInput } from "@/lib/actions/flight-booking-actions";
import { useCurrentUser } from "@/lib/auth-context";
import { Dispatch, SetStateAction, useEffect } from "react";
import PhoneInput from "react-phone-number-input";

type ContactInfoSectionType = {
  contactInfo: ContactInfoInput;
  errors: Partial<Record<keyof ContactInfoInput, string>>;
  onChange: Dispatch<SetStateAction<ContactInfoInput>>;
};

export const ContactInfoSection = ({
  contactInfo,
  errors,
  onChange,
}: ContactInfoSectionType) => {
  const { isAuthenticated, user } = useCurrentUser();

  useEffect(() => {
    if (!isAuthenticated) return;
    onChange((prev) => ({
      email: user?.email ?? prev.email,
      phoneNo: user?.phoneNo ?? prev.phoneNo,
    }));
  }, [isAuthenticated, user?.email, user?.phoneNo, onChange]);

  const handleChange = (field: keyof ContactInfoInput, value: string) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  const emailLocked = isAuthenticated && !!user?.email;
  const phoneLocked = isAuthenticated && !!user?.phoneNo;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mb-6 pb-6 border-b border-blackish-green/20">
      <h3 className="font-semibold text-lg">Contact information</h3>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email</label>
        {emailLocked ? (
          <input
            type="email"
            disabled
            className="border rounded px-3 py-2 bg-gray-100 text-gray-600 border-gray-300 cursor-not-allowed"
            value={contactInfo.email}
          />
        ) : (
          <>
            <input
              type="email"
              className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
              ${errors.email ? "border-red-400" : "border-gray-300"}`}
              value={contactInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </>
        )}
      </div>

      {/* Phone number */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Phone number</label>
        {phoneLocked ? (
          <input
            disabled
            className="border rounded px-3 py-2 bg-gray-100 text-gray-600 border-gray-300 cursor-not-allowed"
            value={contactInfo.phoneNo}
          />
        ) : (
          <>
            <PhoneInput
              defaultCountry="NG"
              className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
                    ${errors.phoneNo ? "border-red-400" : "border-gray-300"}`}
              value={contactInfo.phoneNo}
              onChange={(value) => handleChange("phoneNo", value ?? "")}
            />
            {errors.phoneNo && (
              <span className="text-xs text-red-500">{errors.phoneNo}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
