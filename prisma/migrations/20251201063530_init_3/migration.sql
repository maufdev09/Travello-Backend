/*
  Warnings:

  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `guides` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "guides" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'TOURIST';
