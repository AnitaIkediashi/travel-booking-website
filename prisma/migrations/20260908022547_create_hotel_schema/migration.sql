-- CreateTable
CREATE TABLE "currency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "thumb_nails" TEXT[],
    "amenities" TEXT[],

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_price_breakdown" (
    "id" TEXT NOT NULL,
    "rooms_id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,
    "discount_amount" DECIMAL(10,2) DEFAULT 0,

    CONSTRAINT "room_price_breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "submit_time" TIMESTAMP(3) NOT NULL,
    "image" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" SERIAL NOT NULL,
    "review_id" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rules" (
    "id" SERIAL NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "checkin_time" TEXT NOT NULL,
    "checkout_time" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "room_left" INTEGER NOT NULL,
    "total_rooms" INTEGER NOT NULL,
    "room_type" TEXT NOT NULL,
    "bed_count" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "amenities" TEXT[],
    "features" TEXT[],
    "size_sqft" DOUBLE PRECISION,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_rooms" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "checkin_time" TIMESTAMP(3) NOT NULL,
    "checkout_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_booking" (
    "id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "total_guests" INTEGER NOT NULL,
    "hold_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "contact_email" TEXT,
    "contact_phoneNo" TEXT,
    "room_fee_total" DECIMAL(10,2),

    CONSTRAINT "hotel_booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "guest_index" INTEGER NOT NULL,
    "date_of_birth" TEXT NOT NULL,
    "checked_in_at" TIMESTAMP(3),
    "checked_out_at" TIMESTAMP(3),

    CONSTRAINT "guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_prices" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "currency_id" TEXT NOT NULL,
    "guest_type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_per_pax" DECIMAL(10,2) NOT NULL,
    "base_amount" DECIMAL(10,2) NOT NULL,
    "tax_amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "guest_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currency_code_key" ON "currency"("code");

-- CreateIndex
CREATE UNIQUE INDEX "room_price_breakdown_rooms_id_key" ON "room_price_breakdown"("rooms_id");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_review_id_key" ON "ratings"("review_id");

-- AddForeignKey
ALTER TABLE "room_price_breakdown" ADD CONSTRAINT "room_price_breakdown_rooms_id_fkey" FOREIGN KEY ("rooms_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_price_breakdown" ADD CONSTRAINT "room_price_breakdown_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules" ADD CONSTRAINT "rules_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hotel_booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest" ADD CONSTRAINT "guest_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "hotel_booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_prices" ADD CONSTRAINT "guest_prices_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guest_prices" ADD CONSTRAINT "guest_prices_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
