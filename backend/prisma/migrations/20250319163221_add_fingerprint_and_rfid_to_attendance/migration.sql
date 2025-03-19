/*
  Warnings:

  - You are about to drop the column `approvedByHR` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "approvedByHR",
ADD COLUMN     "fingerprintId" TEXT,
ADD COLUMN     "rfidId" TEXT,
ADD COLUMN     "toleranceTime" INTEGER NOT NULL DEFAULT 10;
