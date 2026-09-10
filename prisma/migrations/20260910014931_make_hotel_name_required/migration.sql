/*
  Warnings:

  - Made the column `name` on table `hotels` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "hotels" ALTER COLUMN "name" SET NOT NULL;
