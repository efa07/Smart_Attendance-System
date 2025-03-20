-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "clockOutStatus" TEXT,
ALTER COLUMN "status" DROP NOT NULL;
