/*
  Warnings:

  - Added the required column `montoTotalRetenido` to the `ComprobanteISLR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodoFiscalId` to the `ComprobanteISLR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proveedorId` to the `ComprobanteISLR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComprobanteISLR" ADD COLUMN     "montoTotalRetenido" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "periodoFiscalId" TEXT NOT NULL,
ADD COLUMN     "proveedorId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ComprobanteISLR_proveedorId_idx" ON "ComprobanteISLR"("proveedorId");

-- CreateIndex
CREATE INDEX "ComprobanteISLR_periodoFiscalId_idx" ON "ComprobanteISLR"("periodoFiscalId");

-- AddForeignKey
ALTER TABLE "ComprobanteISLR" ADD CONSTRAINT "ComprobanteISLR_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteISLR" ADD CONSTRAINT "ComprobanteISLR_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
