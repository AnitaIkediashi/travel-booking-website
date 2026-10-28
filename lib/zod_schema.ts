import { z } from "zod";
import parsePhoneNumberFromString, { isValidPhoneNumber } from "libphonenumber-js";
import countryList from "react-select-country-list";

const nameSchema = z
  .string({ error: "Required" })
  .trim()
  .min(1, "Required")
  .max(50, "Too long")
  .regex(
    /^[\p{L}\p{M}]+(?:[ '’-][\p{L}\p{M}]+)*$/u,
    "Use letters only (spaces, hyphens and apostrophes allowed between letters)",
  );

const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .pipe(z.email("Invalid email address"));

const phoneSchema = z
  .string({ error: "Phone number is required" })
  .trim()
  .min(1, "Phone number is required")
  .refine((val) => isValidPhoneNumber(val, "NG"), "Invalid phone number")
  .transform((val) => parsePhoneNumberFromString(val, "NG")?.number ?? val);

const validCountryCodes = new Set(
  countryList()
    .getData()
    .map((c) => c.value),
);

const todayISO = () => new Date().toISOString().split("T")[0];

const cardNameSchema = z
  .string({ error: "Name is required" })
  .trim()
  .min(1, "Name is required")
  .min(3, "Name is too short")
  .max(50, "Name is too long")
  .regex(
    /^[\p{L}\p{M}][\p{L}\p{M} '’.-]*$/u,
    "Use letters only (spaces, hyphens, apostrophes and periods allowed)",
  )
  .transform((s) => s.normalize("NFC").replace(/\s+/g, " "));

export const cardSchema = z.object({
  cardName: cardNameSchema,
  country: z
    .string({ error: "Select a country" })
    .trim()
    .toUpperCase()
    .min(1, "Select a country")
    .refine((code) => validCountryCodes.has(code), "Invalid country"),
  saveCard: z.boolean().optional(),
  cardType: z.string().trim().max(30, "Invalid card type").optional(),
});

export const signUpSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phoneNo: phoneSchema,
    // never trim passwords. 72 is bcrypt's byte limit; raise it if you use argon2
    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirmPassword: z.string({ error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const passengerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Gender is required",
  }),
  idType: z
    .enum(["PASSPORT", "NATIONAL_ID"], {
      message: "ID type is required",
    })
    .optional(),
  // allowClear on the Select sends undefined, so the error option covers that too
  nationality: z
    .string({ error: "Nationality is required" })
    .trim()
    .toUpperCase()
    .min(1, "Nationality is required")
    .refine((code) => validCountryCodes.has(code), "Invalid nationality"),
  idNumber: z
    .string()
    .trim()
    .min(1, "ID number is required")
    .max(30, "ID number is too long")
    .regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and hyphens only")
    .optional(),
  dateOfBirth: z
    .string({ error: "Date of birth is required" })
    .min(1, "Date of birth is required")
    .pipe(z.iso.date("Invalid date of birth"))
    .refine((val) => val <= todayISO(), "Date of birth cannot be in the future")
    .refine((val) => val >= "1900-01-01", "Invalid date of birth"),
});

export type PassengerSchema = z.infer<typeof passengerSchema>;

export const contactInfoSchema = z.object({
  email: emailSchema,
  phoneNo: phoneSchema,
});

export type ContactInfoSchema = z.infer<typeof contactInfoSchema>;
