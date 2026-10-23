-- AlterTable
ALTER TABLE "hotel_booking" ADD COLUMN     "adults" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "children" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currency_code" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "currency_symbol" TEXT NOT NULL DEFAULT '$',
ADD COLUMN     "room_base_total" DECIMAL(10,2),
ADD COLUMN     "room_tax_total" DECIMAL(10,2);
