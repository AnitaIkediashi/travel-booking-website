/*
  Warnings:

  - You are about to drop the `min_price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "min_price" DROP CONSTRAINT "min_price_min_price_airline_id_fkey";

-- DropTable
DROP TABLE "min_price";
