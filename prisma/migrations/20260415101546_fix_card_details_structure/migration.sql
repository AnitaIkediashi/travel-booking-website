/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `CardDetails` table. All the data in the column will be lost.
  - You are about to drop the column `cvc` on the `CardDetails` table. All the data in the column will be lost.
  - You are about to drop the column `expDate` on the `CardDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripePaymentMethodId]` on the table `CardDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expMonth` to the `CardDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expYear` to the `CardDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last4` to the `CardDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentMethodId` to the `CardDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
DELETE FROM "CardDetails";

-- Existing Prisma generated code will follow...
ALTER TABLE "CardDetails" ADD COLUMN "expMonth" INTEGER NOT NULL;
ALTER TABLE "CardDetails" ADD COLUMN "expYear" INTEGER NOT NULL;
ALTER TABLE "CardDetails" ADD COLUMN "last4" TEXT NOT NULL;
ALTER TABLE "CardDetails" ADD COLUMN "stripePaymentMethodId" TEXT NOT NULL;

-- And it will likely drop your old columns
ALTER TABLE "CardDetails" DROP COLUMN "cardNumber", DROP COLUMN "cvc", DROP COLUMN "expDate";
