-- CreateTable
CREATE TABLE "hotel_favourites" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_favourites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hotel_favourites_ownerId_createdAt_idx" ON "hotel_favourites"("ownerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_favourites_ownerId_hotel_id_key" ON "hotel_favourites"("ownerId", "hotel_id");

-- AddForeignKey
ALTER TABLE "hotel_favourites" ADD CONSTRAINT "hotel_favourites_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
