-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_tokens" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "otp_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_details" (
    "id" TEXT NOT NULL,
    "stripePaymentMethodId" TEXT NOT NULL,
    "cardType" TEXT,
    "last4" TEXT NOT NULL,
    "expMonth" INTEGER NOT NULL,
    "expYear" INTEGER NOT NULL,
    "cardName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "card_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "airport_code" TEXT NOT NULL,
    "airport_name" TEXT NOT NULL,
    "image_url" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("airport_code")
);

-- CreateTable
CREATE TABLE "data" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_min" INTEGER NOT NULL,
    "duration_max" INTEGER NOT NULL,
    "cabin_class" TEXT NOT NULL,

    CONSTRAINT "data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departure_interval" (
    "id" SERIAL NOT NULL,
    "interval_id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "departure_interval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "short_Layover_connection" (
    "id" SERIAL NOT NULL,
    "layover_id" TEXT NOT NULL,
    "count" INTEGER,

    CONSTRAINT "short_Layover_connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "min_price" (
    "id" SERIAL NOT NULL,
    "min_price_data_id" TEXT NOT NULL,
    "min_price_airline_id" TEXT,
    "min_price_stop_id" INTEGER,
    "currency_code" TEXT,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "min_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stops" (
    "id" SERIAL NOT NULL,
    "stop_id" TEXT NOT NULL,
    "no_of_stops" INTEGER NOT NULL,
    "count" INTEGER,

    CONSTRAINT "stops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" TEXT NOT NULL,
    "airline_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "iata_code" TEXT NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duration" (
    "id" SERIAL NOT NULL,
    "duration_id" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,

    CONSTRAINT "duration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baggages" (
    "id" SERIAL NOT NULL,
    "baggage_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "included" BOOLEAN NOT NULL,
    "weight" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "param_name" TEXT NOT NULL,

    CONSTRAINT "baggages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_times" (
    "id" TEXT NOT NULL,
    "flight_times_id" TEXT NOT NULL,

    CONSTRAINT "flight_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arrivals" (
    "id" SERIAL NOT NULL,
    "arrival_id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "arrivals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depart" (
    "id" SERIAL NOT NULL,
    "depart_id" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,

    CONSTRAINT "depart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_offers" (
    "id" TEXT NOT NULL,
    "flight_offer_id" TEXT NOT NULL,
    "price_id" INTEGER,
    "token" TEXT NOT NULL,
    "flight_key" TEXT NOT NULL,

    CONSTRAINT "flight_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segments" (
    "id" SERIAL NOT NULL,
    "segment_id" TEXT NOT NULL,
    "departure_airport_code" TEXT NOT NULL,
    "arrival_airport_code" TEXT NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "total_time" INTEGER NOT NULL,

    CONSTRAINT "segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legs" (
    "id" SERIAL NOT NULL,
    "leg_id" INTEGER NOT NULL,
    "departure_airport_code" TEXT NOT NULL,
    "arrival_airport_code" TEXT NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "cabin_class" TEXT,
    "total_time" INTEGER NOT NULL,
    "departure_gate_id" INTEGER,
    "arrival_gate_id" INTEGER,

    CONSTRAINT "legs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carriers" (
    "id" SERIAL NOT NULL,
    "carrier_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_info" (
    "id" SERIAL NOT NULL,
    "flight_info_id" INTEGER NOT NULL,
    "flight_number" TEXT NOT NULL,

    CONSTRAINT "flight_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrier_info" (
    "id" SERIAL NOT NULL,
    "carrier_info_id" INTEGER NOT NULL,
    "operating_carrier" TEXT NOT NULL,

    CONSTRAINT "carrier_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_breakdown" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "price_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "total_price" (
    "id" SERIAL NOT NULL,
    "total_price_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "total_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_fare" (
    "id" SERIAL NOT NULL,
    "base_price_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "base_fare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax" (
    "id" SERIAL NOT NULL,
    "tax_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount" (
    "id" SERIAL NOT NULL,
    "discount_id" INTEGER NOT NULL,
    "currency_code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_price" (
    "id" SERIAL NOT NULL,
    "traveler_price_id" TEXT NOT NULL,
    "price_id" INTEGER,
    "traveler_reference" TEXT NOT NULL,
    "traveler_type" TEXT NOT NULL,

    CONSTRAINT "travel_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat_availability" (
    "id" SERIAL NOT NULL,
    "seat_availability_id" TEXT NOT NULL,
    "seats_left" INTEGER NOT NULL,

    CONSTRAINT "seat_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branded_fare_info" (
    "id" SERIAL NOT NULL,
    "branded_fareinfo_id" TEXT NOT NULL,
    "cabin_class" TEXT NOT NULL,

    CONSTRAINT "branded_fare_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" SERIAL NOT NULL,
    "feature_id" INTEGER NOT NULL,
    "feature_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availability" TEXT NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gates" (
    "id" SERIAL NOT NULL,
    "gate_number" TEXT NOT NULL,
    "terminal" TEXT NOT NULL,

    CONSTRAINT "gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" SERIAL NOT NULL,
    "seat_id" TEXT NOT NULL,
    "seat_number" TEXT NOT NULL,
    "cabin_class" TEXT NOT NULL,
    "is_window" BOOLEAN NOT NULL,
    "is_aisle" BOOLEAN NOT NULL,
    "is_exit_row" BOOLEAN NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,
    "extra_fee" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "coverImage" TEXT,
    "phoneNo" TEXT,
    "address" TEXT,
    "password" TEXT,
    "stripeCustomerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "otp_tokens_email_idx" ON "otp_tokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "card_details_stripePaymentMethodId_key" ON "card_details"("stripePaymentMethodId");

-- CreateIndex
CREATE INDEX "card_details_userId_idx" ON "card_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "short_Layover_connection_layover_id_key" ON "short_Layover_connection"("layover_id");

-- CreateIndex
CREATE UNIQUE INDEX "min_price_min_price_data_id_key" ON "min_price"("min_price_data_id");

-- CreateIndex
CREATE UNIQUE INDEX "min_price_min_price_airline_id_key" ON "min_price"("min_price_airline_id");

-- CreateIndex
CREATE UNIQUE INDEX "min_price_min_price_stop_id_key" ON "min_price"("min_price_stop_id");

-- CreateIndex
CREATE INDEX "segments_departure_time_idx" ON "segments"("departure_time");

-- CreateIndex
CREATE UNIQUE INDEX "legs_departure_gate_id_key" ON "legs"("departure_gate_id");

-- CreateIndex
CREATE UNIQUE INDEX "legs_arrival_gate_id_key" ON "legs"("arrival_gate_id");

-- CreateIndex
CREATE UNIQUE INDEX "flight_info_flight_info_id_key" ON "flight_info"("flight_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "carrier_info_carrier_info_id_key" ON "carrier_info"("carrier_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "total_price_total_price_id_key" ON "total_price"("total_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "base_fare_base_price_id_key" ON "base_fare"("base_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "tax_tax_id_key" ON "tax"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_discount_id_key" ON "discount"("discount_id");

-- CreateIndex
CREATE UNIQUE INDEX "seat_availability_seat_availability_id_key" ON "seat_availability"("seat_availability_id");

-- CreateIndex
CREATE UNIQUE INDEX "branded_fare_info_branded_fareinfo_id_key" ON "branded_fare_info"("branded_fareinfo_id");

-- CreateIndex
CREATE UNIQUE INDEX "seats_seat_id_seat_number_key" ON "seats"("seat_id", "seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_details" ADD CONSTRAINT "card_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departure_interval" ADD CONSTRAINT "departure_interval_interval_id_fkey" FOREIGN KEY ("interval_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "short_Layover_connection" ADD CONSTRAINT "short_Layover_connection_layover_id_fkey" FOREIGN KEY ("layover_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "min_price" ADD CONSTRAINT "min_price_min_price_data_id_fkey" FOREIGN KEY ("min_price_data_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "min_price" ADD CONSTRAINT "min_price_min_price_airline_id_fkey" FOREIGN KEY ("min_price_airline_id") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "min_price" ADD CONSTRAINT "min_price_min_price_stop_id_fkey" FOREIGN KEY ("min_price_stop_id") REFERENCES "stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stops" ADD CONSTRAINT "stops_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "airlines" ADD CONSTRAINT "airlines_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duration" ADD CONSTRAINT "duration_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baggages" ADD CONSTRAINT "baggages_baggage_id_fkey" FOREIGN KEY ("baggage_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_times" ADD CONSTRAINT "flight_times_flight_times_id_fkey" FOREIGN KEY ("flight_times_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrivals" ADD CONSTRAINT "arrivals_arrival_id_fkey" FOREIGN KEY ("arrival_id") REFERENCES "flight_times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depart" ADD CONSTRAINT "depart_depart_id_fkey" FOREIGN KEY ("depart_id") REFERENCES "flight_times"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_offers" ADD CONSTRAINT "flight_offers_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "price_breakdown"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_offers" ADD CONSTRAINT "flight_offers_flight_offer_id_fkey" FOREIGN KEY ("flight_offer_id") REFERENCES "data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_departure_airport_code_fkey" FOREIGN KEY ("departure_airport_code") REFERENCES "airports"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_arrival_airport_code_fkey" FOREIGN KEY ("arrival_airport_code") REFERENCES "airports"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legs" ADD CONSTRAINT "legs_departure_airport_code_fkey" FOREIGN KEY ("departure_airport_code") REFERENCES "airports"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legs" ADD CONSTRAINT "legs_arrival_airport_code_fkey" FOREIGN KEY ("arrival_airport_code") REFERENCES "airports"("airport_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legs" ADD CONSTRAINT "legs_departure_gate_id_fkey" FOREIGN KEY ("departure_gate_id") REFERENCES "gates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legs" ADD CONSTRAINT "legs_arrival_gate_id_fkey" FOREIGN KEY ("arrival_gate_id") REFERENCES "gates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legs" ADD CONSTRAINT "legs_leg_id_fkey" FOREIGN KEY ("leg_id") REFERENCES "segments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carriers" ADD CONSTRAINT "carriers_carrier_id_fkey" FOREIGN KEY ("carrier_id") REFERENCES "legs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_info" ADD CONSTRAINT "flight_info_flight_info_id_fkey" FOREIGN KEY ("flight_info_id") REFERENCES "legs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrier_info" ADD CONSTRAINT "carrier_info_carrier_info_id_fkey" FOREIGN KEY ("carrier_info_id") REFERENCES "flight_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "total_price" ADD CONSTRAINT "total_price_total_price_id_fkey" FOREIGN KEY ("total_price_id") REFERENCES "price_breakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_fare" ADD CONSTRAINT "base_fare_base_price_id_fkey" FOREIGN KEY ("base_price_id") REFERENCES "price_breakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax" ADD CONSTRAINT "tax_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "price_breakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount" ADD CONSTRAINT "discount_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "price_breakdown"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_price" ADD CONSTRAINT "travel_price_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "price_breakdown"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_price" ADD CONSTRAINT "travel_price_traveler_price_id_fkey" FOREIGN KEY ("traveler_price_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat_availability" ADD CONSTRAINT "seat_availability_seat_availability_id_fkey" FOREIGN KEY ("seat_availability_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branded_fare_info" ADD CONSTRAINT "branded_fare_info_branded_fareinfo_id_fkey" FOREIGN KEY ("branded_fareinfo_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "branded_fare_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
