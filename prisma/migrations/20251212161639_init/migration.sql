-- CreateTable
CREATE TABLE "Airport" (
    "airport_code" TEXT NOT NULL,
    "airport_name" TEXT NOT NULL,
    "image_url" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("airport_code")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "duration_max" INTEGER NOT NULL,
    "cabin_class" TEXT NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartureInterval" (
    "id" SERIAL NOT NULL,
    "interval_id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "DepartureInterval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortLayoverConnection" (
    "id" SERIAL NOT NULL,
    "layover_id" TEXT NOT NULL,
    "count" INTEGER,

    CONSTRAINT "ShortLayoverConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinPrice" (
    "id" SERIAL NOT NULL,
    "min_price_data_id" TEXT NOT NULL,
    "min_price_airline_id" TEXT NOT NULL,
    "min_price_stop_id" INTEGER NOT NULL,
    "currency_code" TEXT,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "MinPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" SERIAL NOT NULL,
    "stop_id" TEXT NOT NULL,
    "no_of_stops" INTEGER NOT NULL,
    "count" INTEGER,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airlines" (
    "id" TEXT NOT NULL,
    "airline_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "iata_code" TEXT NOT NULL,

    CONSTRAINT "Airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Duration" (
    "id" SERIAL NOT NULL,
    "duration_id" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,

    CONSTRAINT "Duration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Baggage" (
    "id" SERIAL NOT NULL,
    "baggage_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "included" BOOLEAN NOT NULL,
    "weight" INTEGER,
    "param_name" TEXT,

    CONSTRAINT "Baggage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightTimes" (
    "id" TEXT NOT NULL,
    "flight_times_id" TEXT NOT NULL,

    CONSTRAINT "FlightTimes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrival" (
    "id" SERIAL NOT NULL,
    "arrival_id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "Arrival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depart" (
    "id" SERIAL NOT NULL,
    "depart_id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "Depart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightOffers" (
    "id" TEXT NOT NULL,
    "flight_offer_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "trip_type" TEXT NOT NULL,
    "flight_key" TEXT NOT NULL,

    CONSTRAINT "FlightOffers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Segments" (
    "id" SERIAL NOT NULL,
    "segment_id" TEXT NOT NULL,
    "departure_time" TEXT NOT NULL,
    "arrival_time" TEXT NOT NULL,
    "total_time" INTEGER NOT NULL,

    CONSTRAINT "Segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartureAirport" (
    "id" SERIAL NOT NULL,
    "depart_id" INTEGER NOT NULL,
    "depart_leg_id" INTEGER NOT NULL,
    "airport_code" TEXT NOT NULL,

    CONSTRAINT "DepartureAirport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArrivalAirport" (
    "id" SERIAL NOT NULL,
    "arrival_id" INTEGER NOT NULL,
    "arrival_leg_id" INTEGER NOT NULL,
    "airport_code" TEXT NOT NULL,

    CONSTRAINT "ArrivalAirport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Legs" (
    "id" SERIAL NOT NULL,
    "leg_id" INTEGER NOT NULL,
    "departure_time" TEXT NOT NULL,
    "arrival_time" TEXT NOT NULL,
    "cabin_class" TEXT NOT NULL,
    "total_time" INTEGER NOT NULL,

    CONSTRAINT "Legs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carriers" (
    "id" SERIAL NOT NULL,
    "carrier_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightInfo" (
    "id" SERIAL NOT NULL,
    "flight_info_id" INTEGER NOT NULL,
    "flight_number" INTEGER NOT NULL,

    CONSTRAINT "FlightInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierInfo" (
    "id" SERIAL NOT NULL,
    "carrier_info_id" INTEGER NOT NULL,
    "operating_carrier" TEXT NOT NULL,

    CONSTRAINT "CarrierInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceBreakdown" (
    "id" SERIAL NOT NULL,
    "price_breakdown_id" TEXT NOT NULL,
    "traveler_price_id" INTEGER NOT NULL,

    CONSTRAINT "PriceBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TotalPrice" (
    "id" SERIAL NOT NULL,
    "total_price_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "TotalPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseFare" (
    "id" SERIAL NOT NULL,
    "base_price_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "BaseFare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tax" (
    "id" SERIAL NOT NULL,
    "tax_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "discount_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelerPrice" (
    "id" SERIAL NOT NULL,
    "traveler_price_id" TEXT NOT NULL,
    "traveler_reference" TEXT NOT NULL,
    "traveler_type" TEXT NOT NULL,

    CONSTRAINT "TravelerPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatAvailability" (
    "id" SERIAL NOT NULL,
    "seat_availability_id" TEXT NOT NULL,
    "seats_left" INTEGER NOT NULL,

    CONSTRAINT "SeatAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandedFareInfo" (
    "id" SERIAL NOT NULL,
    "branded_fareinfo_id" TEXT NOT NULL,
    "cabin_class" TEXT NOT NULL,

    CONSTRAINT "BrandedFareInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Features" (
    "id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "feature_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availability" BOOLEAN NOT NULL,

    CONSTRAINT "Features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortLayoverConnection_layover_id_key" ON "ShortLayoverConnection"("layover_id");

-- CreateIndex
CREATE UNIQUE INDEX "MinPrice_min_price_data_id_key" ON "MinPrice"("min_price_data_id");

-- CreateIndex
CREATE UNIQUE INDEX "MinPrice_min_price_airline_id_key" ON "MinPrice"("min_price_airline_id");

-- CreateIndex
CREATE UNIQUE INDEX "MinPrice_min_price_stop_id_key" ON "MinPrice"("min_price_stop_id");

-- CreateIndex
CREATE UNIQUE INDEX "Airlines_airline_id_key" ON "Airlines"("airline_id");

-- CreateIndex
CREATE UNIQUE INDEX "DepartureAirport_depart_id_key" ON "DepartureAirport"("depart_id");

-- CreateIndex
CREATE UNIQUE INDEX "DepartureAirport_depart_leg_id_key" ON "DepartureAirport"("depart_leg_id");

-- CreateIndex
CREATE UNIQUE INDEX "ArrivalAirport_arrival_id_key" ON "ArrivalAirport"("arrival_id");

-- CreateIndex
CREATE UNIQUE INDEX "ArrivalAirport_arrival_leg_id_key" ON "ArrivalAirport"("arrival_leg_id");

-- CreateIndex
CREATE UNIQUE INDEX "Legs_leg_id_key" ON "Legs"("leg_id");

-- CreateIndex
CREATE UNIQUE INDEX "Carriers_carrier_id_key" ON "Carriers"("carrier_id");

-- CreateIndex
CREATE UNIQUE INDEX "FlightInfo_flight_info_id_key" ON "FlightInfo"("flight_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierInfo_carrier_info_id_key" ON "CarrierInfo"("carrier_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "PriceBreakdown_price_breakdown_id_key" ON "PriceBreakdown"("price_breakdown_id");

-- CreateIndex
CREATE UNIQUE INDEX "PriceBreakdown_traveler_price_id_key" ON "PriceBreakdown"("traveler_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "TotalPrice_total_price_id_key" ON "TotalPrice"("total_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "BaseFare_base_price_id_key" ON "BaseFare"("base_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tax_tax_id_key" ON "Tax"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_discount_id_key" ON "Discount"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "TravelerPrice_traveler_price_id_key" ON "TravelerPrice"("traveler_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "SeatAvailability_seat_availability_id_key" ON "SeatAvailability"("seat_availability_id");

-- CreateIndex
CREATE UNIQUE INDEX "BrandedFareInfo_branded_fareinfo_id_key" ON "BrandedFareInfo"("branded_fareinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Features_feature_id_key" ON "Features"("feature_id");

-- AddForeignKey
ALTER TABLE "DepartureInterval" ADD CONSTRAINT "DepartureInterval_interval_id_fkey" FOREIGN KEY ("interval_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortLayoverConnection" ADD CONSTRAINT "ShortLayoverConnection_layover_id_fkey" FOREIGN KEY ("layover_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_data_id_fkey" FOREIGN KEY ("min_price_data_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_airline_id_fkey" FOREIGN KEY ("min_price_airline_id") REFERENCES "Airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinPrice" ADD CONSTRAINT "MinPrice_min_price_stop_id_fkey" FOREIGN KEY ("min_price_stop_id") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Airlines" ADD CONSTRAINT "Airlines_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Duration" ADD CONSTRAINT "Duration_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Baggage" ADD CONSTRAINT "Baggage_baggage_id_fkey" FOREIGN KEY ("baggage_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightTimes" ADD CONSTRAINT "FlightTimes_flight_times_id_fkey" FOREIGN KEY ("flight_times_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_arrival_id_fkey" FOREIGN KEY ("arrival_id") REFERENCES "FlightTimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depart" ADD CONSTRAINT "Depart_depart_id_fkey" FOREIGN KEY ("depart_id") REFERENCES "FlightTimes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightOffers" ADD CONSTRAINT "FlightOffers_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "Data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segments" ADD CONSTRAINT "Segments_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "FlightOffers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartureAirport" ADD CONSTRAINT "DepartureAirport_airport_code_fkey" FOREIGN KEY ("airport_code") REFERENCES "Airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartureAirport" ADD CONSTRAINT "DepartureAirport_depart_id_fkey" FOREIGN KEY ("depart_id") REFERENCES "Segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartureAirport" ADD CONSTRAINT "DepartureAirport_depart_leg_id_fkey" FOREIGN KEY ("depart_leg_id") REFERENCES "Legs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalAirport" ADD CONSTRAINT "ArrivalAirport_airport_code_fkey" FOREIGN KEY ("airport_code") REFERENCES "Airport"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalAirport" ADD CONSTRAINT "ArrivalAirport_arrival_id_fkey" FOREIGN KEY ("arrival_id") REFERENCES "Segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalAirport" ADD CONSTRAINT "ArrivalAirport_arrival_leg_id_fkey" FOREIGN KEY ("arrival_leg_id") REFERENCES "Legs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legs" ADD CONSTRAINT "Legs_leg_id_fkey" FOREIGN KEY ("leg_id") REFERENCES "Segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carriers" ADD CONSTRAINT "Carriers_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "Legs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightInfo" ADD CONSTRAINT "FlightInfo_flight_info_id_fkey" FOREIGN KEY ("flight_info_id") REFERENCES "Legs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierInfo" ADD CONSTRAINT "CarrierInfo_carrier_info_id_fkey" FOREIGN KEY ("carrier_info_id") REFERENCES "FlightInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceBreakdown" ADD CONSTRAINT "PriceBreakdown_price_breakdown_id_fkey" FOREIGN KEY ("price_breakdown_id") REFERENCES "FlightOffers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceBreakdown" ADD CONSTRAINT "PriceBreakdown_traveler_price_id_fkey" FOREIGN KEY ("traveler_price_id") REFERENCES "TravelerPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TotalPrice" ADD CONSTRAINT "TotalPrice_total_price_id_fkey" FOREIGN KEY ("total_price_id") REFERENCES "PriceBreakdown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BaseFare" ADD CONSTRAINT "BaseFare_base_price_id_fkey" FOREIGN KEY ("base_price_id") REFERENCES "PriceBreakdown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tax" ADD CONSTRAINT "Tax_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "PriceBreakdown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "PriceBreakdown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelerPrice" ADD CONSTRAINT "TravelerPrice_traveler_price_id_fkey" FOREIGN KEY ("traveler_price_id") REFERENCES "FlightOffers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAvailability" ADD CONSTRAINT "SeatAvailability_seat_availability_id_fkey" FOREIGN KEY ("seat_availability_id") REFERENCES "FlightOffers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandedFareInfo" ADD CONSTRAINT "BrandedFareInfo_branded_fareinfo_id_fkey" FOREIGN KEY ("branded_fareinfo_id") REFERENCES "FlightOffers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Features" ADD CONSTRAINT "Features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "BrandedFareInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
