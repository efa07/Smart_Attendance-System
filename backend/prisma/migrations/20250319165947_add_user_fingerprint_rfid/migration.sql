-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fingerprintId" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rfidId" TEXT;
