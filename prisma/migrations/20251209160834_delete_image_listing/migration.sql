/*
  Warnings:

  - You are about to drop the `listing_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "listing_images" DROP CONSTRAINT "listing_images_listingId_fkey";

-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "images" TEXT[];

-- DropTable
DROP TABLE "listing_images";
