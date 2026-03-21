/*
  Warnings:

  - Added the required column `param_name` to the `Baggage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Baggage" ADD COLUMN     "param_name" TEXT NOT NULL;
