/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentMethodId]` on the table `CardDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CardDetails_stripePaymentMethodId_key" ON "CardDetails"("stripePaymentMethodId");
