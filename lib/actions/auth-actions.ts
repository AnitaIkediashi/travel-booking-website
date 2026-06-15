"use server";

import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { z } from "zod";
import { Resend } from "resend";
import { ResetPasswordEmail } from "@/components/registration/reset_password_email";

const resend = new Resend(process.env.RESEND_API_KEY!);

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// generate random otp
function generateOtp(length = 6) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }

  return otp;
}




const signUpSchema = z
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

export async function signUpUser(rawData: unknown) {
  const validated = signUpSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: z.treeifyError(validated.error),
    };
  }

  const { firstName, lastName, email, phoneNo, password } = validated.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      phoneNo,
      password: hashedPassword,
    },
  });

  return { success: true };
}

// forgot password
export async function forgotPassword(email: string) {
  const genericResponse = {
    success: true,
    message: "If that email exists, a reset code has been sent.",
  };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) return genericResponse;

  // Invalidate any existing unused OTPs for this email
  await prisma.otpToken.deleteMany({
    where: { email, used: false },
  });

  const rawOtp = generateOtp(); // e.g "482910"
  const hashedOtp = hashToken(rawOtp);
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  await prisma.otpToken.create({
    data: {
      email,
      otp: hashedOtp,
      expires,
    },
  });

  // Send OTP via email
  const emailResult = await resend.emails.send({
    // from: "noreply@golobe.com",
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your password reset code",
    react: ResetPasswordEmail({ rawOtp }),
  });

  console.log('email sent: ', emailResult)

  return genericResponse;
}

// ─── Verify OTP 
export async function verifyOtp(email: string, rawOtp: string) {
  const hashedOtp = hashToken(rawOtp);

  const record = await prisma.otpToken.findFirst({
    where: { email, otp: hashedOtp },
  });

  if (!record) {
    return { valid: false, message: "Invalid code. Please try again." };
  }

  if (record.used) {
    return { valid: false, message: "This code has already been used." };
  }

  if (record.expires < new Date()) {
    return {
      valid: false,
      message: "This code has expired. Request a new one.",
    };
  }

  // Mark as used so it can't be reused
  await prisma.otpToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  // Generate a short-lived reset token to carry into the reset page
  // This proves they verified the OTP without exposing the OTP itself
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = hashToken(resetToken);
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  await prisma.passwordResetToken.create({
    data: {
      token: hashedResetToken,
      userId: (await prisma.user.findUnique({ where: { email } }))!.id,
      expires,
    },
  });

  return { valid: true, resetToken }; // send rawToken to client
}

// ─── Reset Password 
const resetSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPassword(rawData: unknown) {
  const validated = resetSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, errors: z.treeifyError(validated.error) };
  }

  const { token: rawToken, password } = validated.data;
  const hashedToken = hashToken(rawToken);

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record || record.used || record.expires < new Date()) {
    return { success: false, message: "Invalid or expired reset link." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ]);

  return { success: true, message: "Password reset successfully." };
}
