/*
  Warnings:

  - Added the required column `passenger_index` to the `passengers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passengers" ADD COLUMN     "passenger_index" INTEGER NOT NULL;
