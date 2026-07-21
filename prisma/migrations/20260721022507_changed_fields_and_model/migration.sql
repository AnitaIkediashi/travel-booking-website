/*
  Warnings:

  - You are about to drop the column `duration_max` on the `data` table. All the data in the column will be lost.
  - You are about to drop the column `duration_min` on the `data` table. All the data in the column will be lost.
  - You are about to drop the column `cabin_class` on the `legs` table. All the data in the column will be lost.
  - You are about to drop the column `total_time` on the `legs` table. All the data in the column will be lost.
  - You are about to drop the column `min_price_data_id` on the `min_price` table. All the data in the column will be lost.
  - You are about to drop the column `min_price_stop_id` on the `min_price` table. All the data in the column will be lost.
  - The primary key for the `segments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `total_time` on the `segments` table. All the data in the column will be lost.
  - You are about to drop the `arrivals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `baggages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `base_fare` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carrier_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `carriers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `depart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departure_interval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `duration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `flight_times` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `price_breakdown` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `short_Layover_connection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tax` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `total_price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `travel_price` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[iata_code]` on the table `airlines` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total_duration` to the `flight_offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `legs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cabin_class` to the `segments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `segments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marketingCarrierId` to the `segments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('ONE_WAY', 'ROUND_TRIP');

-- DropForeignKey
ALTER TABLE "airlines" DROP CONSTRAINT "airlines_airline_id_fkey";

-- DropForeignKey
ALTER TABLE "arrivals" DROP CONSTRAINT "arrivals_arrival_id_fkey";

-- DropForeignKey
ALTER TABLE "baggages" DROP CONSTRAINT "baggages_baggage_id_fkey";

-- DropForeignKey
ALTER TABLE "base_fare" DROP CONSTRAINT "base_fare_base_price_id_fkey";

-- DropForeignKey
ALTER TABLE "carrier_info" DROP CONSTRAINT "carrier_info_carrier_info_id_fkey";

-- DropForeignKey
ALTER TABLE "carriers" DROP CONSTRAINT "carriers_carrier_id_fkey";

-- DropForeignKey
ALTER TABLE "depart" DROP CONSTRAINT "depart_depart_id_fkey";

-- DropForeignKey
ALTER TABLE "departure_interval" DROP CONSTRAINT "departure_interval_interval_id_fkey";

-- DropForeignKey
ALTER TABLE "discount" DROP CONSTRAINT "discount_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "duration" DROP CONSTRAINT "duration_duration_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_info" DROP CONSTRAINT "flight_info_flight_info_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_offers" DROP CONSTRAINT "flight_offers_price_id_fkey";

-- DropForeignKey
ALTER TABLE "flight_times" DROP CONSTRAINT "flight_times_flight_times_id_fkey";

-- DropForeignKey
ALTER TABLE "legs" DROP CONSTRAINT "legs_leg_id_fkey";

-- DropForeignKey
ALTER TABLE "min_price" DROP CONSTRAINT "min_price_min_price_data_id_fkey";

-- DropForeignKey
ALTER TABLE "min_price" DROP CONSTRAINT "min_price_min_price_stop_id_fkey";

-- DropForeignKey
ALTER TABLE "seat_availability" DROP CONSTRAINT "seat_availability_seat_availability_id_fkey";

-- DropForeignKey
ALTER TABLE "short_Layover_connection" DROP CONSTRAINT "short_Layover_connection_layover_id_fkey";

-- DropForeignKey
ALTER TABLE "stops" DROP CONSTRAINT "stops_stop_id_fkey";

-- DropForeignKey
ALTER TABLE "tax" DROP CONSTRAINT "tax_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "total_price" DROP CONSTRAINT "total_price_total_price_id_fkey";

-- DropForeignKey
ALTER TABLE "travel_price" DROP CONSTRAINT "travel_price_price_id_fkey";

-- DropForeignKey
ALTER TABLE "travel_price" DROP CONSTRAINT "travel_price_traveler_price_id_fkey";

-- DropIndex
DROP INDEX "legs_arrival_gate_id_key";

-- DropIndex
DROP INDEX "legs_departure_gate_id_key";

-- DropIndex
DROP INDEX "min_price_min_price_data_id_key";

-- DropIndex
DROP INDEX "min_price_min_price_stop_id_key";

-- AlterTable
ALTER TABLE "data" DROP COLUMN "duration_max",
DROP COLUMN "duration_min";

-- AlterTable
ALTER TABLE "flight_info" ALTER COLUMN "flight_info_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "flight_offers" ADD COLUMN     "total_duration" INTEGER NOT NULL,
ADD COLUMN     "trip_type" "TripType" NOT NULL DEFAULT 'ONE_WAY';

-- AlterTable
ALTER TABLE "legs" DROP COLUMN "cabin_class",
DROP COLUMN "total_time",
ADD COLUMN     "duration" INTEGER NOT NULL,
ALTER COLUMN "leg_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "min_price" DROP COLUMN "min_price_data_id",
DROP COLUMN "min_price_stop_id";

-- AlterTable
ALTER TABLE "segments" DROP CONSTRAINT "segments_pkey",
DROP COLUMN "total_time",
ADD COLUMN     "cabin_class" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "marketingCarrierId" INTEGER NOT NULL,
ADD COLUMN     "operatingCarrierId" INTEGER,
ADD COLUMN     "slice_index" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "segments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "segments_id_seq";

-- DropTable
DROP TABLE "arrivals";

-- DropTable
DROP TABLE "baggages";

-- DropTable
DROP TABLE "base_fare";

-- DropTable
DROP TABLE "carrier_info";

-- DropTable
DROP TABLE "carriers";

-- DropTable
DROP TABLE "depart";

-- DropTable
DROP TABLE "departure_interval";

-- DropTable
DROP TABLE "discount";

-- DropTable
DROP TABLE "duration";

-- DropTable
DROP TABLE "flight_times";

-- DropTable
DROP TABLE "price_breakdown";

-- DropTable
DROP TABLE "short_Layover_connection";

-- DropTable
DROP TABLE "stops";

-- DropTable
DROP TABLE "tax";

-- DropTable
DROP TABLE "total_price";

-- DropTable
DROP TABLE "travel_price";

-- CreateTable
CREATE TABLE "carrier" (
    "id" SERIAL NOT NULL,
    "carrier_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "carrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_breakdowns" (
    "id" SERIAL NOT NULL,
    "flight_offer_id" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL DEFAULT 'USD',
    "total_amount" DECIMAL(10,2) NOT NULL,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT "price_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passenger_fares" (
    "id" SERIAL NOT NULL,
    "flight_offer_id" TEXT NOT NULL,
    "passenger_type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "base_fare" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "total_per_pax" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "passenger_fares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "price_breakdowns_flight_offer_id_key" ON "price_breakdowns"("flight_offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_iata_code_key" ON "airlines"("iata_code");

-- CreateIndex
CREATE INDEX "segments_departure_airport_code_arrival_airport_code_idx" ON "segments"("departure_airport_code", "arrival_airport_code");

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_marketingCarrierId_fkey" FOREIGN KEY ("marketingCarrierId") REFERENCES "carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_operatingCarrierId_fkey" FOREIGN KEY ("operatingCarrierId") REFERENCES "carrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legs" ADD CONSTRAINT "legs_leg_id_fkey" FOREIGN KEY ("leg_id") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrier" ADD CONSTRAINT "carrier_code_fkey" FOREIGN KEY ("code") REFERENCES "airlines"("iata_code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_info" ADD CONSTRAINT "flight_info_flight_info_id_fkey" FOREIGN KEY ("flight_info_id") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_breakdowns" ADD CONSTRAINT "price_breakdowns_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passenger_fares" ADD CONSTRAINT "passenger_fares_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat_availability" ADD CONSTRAINT "seat_availability_seat_availability_id_fkey" FOREIGN KEY ("seat_availability_id") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
