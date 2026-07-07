import { z } from "zod";

// define the schema
export const cardSchema = z.object({
  cardName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name is too short"),
  country: z.string().min(1, "Select a country"),
  saveCard: z.boolean().optional(),
  cardType: z.string().optional(),
});

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNo: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const passengerSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  gender: z.enum(["MALE", "FEMALE"], {
    message: "Gender is required",
  }),
  idType: z.enum(["PASSPORT", "NATIONAL_ID"], {
    message: "ID type is required",
  }),
  nationality: z.string().min(1, "Nationality is required").trim(),
  idNumber: z.string().min(1, "ID number is required").trim(),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date of birth")
    .refine((val) => {
      const today = new Date().toISOString().split("T")[0];
      return val < today;
    }, "Date of birth cannot be in the future"),
});

export type PassengerSchema = z.infer<typeof passengerSchema>;
