-- DropForeignKey
ALTER TABLE "FlightOffers" DROP CONSTRAINT "FlightOffers_flight_offer_id_fkey";

-- AddForeignKey
ALTER TABLE "FlightOffers" ADD CONSTRAINT "FlightOffers_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
