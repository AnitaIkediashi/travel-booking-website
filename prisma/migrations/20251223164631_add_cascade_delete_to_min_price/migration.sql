-- DropForeignKey
ALTER TABLE "MinPrice" DROP CONSTRAINT "MinPrice_min_price_airline_id_fkey";

-- DropForeignKey
ALTER TABLE "MinPrice" DROP CONSTRAINT "MinPrice_min_price_data_id_fkey";

-- DropForeignKey
ALTER TABLE "MinPrice" DROP CONSTRAINT "MinPrice_min_price_stop_id_fkey";

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_data_id_fkey" FOREIGN KEY ("min_price_data_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_airline_id_fkey" FOREIGN KEY ("min_price_airline_id") REFERENCES "Airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_stop_id_fkey" FOREIGN KEY ("min_price_stop_id") REFERENCES "Stop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
