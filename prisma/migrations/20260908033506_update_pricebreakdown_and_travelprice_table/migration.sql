-- CreateEnum
CREATE TYPE "HotelBookingStatus" AS ENUM ('IN_PROGRESS', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "hotel_booking" DROP COLUMN "status",
ADD COLUMN     "status" "HotelBookingStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "passenger_fares" ADD COLUMN "currency_id" TEXT;
ALTER TABLE "price_breakdowns" DROP COLUMN "currency_code",
ADD COLUMN "currency_id" TEXT;

-- Ensure a fallback currency exists to backfill against — no-op if one
-- with this code is already present.
INSERT INTO "currency" ("id", "name", "code", "symbol")
SELECT gen_random_uuid()::text, 'US Dollar', 'USD', '$'
WHERE NOT EXISTS (SELECT 1 FROM "currency" WHERE "code" = 'USD');

-- Backfill existing rows with the default currency
UPDATE "passenger_fares"
SET "currency_id" = (SELECT "id" FROM "currency" WHERE "code" = 'USD' LIMIT 1);

UPDATE "price_breakdowns"
SET "currency_id" = (SELECT "id" FROM "currency" WHERE "code" = 'USD' LIMIT 1);

-- Now safe to enforce NOT NULL
ALTER TABLE "passenger_fares" ALTER COLUMN "currency_id" SET NOT NULL;
ALTER TABLE "price_breakdowns" ALTER COLUMN "currency_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "price_breakdowns" ADD CONSTRAINT "price_breakdowns_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passenger_fares" ADD CONSTRAINT "passenger_fares_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;