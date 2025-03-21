/*
  Warnings:

  - You are about to drop the column `shiftName` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "shiftName",
ADD COLUMN     "shift" TEXT;
