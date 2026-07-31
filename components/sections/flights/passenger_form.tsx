"use client";

import { useMemo, useState } from "react";
import { Passenger } from "./passenger_wrapper";
import { Button } from "@/components/reusable/button";
import { passengerSchema } from "@/lib/zod_schema";
import { DatePicker, Select } from "antd";
import countryList from "react-select-country-list";
import dayjs from "dayjs";
import { autoCapitalizeWords } from "@/utils/inputClassName";
import { z } from "zod";

type PassengerFormProps = {
  passenger: Passenger;
  passengerNumber: number;
  isLastPassenger: boolean;
  isMainPassenger: boolean;
  isSaving: boolean;
  onChange: (passenger: Passenger) => void;
  onSubmit: () => void;
  onBack?: () => void;
};

type PassengerFormErrors = Partial<Record<keyof Omit<Passenger, "id">, string>>;

export const PassengerForm = ({
  passenger,
  passengerNumber,
  isLastPassenger,
  isSaving,
  onChange,
  onSubmit,
  onBack,
  isMainPassenger
}: PassengerFormProps) => {
  const CountryOptions = useMemo(() => countryList().getData(), []);

  const [errors, setErrors] = useState<PassengerFormErrors>({});

  const handleChange = (field: keyof Passenger, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    onChange({ ...passenger, [field]: value });
  };

  const validate = () => {
    const result = passengerSchema.safeParse({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      gender: passenger.gender,
      nationality: passenger.nationality,
      dateOfBirth: passenger.dateOfBirth,
    });

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        gender: fieldErrors.gender?.[0],
        nationality: fieldErrors.nationality?.[0],
        dateOfBirth: fieldErrors.dateOfBirth?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit();
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-lg"
    >
      <h3 className="font-semibold text-lg">
        {isMainPassenger ? "Main passenger" : `Passenger ${passengerNumber}`}
      </h3>

      {/* First name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">First name</label>
        <input
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.firstName ? "border-red-400" : "border-gray-300"}`}
          value={passenger.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          onBlur={(e) =>
            handleChange("firstName", autoCapitalizeWords(e.target.value))
          }
          autoCapitalize="words"
        />
        {errors.firstName && (
          <span className="text-xs text-red-500">{errors.firstName}</span>
        )}
      </div>

      {/* Last name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Last name</label>
        <input
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.lastName ? "border-red-400" : "border-gray-300"}`}
          value={passenger.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          onBlur={(e) =>
            handleChange("lastName", autoCapitalizeWords(e.target.value))
          }
          autoCapitalize="words"
        />
        {errors.lastName && (
          <span className="text-xs text-red-500">{errors.lastName}</span>
        )}
      </div>

      {/* Gender */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Gender</label>
        <Select
          options={[
            { value: "", label: "Select gender" },
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
          ]}
          className={`border rounded px-3! py-2! focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.gender ? "border-red-400" : "border-gray-300"}`}
          value={passenger.gender}
          onChange={(value) => handleChange("gender", value)}
        />
        {errors.gender && (
          <span className="text-xs text-red-500">{errors.gender}</span>
        )}
      </div>

      {/* Nationality */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nationality</label>
        <Select
          options={CountryOptions}
          placeholder="Select your nationality"
          value={passenger.nationality}
          allowClear
          showSearch={{
            optionFilterProp: "label",
          }}
          className={`border rounded px-3! py-2! focus:outline-none focus:ring-2 focus:ring-blackish-green/30
              ${errors.nationality ? "border-red-400" : "border-gray-300"}`}
          onChange={(value) => handleChange("nationality", value)}
        />
        {errors.nationality && (
          <span className="text-xs text-red-500">{errors.nationality}</span>
        )}
      </div>

      {/* Date of birth */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Date of birth</label>
        <DatePicker
          format="YYYY-MM-DD"
          className={`border rounded px-3! py-2! focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.dateOfBirth ? "border-red-400" : "border-gray-300"}`}
          value={passenger.dateOfBirth ? dayjs(passenger.dateOfBirth) : null}
          onChange={(value) =>
            handleChange("dateOfBirth", value ? value.format("YYYY-MM-DD") : "")
          }
          maxDate={dayjs()}
        />
        {errors.dateOfBirth && (
          <span className="text-xs text-red-500">{errors.dateOfBirth}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-2">
        {onBack && (
          <Button
            type="button"
            onClick={onBack}
            className="flex-1 border border-blackish-green text-blackish-green rounded py-2 text-sm font-semibold
                       hover:bg-blackish-green hover:text-white transition-colors"
            label="Back"
          />
        )}
        <Button
          type="submit"
          disabled={isSaving}
          className={`flex-1 bg-blackish-green text-white rounded py-2 text-sm font-semibold
                      transition-opacity ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
          label={
            isSaving
              ? "Saving..."
              : isLastPassenger
                ? "Continue to seats"
                : "Next passenger"
          }
        />
      </div>
    </form>
  );
};
