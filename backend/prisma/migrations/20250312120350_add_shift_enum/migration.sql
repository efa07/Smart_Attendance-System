/*
  Warnings:

  - Changed the type of `shiftType` on the `Shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('Morning', 'Afternoon', 'Evening');

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "shiftType",
ADD COLUMN     "shiftType" "ShiftType" NOT NULL;
