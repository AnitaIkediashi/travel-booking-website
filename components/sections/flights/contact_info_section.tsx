"use client";

import { ContactInfoInput } from "@/lib/actions/flight-booking-actions";
import { Dispatch, SetStateAction } from "react";

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
  const handleChange = (field: keyof ContactInfoInput, value: string) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mb-6 pb-6 border-b border-blackish-green/20">
      <h3 className="font-semibold text-lg">Contact information</h3>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email</label>
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
      </div>

      {/* Phone number */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Phone number</label>
        <input
          type="tel"
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.phoneNo ? "border-red-400" : "border-gray-300"}`}
          value={contactInfo.phoneNo}
          onChange={(e) => handleChange("phoneNo", e.target.value)}
        />
        {errors.phoneNo && (
          <span className="text-xs text-red-500">{errors.phoneNo}</span>
        )}
      </div>
    </div>
  );
};
