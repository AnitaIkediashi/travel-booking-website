-- DropForeignKey
ALTER TABLE "PriceBreakdown" DROP CONSTRAINT "PriceBreakdown_price_breakdown_id_fkey";

-- AlterTable
ALTER TABLE "PriceBreakdown" ALTER COLUMN "price_breakdown_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PriceBreakdown" ADD CONSTRAINT "PriceBreakdown_price_breakdown_id_fkey" FOREIGN KEY ("price_breakdown_id") REFERENCES "FlightOffers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
