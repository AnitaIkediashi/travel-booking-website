-- CreateTable
CREATE TABLE "CardDetails" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "expDate" TEXT NOT NULL,
    "cvc" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "CardDetails_pkey" PRIMARY KEY ("id")
);
