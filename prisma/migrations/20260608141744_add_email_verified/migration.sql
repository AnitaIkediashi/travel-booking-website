-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL;
