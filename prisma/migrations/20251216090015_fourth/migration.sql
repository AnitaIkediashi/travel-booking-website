/*
  Warnings:

  - You are about to drop the `ArrivalAirport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DepartureAirport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Segments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `arrival_airport_code` to the `Legs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure_airport_code` to the `Legs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArrivalAirport" DROP CONSTRAINT "ArrivalAirport_airport_code_fkey";

-- DropForeignKey
ALTER TABLE "ArrivalAirport" DROP CONSTRAINT "ArrivalAirport_arrival_id_fkey";

-- DropForeignKey
ALTER TABLE "ArrivalAirport" DROP CONSTRAINT "ArrivalAirport_arrival_leg_id_fkey";

-- DropForeignKey
ALTER TABLE "DepartureAirport" DROP CONSTRAINT "DepartureAirport_airport_code_fkey";

-- DropForeignKey
ALTER TABLE "DepartureAirport" DROP CONSTRAINT "DepartureAirport_depart_id_fkey";

-- DropForeignKey
ALTER TABLE "DepartureAirport" DROP CONSTRAINT "DepartureAirport_depart_leg_id_fkey";

-- DropForeignKey
ALTER TABLE "Legs" DROP CONSTRAINT "Legs_leg_id_fkey";

-- DropForeignKey
ALTER TABLE "Segments" DROP CONSTRAINT "Segments_segment_id_fkey";

-- AlterTable
ALTER TABLE "Legs" ADD COLUMN     "arrival_airport_code" TEXT NOT NULL,
ADD COLUMN     "departure_airport_code" TEXT NOT NULL;

-- DropTable
DROP TABLE "ArrivalAirport";

-- DropTable
DROP TABLE "DepartureAirport";

-- DropTable
DROP TABLE "Segments";

-- CreateTable
CREATE TABLE "Segment" (
    "id" SERIAL NOT NULL,
    "segment_id" TEXT NOT NULL,
    "departure_airport_code" TEXT NOT NULL,
    "arrival_airport_code" TEXT NOT NULL,
    "departure_time" TEXT NOT NULL,
    "arrival_time" TEXT NOT NULL,
    "total_time" INTEGER NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_departure_airport_code_fkey" FOREIGN KEY ("departure_airport_code") REFERENCES "Airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_arrival_airport_code_fkey" FOREIGN KEY ("arrival_airport_code") REFERENCES "Airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "FlightOffers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legs" ADD CONSTRAINT "Legs_departure_airport_code_fkey" FOREIGN KEY ("departure_airport_code") REFERENCES "Airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legs" ADD CONSTRAINT "Legs_arrival_airport_code_fkey" FOREIGN KEY ("arrival_airport_code") REFERENCES "Airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legs" ADD CONSTRAINT "Legs_leg_id_fkey" FOREIGN KEY ("leg_id") REFERENCES "Segment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
