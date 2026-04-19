-- CreateEnum
CREATE TYPE "NaturalezaIVA" AS ENUM ('GRAVADA', 'EXENTA', 'EXONERADA', 'NO_SUJETA');

-- CreateEnum
CREATE TYPE "CategoriaReglaRetencionIVA" AS ENUM ('EXCLUSION_ABSOLUTA', 'EXCLUSION_CONDICIONAL', 'RETENCION_TOTAL', 'RETENCION_GENERAL');

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "cumpleRequisitosFormales" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "esGastoReembolsable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "esOperacionArticulo2RetencionTotal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "esServicioPublicoDomiciliario" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "esViatico" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ivaDiscriminado" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "montoOperacionUTSnapshot" DECIMAL(18,4),
ADD COLUMN     "naturalezaIVA" "NaturalezaIVA" NOT NULL DEFAULT 'GRAVADA',
ADD COLUMN     "porcentajeAlicuotaSnapshot" DECIMAL(5,2),
ADD COLUMN     "tienePercepcionAnticipadaIVA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "valorUTSnapshot" DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "esAgentePercepcionIVA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "proveedorMarcadoRetencion100" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rifRegistrado" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rifValidadoPortalFiscalAt" TIMESTAMP(3),
ADD COLUMN     "rubroPercepcionIVA" TEXT;

-- AlterTable
ALTER TABLE "RetencionIVA" ADD COLUMN     "aplicaRetencion" BOOLEAN,
ADD COLUMN     "baseLegalArticulo" TEXT,
ADD COLUMN     "baseLegalDescripcion" TEXT,
ADD COLUMN     "baseLegalNorma" TEXT,
ADD COLUMN     "categoriaRegla" "CategoriaReglaRetencionIVA",
ADD COLUMN     "montoOperacionUTSnapshot" DECIMAL(18,4),
ADD COLUMN     "motivoCodigo" TEXT,
ADD COLUMN     "motivoDescripcion" TEXT,
ADD COLUMN     "valorUTSnapshot" DECIMAL(18,2),
ADD COLUMN     "versionMotor" TEXT;
