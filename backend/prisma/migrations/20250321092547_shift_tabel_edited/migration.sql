/*
  Warnings:

  - The `shiftType` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "shiftType",
ADD COLUMN     "shiftType" TEXT;

-- DropEnum
DROP TYPE "ShiftType";
