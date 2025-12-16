-- DropForeignKey
ALTER TABLE "PriceBreakdown" DROP CONSTRAINT "PriceBreakdown_traveler_price_id_fkey";

-- AlterTable
ALTER TABLE "PriceBreakdown" ALTER COLUMN "traveler_price_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PriceBreakdown" ADD CONSTRAINT "PriceBreakdown_traveler_price_id_fkey" FOREIGN KEY ("traveler_price_id") REFERENCES "TravelerPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
