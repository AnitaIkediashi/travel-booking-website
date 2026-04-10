/*
  Warnings:

  - Added the required column `cardType` to the `CardDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardDetails" ADD COLUMN     "cardType" TEXT NOT NULL;
