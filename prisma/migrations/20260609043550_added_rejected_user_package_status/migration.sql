-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('PENDING', 'PURCHASED', 'USED', 'EXPIRED', 'REFUNDED', 'REJECTED');

-- CreateTable
CREATE TABLE "UserPackage" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "purchasedPrice" DOUBLE PRECISION NOT NULL,
    "paymentScreenshot" TEXT,
    "status" "PackageStatus" NOT NULL DEFAULT 'PENDING',
    "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" TIMESTAMP(3),
    "usedAt" TIMESTAMP(3),
    "medicalRecordId" TEXT,

    CONSTRAINT "UserPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPackage_medicalRecordId_key" ON "UserPackage"("medicalRecordId");

-- AddForeignKey
ALTER TABLE "UserPackage" ADD CONSTRAINT "UserPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "MedicalPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPackage" ADD CONSTRAINT "UserPackage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPackage" ADD CONSTRAINT "UserPackage_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
