"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma";
import { z } from "zod";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ─── Sign Up ─────────────────────────────────────────────────────────────────

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

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(email: string) {
  // Always return the same generic response
  // so you never reveal whether an email exists in your DB
  const genericResponse = {
    success: true,
    message: "If that email exists, a reset link has been sent.",
  };

  const user = await prisma.user.findUnique({ where: { email } });

  // No user, or OAuth-only user (password is empty string)
  if (!user || !user.password) return genericResponse;

  // Invalidate any existing unused tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, used: false },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

  await prisma.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId: user.id,
      expires,
    },
  });

  // TODO: replace this with your email provider (Resend, Nodemailer, etc.)
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;
  console.log("Password reset URL:", resetUrl);

  return genericResponse;
}

// ─── Verify Reset Token ───────────────────────────────────────────────────────
// Called when the user lands on /reset-password?token=...
// to check the token is valid before showing the new password form

export async function verifyResetToken(rawToken: string) {
  const hashedToken = hashToken(rawToken);

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record) {
    return { valid: false, message: "Invalid or expired reset link." };
  }

  if (record.used) {
    return { valid: false, message: "This reset link has already been used." };
  }

  if (record.expires < new Date()) {
    return { valid: false, message: "This reset link has expired." };
  }

  return { valid: true };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

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

  // Re-verify on the server — never trust that the UI already checked
  if (!record || record.used || record.expires < new Date()) {
    return { success: false, message: "Invalid or expired reset link." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Transaction: both writes succeed or neither does
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
