/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `flight_offers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "flight_offers_token_key" ON "flight_offers"("token");
