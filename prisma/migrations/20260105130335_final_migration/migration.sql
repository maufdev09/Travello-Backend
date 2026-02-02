-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "images" DROP NOT NULL,
ALTER COLUMN "images" SET DATA TYPE TEXT;
