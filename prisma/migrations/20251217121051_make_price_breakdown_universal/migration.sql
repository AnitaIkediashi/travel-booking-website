/*
  Warnings:

  - You are about to drop the column `price_breakdown_id` on the `PriceBreakdown` table. All the data in the column will be lost.
  - You are about to drop the column `traveler_price_id` on the `PriceBreakdown` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PriceBreakdown" DROP CONSTRAINT "PriceBreakdown_price_breakdown_id_fkey";

-- DropForeignKey
ALTER TABLE "PriceBreakdown" DROP CONSTRAINT "PriceBreakdown_traveler_price_id_fkey";

-- DropIndex
DROP INDEX "PriceBreakdown_price_breakdown_id_key";

-- DropIndex
DROP INDEX "PriceBreakdown_traveler_price_id_key";

-- AlterTable
ALTER TABLE "FlightOffers" ADD COLUMN     "price_id" INTEGER;

-- AlterTable
ALTER TABLE "PriceBreakdown" DROP COLUMN "price_breakdown_id",
DROP COLUMN "traveler_price_id";

-- AlterTable
ALTER TABLE "TravelerPrice" ADD COLUMN     "price_id" INTEGER;

-- AddForeignKey
ALTER TABLE "FlightOffers" ADD CONSTRAINT "FlightOffers_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "PriceBreakdown"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerPrice" ADD CONSTRAINT "TravelerPrice_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "PriceBreakdown"("id") ON DELETE SET NULL ON UPDATE CASCADE;
