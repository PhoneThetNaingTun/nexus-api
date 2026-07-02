/*
  Warnings:

  - You are about to drop the column `medicalRecordId` on the `UserPackage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userPackageId]` on the table `MedicalRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserPackage" DROP CONSTRAINT "UserPackage_medicalRecordId_fkey";

-- DropIndex
DROP INDEX "UserPackage_medicalRecordId_key";

-- AlterTable
ALTER TABLE "MedicalRecord" ADD COLUMN     "userPackageId" TEXT;

-- AlterTable
ALTER TABLE "UserPackage" DROP COLUMN "medicalRecordId";

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_userPackageId_key" ON "MedicalRecord"("userPackageId");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_userPackageId_fkey" FOREIGN KEY ("userPackageId") REFERENCES "UserPackage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
