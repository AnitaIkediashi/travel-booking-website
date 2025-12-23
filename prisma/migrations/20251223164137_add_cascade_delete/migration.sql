-- DropForeignKey
ALTER TABLE "Airlines" DROP CONSTRAINT "Airlines_airline_id_fkey";

-- DropForeignKey
ALTER TABLE "Arrival" DROP CONSTRAINT "Arrival_arrival_id_fkey";

-- DropForeignKey
ALTER TABLE "Baggage" DROP CONSTRAINT "Baggage_baggage_id_fkey";

-- DropForeignKey
ALTER TABLE "BaseFare" DROP CONSTRAINT "BaseFare_base_price_id_fkey";

-- DropForeignKey
ALTER TABLE "BrandedFareInfo" DROP CONSTRAINT "BrandedFareInfo_branded_fareinfo_id_fkey";

-- DropForeignKey
ALTER TABLE "CarrierInfo" DROP CONSTRAINT "CarrierInfo_carrier_info_id_fkey";

-- DropForeignKey
ALTER TABLE "Carriers" DROP CONSTRAINT "Carriers_carrier_id_fkey";

-- DropForeignKey
ALTER TABLE "Depart" DROP CONSTRAINT "Depart_depart_id_fkey";

-- DropForeignKey
ALTER TABLE "DepartureInterval" DROP CONSTRAINT "DepartureInterval_interval_id_fkey";

-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_discount_id_fkey";

-- DropForeignKey
ALTER TABLE "Duration" DROP CONSTRAINT "Duration_duration_id_fkey";

-- DropForeignKey
ALTER TABLE "Features" DROP CONSTRAINT "Features_feature_id_fkey";

-- DropForeignKey
ALTER TABLE "FlightInfo" DROP CONSTRAINT "FlightInfo_flight_info_id_fkey";

-- DropForeignKey
ALTER TABLE "FlightTimes" DROP CONSTRAINT "FlightTimes_flight_times_id_fkey";

-- DropForeignKey
ALTER TABLE "Legs" DROP CONSTRAINT "Legs_leg_id_fkey";

-- DropForeignKey
ALTER TABLE "SeatAvailability" DROP CONSTRAINT "SeatAvailability_seat_availability_id_fkey";

-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_segment_id_fkey";

-- DropForeignKey
ALTER TABLE "ShortLayoverConnection" DROP CONSTRAINT "ShortLayoverConnection_layover_id_fkey";

-- DropForeignKey
ALTER TABLE "Stop" DROP CONSTRAINT "Stop_stop_id_fkey";

-- DropForeignKey
ALTER TABLE "Tax" DROP CONSTRAINT "Tax_tax_id_fkey";

-- DropForeignKey
ALTER TABLE "TotalPrice" DROP CONSTRAINT "TotalPrice_total_price_id_fkey";

-- DropForeignKey
ALTER TABLE "TravelerPrice" DROP CONSTRAINT "TravelerPrice_traveler_price_id_fkey";

-- AddForeignKey
ALTER TABLE "DepartureInterval" ADD CONSTRAINT "DepartureInterval_interval_id_fkey" FOREIGN KEY ("interval_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortLayoverConnection" ADD CONSTRAINT "ShortLayoverConnection_layover_id_fkey" FOREIGN KEY ("layover_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airlines" ADD CONSTRAINT "Airlines_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Duration" ADD CONSTRAINT "Duration_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Baggage" ADD CONSTRAINT "Baggage_baggage_id_fkey" FOREIGN KEY ("baggage_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightTimes" ADD CONSTRAINT "FlightTimes_flight_times_id_fkey" FOREIGN KEY ("flight_times_id") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_arrival_id_fkey" FOREIGN KEY ("arrival_id") REFERENCES "FlightTimes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depart" ADD CONSTRAINT "Depart_depart_id_fkey" FOREIGN KEY ("depart_id") REFERENCES "FlightTimes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "FlightOffers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legs" ADD CONSTRAINT "Legs_leg_id_fkey" FOREIGN KEY ("leg_id") REFERENCES "Segment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carriers" ADD CONSTRAINT "Carriers_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "Legs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightInfo" ADD CONSTRAINT "FlightInfo_flight_info_id_fkey" FOREIGN KEY ("flight_info_id") REFERENCES "Legs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierInfo" ADD CONSTRAINT "CarrierInfo_carrier_info_id_fkey" FOREIGN KEY ("carrier_info_id") REFERENCES "FlightInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TotalPrice" ADD CONSTRAINT "TotalPrice_total_price_id_fkey" FOREIGN KEY ("total_price_id") REFERENCES "PriceBreakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseFare" ADD CONSTRAINT "BaseFare_base_price_id_fkey" FOREIGN KEY ("base_price_id") REFERENCES "PriceBreakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "PriceBreakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "PriceBreakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerPrice" ADD CONSTRAINT "TravelerPrice_traveler_price_id_fkey" FOREIGN KEY ("traveler_price_id") REFERENCES "FlightOffers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAvailability" ADD CONSTRAINT "SeatAvailability_seat_availability_id_fkey" FOREIGN KEY ("seat_availability_id") REFERENCES "FlightOffers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandedFareInfo" ADD CONSTRAINT "BrandedFareInfo_branded_fareinfo_id_fkey" FOREIGN KEY ("branded_fareinfo_id") REFERENCES "FlightOffers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "BrandedFareInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
