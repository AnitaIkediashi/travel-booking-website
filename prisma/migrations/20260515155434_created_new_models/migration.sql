-- AlterTable
ALTER TABLE "CardDetails" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'some-default-id';

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "coverImage" TEXT,
    "phoneNo" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "stripeCustomerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "CardDetails_userId_idx" ON "CardDetails"("userId");

-- AddForeignKey
ALTER TABLE "CardDetails" ADD CONSTRAINT "CardDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
