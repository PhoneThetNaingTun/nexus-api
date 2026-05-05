-- CreateTable
CREATE TABLE "MedicalPackageItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalPackageItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalPackage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MedicalPackageToMedicalPackageItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MedicalPackageToMedicalPackageItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalPackageItem_name_key" ON "MedicalPackageItem"("name");

-- CreateIndex
CREATE INDEX "_MedicalPackageToMedicalPackageItem_B_index" ON "_MedicalPackageToMedicalPackageItem"("B");

-- AddForeignKey
ALTER TABLE "_MedicalPackageToMedicalPackageItem" ADD CONSTRAINT "_MedicalPackageToMedicalPackageItem_A_fkey" FOREIGN KEY ("A") REFERENCES "MedicalPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MedicalPackageToMedicalPackageItem" ADD CONSTRAINT "_MedicalPackageToMedicalPackageItem_B_fkey" FOREIGN KEY ("B") REFERENCES "MedicalPackageItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
