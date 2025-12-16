-- DropForeignKey
ALTER TABLE "MinPrice" DROP CONSTRAINT "MinPrice_min_price_airline_id_fkey";

-- DropForeignKey
ALTER TABLE "MinPrice" DROP CONSTRAINT "MinPrice_min_price_stop_id_fkey";

-- AlterTable
ALTER TABLE "MinPrice" ALTER COLUMN "min_price_airline_id" DROP NOT NULL,
ALTER COLUMN "min_price_stop_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_airline_id_fkey" FOREIGN KEY ("min_price_airline_id") REFERENCES "Airlines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_stop_id_fkey" FOREIGN KEY ("min_price_stop_id") REFERENCES "Stop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
