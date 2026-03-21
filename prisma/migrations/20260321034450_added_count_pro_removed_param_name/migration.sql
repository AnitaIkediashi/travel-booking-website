/*
  Warnings:

  - You are about to drop the column `param_name` on the `Baggage` table. All the data in the column will be lost.
  - Added the required column `count` to the `Baggage` table without a default value. This is not possible if the table is not empty.
  - Made the column `weight` on table `Baggage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Baggage" DROP COLUMN "param_name",
ADD COLUMN     "count" INTEGER NOT NULL,
ALTER COLUMN "weight" SET NOT NULL;
