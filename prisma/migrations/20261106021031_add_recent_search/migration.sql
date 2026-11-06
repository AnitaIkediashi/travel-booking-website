-- CreateTable
CREATE TABLE "hotel_recent_searches" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "destinationType" TEXT,
    "destinationValue" TEXT,
    "checkIn" TEXT,
    "checkOut" TEXT,
    "adults" INTEGER,
    "children" INTEGER,
    "rooms" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_recent_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hotel_recent_searches_ownerId_updatedAt_idx" ON "hotel_recent_searches"("ownerId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "hotel_recent_searches_ownerId_destination_key" ON "hotel_recent_searches"("ownerId", "destination");
