/*
  Warnings:

  - You are about to drop the column `date` on the `bookings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingDateId]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookingDateId` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availabilities" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "date",
ADD COLUMN     "bookingDateId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingDateId_key" ON "bookings"("bookingDateId");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_bookingDateId_fkey" FOREIGN KEY ("bookingDateId") REFERENCES "availabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
