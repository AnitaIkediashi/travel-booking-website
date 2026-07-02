-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('IN_PROGRESS', 'HELD', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "seats" ADD COLUMN     "booking_id" TEXT,
ADD COLUMN     "held_until" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "flight_offer_id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "total_travelers" INTEGER NOT NULL,
    "hold_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "id_type" TEXT NOT NULL,
    "id_number" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "seat_id" INTEGER,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passengers_seat_id_key" ON "passengers"("seat_id");

-- CreateIndex
CREATE INDEX "seats_booking_id_idx" ON "seats"("booking_id");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passengers" ADD CONSTRAINT "passengers_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
