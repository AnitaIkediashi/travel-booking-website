'use client'

import { useState } from "react";
import { IdType, Passenger } from "./passenger_wrapper";
import { Button } from "@/components/reusable/button";
import { passengerSchema } from "@/lib/zod_schema";

type PassengerFormProps = {
  passenger: Passenger;
  passengerNumber: number;
  isLastPassenger: boolean;
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
}: PassengerFormProps) => {
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
        idType: passenger.idType,
        nationality: passenger.nationality,
        idNumber: passenger.idNumber,
        dateOfBirth: passenger.dateOfBirth,
      });

      if (!result.success) {
        const { fieldErrors } = result.error.flatten();
        setErrors({
          firstName: fieldErrors.firstName?.[0],
          lastName: fieldErrors.lastName?.[0],
          gender: fieldErrors.gender?.[0],
          idType: fieldErrors.idType?.[0],
          nationality: fieldErrors.nationality?.[0],
          idNumber: fieldErrors.idNumber?.[0],
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
      <h3 className="font-semibold text-lg">Passenger {passengerNumber}</h3>

      {/* First name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">First name</label>
        <input
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.firstName ? "border-red-400" : "border-gray-300"}`}
          value={passenger.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
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
        />
        {errors.lastName && (
          <span className="text-xs text-red-500">{errors.lastName}</span>
        )}
      </div>

      {/* Gender */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Gender</label>
        <select
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.gender ? "border-red-400" : "border-gray-300"}`}
          value={passenger.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <option value="">Select gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
        {errors.gender && (
          <span className="text-xs text-red-500">{errors.gender}</span>
        )}
      </div>

      {/* ID type */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">ID type</label>
        <select
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.idType ? "border-red-400" : "border-gray-300"}`}
          value={passenger.idType}
          onChange={(e) => {
            onChange({
              ...passenger,
              idType: e.target.value as IdType,
              nationality: "",
              idNumber: "",
            });
            setErrors((prev) => ({
              ...prev,
              idType: undefined,
              nationality: undefined,
              idNumber: undefined,
            }));
          }}
        >
          <option value="">Select ID type</option>
          <option value="PASSPORT">Passport</option>
          <option value="NATIONAL_ID">National ID</option>
        </select>
        {errors.idType && (
          <span className="text-xs text-red-500">{errors.idType}</span>
        )}
      </div>

      {/* Nationality */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nationality</label>
        {passenger.idType === "NATIONAL_ID" ? (
          <input
            className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            value="Nigerian"
            disabled
          />
        ) : (
          <input
            className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
              ${errors.nationality ? "border-red-400" : "border-gray-300"}
              ${!passenger.idType ? "bg-gray-50 cursor-not-allowed" : ""}`}
            placeholder={
              passenger.idType ? "Enter nationality" : "Select an ID type first"
            }
            value={passenger.nationality}
            onChange={(e) => handleChange("nationality", e.target.value)}
            disabled={!passenger.idType}
          />
        )}
        {errors.nationality && (
          <span className="text-xs text-red-500">{errors.nationality}</span>
        )}
      </div>

      {/* ID number */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          {passenger.idType === "PASSPORT"
            ? "Passport number"
            : passenger.idType === "NATIONAL_ID"
              ? "National ID number"
              : "ID number"}
        </label>
        <input
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.idNumber ? "border-red-400" : "border-gray-300"}
            ${!passenger.idType ? "bg-gray-50 cursor-not-allowed" : ""}`}
          placeholder={!passenger.idType ? "Select an ID type first" : ""}
          value={passenger.idNumber}
          onChange={(e) => handleChange("idNumber", e.target.value)}
          disabled={!passenger.idType}
        />
        {errors.idNumber && (
          <span className="text-xs text-red-500">{errors.idNumber}</span>
        )}
      </div>

      {/* Date of birth */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Date of birth</label>
        <input
          type="date"
          className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blackish-green/30
            ${errors.dateOfBirth ? "border-red-400" : "border-gray-300"}`}
          value={passenger.dateOfBirth}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
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
