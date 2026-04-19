-- CreateEnum
CREATE TYPE "PlanMembresia" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "TipoPersona" AS ENUM ('NATURAL', 'JURIDICA');

-- CreateEnum
CREATE TYPE "TipoResidencia" AS ENUM ('RESIDENTE', 'NO_RESIDENTE', 'DOMICILIADO', 'NO_DOMICILIADO');

-- CreateEnum
CREATE TYPE "TipoContribuyente" AS ENUM ('ORDINARIO', 'ESPECIAL', 'FORMAL');

-- CreateEnum
CREATE TYPE "EstadoPeriodoFiscal" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "FrecuenciaPeriodo" AS ENUM ('MENSUAL', 'QUINCENAL');

-- CreateEnum
CREATE TYPE "TipoImpuesto" AS ENUM ('IVA', 'ISLR');

-- CreateEnum
CREATE TYPE "EstadoCompra" AS ENUM ('REGISTRADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PROCESADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "EstadoRetencion" AS ENUM ('CALCULADA', 'CONFIRMADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "TipoEventoRetencion" AS ENUM ('PAGO_EFECTIVO', 'ABONO_EN_CUENTA');

-- CreateEnum
CREATE TYPE "TipoExportacionFiscal" AS ENUM ('TXT_IVA', 'XML_ISLR');

-- CreateEnum
CREATE TYPE "EstadoExportacionFiscal" AS ENUM ('GENERADA', 'ENVIADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "TipoAjuste" AS ENUM ('ANULACION', 'DESCUENTO', 'DEVOLUCION', 'ERROR_PRECIO');

-- CreateEnum
CREATE TYPE "TipoAccionAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'GENERATE', 'CLOSE_PERIOD');

-- CreateTable
CREATE TABLE "Organizacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rif" TEXT NOT NULL,
    "logoUrl" TEXT,
    "emailContacto" TEXT,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "permisos" JSONB NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsignacionRol" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rolId" TEXT NOT NULL,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AsignacionRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membresia" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "plan" "PlanMembresia" NOT NULL,
    "maxEmpresas" INTEGER,
    "maxUsuarios" INTEGER,
    "maxDocumentos" INTEGER,
    "fechaVencimiento" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membresia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "nombreFiscal" TEXT NOT NULL,
    "rif" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "agenteRetencionIVA" BOOLEAN NOT NULL DEFAULT false,
    "agenteRetencionISLR" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rif" TEXT NOT NULL,
    "tipoPersona" "TipoPersona" NOT NULL,
    "tipoResidencia" "TipoResidencia" NOT NULL,
    "tipoContribuyente" "TipoContribuyente" NOT NULL,
    "porcentajeRetencionIVA" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodoFiscal" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "tipoImpuesto" "TipoImpuesto" NOT NULL,
    "frecuencia" "FrecuenciaPeriodo" NOT NULL,
    "subperiodo" INTEGER,
    "codigoPeriodo" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "estado" "EstadoPeriodoFiscal" NOT NULL DEFAULT 'ABIERTO',
    "fechaCierre" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodoFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnidadTributaria" (
    "id" TEXT NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "fechaDesde" TIMESTAMP(3) NOT NULL,
    "fechaHasta" TIMESTAMP(3),
    "gaceta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnidadTributaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlicuotaIVA" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" DECIMAL(5,2) NOT NULL,
    "fechaDesde" TIMESTAMP(3) NOT NULL,
    "fechaHasta" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlicuotaIVA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptoISLR" (
    "id" TEXT NOT NULL,
    "codigoSENIAT" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "porcentajeBaseImponible" DECIMAL(8,4) NOT NULL,
    "tarifaPJ" DECIMAL(8,4) NOT NULL,
    "tarifaPN" DECIMAL(8,4) NOT NULL,
    "minimoUT" DECIMAL(18,4) NOT NULL,
    "aplicaSustraendo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConceptoISLR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarioFiscal" (
    "id" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "ultimoDigitoRif" INTEGER NOT NULL,
    "fechaVencimientoIVA" TIMESTAMP(3),
    "fechaVencimientoISLR" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarioFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroFiscal" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "proximoCorrelativoIVA" INTEGER NOT NULL DEFAULT 1,
    "proximoCorrelativoISLR" INTEGER NOT NULL DEFAULT 1,
    "reinicioCorrelativoMensual" BOOLEAN NOT NULL DEFAULT true,
    "esAgenteEspecial" BOOLEAN NOT NULL DEFAULT false,
    "porcentajeRetencionDefecto" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParametroFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaldoCompensacionIVA" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodoFiscalId" TEXT NOT NULL,
    "saldoAnterior" DECIMAL(18,2) NOT NULL,
    "montoOriginado" DECIMAL(18,2) NOT NULL,
    "montoAplicado" DECIMAL(18,2) NOT NULL,
    "saldoSiguiente" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaldoCompensacionIVA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "tipoDocumentoId" TEXT NOT NULL,
    "periodoFiscalId" TEXT NOT NULL,
    "documentoAfectadoId" TEXT,
    "numeroFactura" TEXT,
    "numeroControl" TEXT,
    "fechaFactura" TIMESTAMP(3) NOT NULL,
    "montoExento" DECIMAL(18,2) NOT NULL,
    "montoBase" DECIMAL(18,2) NOT NULL,
    "impuestoIVA" DECIMAL(18,2) NOT NULL,
    "totalFactura" DECIMAL(18,2) NOT NULL,
    "estado" "EstadoCompra" NOT NULL DEFAULT 'REGISTRADA',
    "tipoAjuste" "TipoAjuste",
    "motivoAjuste" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "periodoFiscalId" TEXT NOT NULL,
    "conceptoISLRId" TEXT NOT NULL,
    "fechaPago" TIMESTAMP(3) NOT NULL,
    "montoTotal" DECIMAL(18,2) NOT NULL,
    "moneda" TEXT,
    "tasaCambio" DECIMAL(18,6),
    "referencia" TEXT,
    "tipoEventoRetencion" "TipoEventoRetencion" NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PROCESADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoCompra" (
    "id" TEXT NOT NULL,
    "pagoId" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "montoAplicado" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PagoCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetencionIVA" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "comprobanteIVAId" TEXT,
    "periodoFiscalId" TEXT NOT NULL,
    "estado" "EstadoRetencion" NOT NULL DEFAULT 'CALCULADA',
    "porcentajeRetencionSnapshot" DECIMAL(5,2) NOT NULL,
    "montoBaseSnapshot" DECIMAL(18,2) NOT NULL,
    "impuestoIVASnapshot" DECIMAL(18,2) NOT NULL,
    "montoRetenido" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetencionIVA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprobanteIVA" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "numeroComprobante" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComprobanteIVA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetencionISLR" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "pagoId" TEXT NOT NULL,
    "comprobanteISLRId" TEXT,
    "periodoFiscalId" TEXT NOT NULL,
    "estado" "EstadoRetencion" NOT NULL DEFAULT 'CALCULADA',
    "valorUTSnapshot" DECIMAL(18,2) NOT NULL,
    "codigoConceptoSnapshot" TEXT NOT NULL,
    "descripcionConceptoSnapshot" TEXT NOT NULL,
    "porcentajeBaseSnapshot" DECIMAL(8,4) NOT NULL,
    "tarifaAplicadaSnapshot" DECIMAL(8,4) NOT NULL,
    "sustraendoSnapshot" DECIMAL(18,2) NOT NULL,
    "montoRetenido" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetencionISLR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprobanteISLR" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "numeroComprobante" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComprobanteISLR_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExportacionFiscal" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodoFiscalId" TEXT NOT NULL,
    "tipo" "TipoExportacionFiscal" NOT NULL,
    "estado" "EstadoExportacionFiscal" NOT NULL DEFAULT 'GENERADA',
    "urlStorage" TEXT,
    "hashArchivo" TEXT,
    "usuarioId" TEXT NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidadRegistros" INTEGER NOT NULL DEFAULT 0,
    "montoTotal" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExportacionFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAuditoria" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "accion" "TipoAccionAuditoria" NOT NULL,
    "entidadNombre" TEXT NOT NULL,
    "entidadId" TEXT NOT NULL,
    "datosPrevios" JSONB,
    "datosNuevos" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAuditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizacion_rif_key" ON "Organizacion"("rif");

-- CreateIndex
CREATE INDEX "Organizacion_deletedAt_idx" ON "Organizacion"("deletedAt");

-- CreateIndex
CREATE INDEX "Usuario_tenantId_idx" ON "Usuario"("tenantId");

-- CreateIndex
CREATE INDEX "Usuario_deletedAt_idx" ON "Usuario"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_tenantId_email_key" ON "Usuario"("tenantId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE INDEX "AsignacionRol_empresaId_idx" ON "AsignacionRol"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "AsignacionRol_usuarioId_rolId_empresaId_key" ON "AsignacionRol"("usuarioId", "rolId", "empresaId");

-- CreateIndex
CREATE INDEX "Membresia_tenantId_activa_idx" ON "Membresia"("tenantId", "activa");

-- CreateIndex
CREATE INDEX "Empresa_tenantId_idx" ON "Empresa"("tenantId");

-- CreateIndex
CREATE INDEX "Empresa_deletedAt_idx" ON "Empresa"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_tenantId_rif_key" ON "Empresa"("tenantId", "rif");

-- CreateIndex
CREATE INDEX "Proveedor_tenantId_idx" ON "Proveedor"("tenantId");

-- CreateIndex
CREATE INDEX "Proveedor_empresaId_idx" ON "Proveedor"("empresaId");

-- CreateIndex
CREATE INDEX "Proveedor_deletedAt_idx" ON "Proveedor"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_empresaId_rif_key" ON "Proveedor"("empresaId", "rif");

-- CreateIndex
CREATE INDEX "PeriodoFiscal_tenantId_idx" ON "PeriodoFiscal"("tenantId");

-- CreateIndex
CREATE INDEX "PeriodoFiscal_empresaId_anio_mes_idx" ON "PeriodoFiscal"("empresaId", "anio", "mes");

-- CreateIndex
CREATE INDEX "PeriodoFiscal_estado_idx" ON "PeriodoFiscal"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodoFiscal_empresaId_tipoImpuesto_codigoPeriodo_key" ON "PeriodoFiscal"("empresaId", "tipoImpuesto", "codigoPeriodo");

-- CreateIndex
CREATE INDEX "UnidadTributaria_fechaDesde_fechaHasta_idx" ON "UnidadTributaria"("fechaDesde", "fechaHasta");

-- CreateIndex
CREATE INDEX "AlicuotaIVA_activa_idx" ON "AlicuotaIVA"("activa");

-- CreateIndex
CREATE INDEX "AlicuotaIVA_fechaDesde_fechaHasta_idx" ON "AlicuotaIVA"("fechaDesde", "fechaHasta");

-- CreateIndex
CREATE UNIQUE INDEX "ConceptoISLR_codigoSENIAT_key" ON "ConceptoISLR"("codigoSENIAT");

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_codigo_key" ON "TipoDocumento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarioFiscal_anio_ultimoDigitoRif_key" ON "CalendarioFiscal"("anio", "ultimoDigitoRif");

-- CreateIndex
CREATE UNIQUE INDEX "ParametroFiscal_empresaId_key" ON "ParametroFiscal"("empresaId");

-- CreateIndex
CREATE INDEX "SaldoCompensacionIVA_tenantId_idx" ON "SaldoCompensacionIVA"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SaldoCompensacionIVA_empresaId_periodoFiscalId_key" ON "SaldoCompensacionIVA"("empresaId", "periodoFiscalId");

-- CreateIndex
CREATE INDEX "Compra_tenantId_idx" ON "Compra"("tenantId");

-- CreateIndex
CREATE INDEX "Compra_empresaId_fechaFactura_idx" ON "Compra"("empresaId", "fechaFactura");

-- CreateIndex
CREATE INDEX "Compra_proveedorId_idx" ON "Compra"("proveedorId");

-- CreateIndex
CREATE INDEX "Compra_periodoFiscalId_idx" ON "Compra"("periodoFiscalId");

-- CreateIndex
CREATE INDEX "Compra_documentoAfectadoId_idx" ON "Compra"("documentoAfectadoId");

-- CreateIndex
CREATE INDEX "Pago_tenantId_idx" ON "Pago"("tenantId");

-- CreateIndex
CREATE INDEX "Pago_empresaId_fechaPago_idx" ON "Pago"("empresaId", "fechaPago");

-- CreateIndex
CREATE INDEX "Pago_proveedorId_idx" ON "Pago"("proveedorId");

-- CreateIndex
CREATE INDEX "Pago_periodoFiscalId_idx" ON "Pago"("periodoFiscalId");

-- CreateIndex
CREATE INDEX "Pago_conceptoISLRId_idx" ON "Pago"("conceptoISLRId");

-- CreateIndex
CREATE INDEX "PagoCompra_compraId_idx" ON "PagoCompra"("compraId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoCompra_pagoId_compraId_key" ON "PagoCompra"("pagoId", "compraId");

-- CreateIndex
CREATE INDEX "RetencionIVA_tenantId_idx" ON "RetencionIVA"("tenantId");

-- CreateIndex
CREATE INDEX "RetencionIVA_comprobanteIVAId_idx" ON "RetencionIVA"("comprobanteIVAId");

-- CreateIndex
CREATE INDEX "RetencionIVA_periodoFiscalId_idx" ON "RetencionIVA"("periodoFiscalId");

-- CreateIndex
CREATE UNIQUE INDEX "RetencionIVA_compraId_key" ON "RetencionIVA"("compraId");

-- CreateIndex
CREATE INDEX "ComprobanteIVA_tenantId_idx" ON "ComprobanteIVA"("tenantId");

-- CreateIndex
CREATE INDEX "ComprobanteIVA_proveedorId_idx" ON "ComprobanteIVA"("proveedorId");

-- CreateIndex
CREATE INDEX "ComprobanteIVA_fechaEmision_idx" ON "ComprobanteIVA"("fechaEmision");

-- CreateIndex
CREATE UNIQUE INDEX "ComprobanteIVA_empresaId_numeroComprobante_key" ON "ComprobanteIVA"("empresaId", "numeroComprobante");

-- CreateIndex
CREATE INDEX "RetencionISLR_tenantId_idx" ON "RetencionISLR"("tenantId");

-- CreateIndex
CREATE INDEX "RetencionISLR_pagoId_idx" ON "RetencionISLR"("pagoId");

-- CreateIndex
CREATE INDEX "RetencionISLR_comprobanteISLRId_idx" ON "RetencionISLR"("comprobanteISLRId");

-- CreateIndex
CREATE INDEX "RetencionISLR_periodoFiscalId_idx" ON "RetencionISLR"("periodoFiscalId");

-- CreateIndex
CREATE INDEX "ComprobanteISLR_tenantId_idx" ON "ComprobanteISLR"("tenantId");

-- CreateIndex
CREATE INDEX "ComprobanteISLR_fechaEmision_idx" ON "ComprobanteISLR"("fechaEmision");

-- CreateIndex
CREATE UNIQUE INDEX "ComprobanteISLR_empresaId_numeroComprobante_key" ON "ComprobanteISLR"("empresaId", "numeroComprobante");

-- CreateIndex
CREATE INDEX "ExportacionFiscal_tenantId_idx" ON "ExportacionFiscal"("tenantId");

-- CreateIndex
CREATE INDEX "ExportacionFiscal_empresaId_periodoFiscalId_idx" ON "ExportacionFiscal"("empresaId", "periodoFiscalId");

-- CreateIndex
CREATE INDEX "ExportacionFiscal_tipo_estado_idx" ON "ExportacionFiscal"("tipo", "estado");

-- CreateIndex
CREATE INDEX "LogAuditoria_tenantId_idx" ON "LogAuditoria"("tenantId");

-- CreateIndex
CREATE INDEX "LogAuditoria_usuarioId_timestamp_idx" ON "LogAuditoria"("usuarioId", "timestamp");

-- CreateIndex
CREATE INDEX "LogAuditoria_entidadNombre_entidadId_idx" ON "LogAuditoria"("entidadNombre", "entidadId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionRol" ADD CONSTRAINT "AsignacionRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionRol" ADD CONSTRAINT "AsignacionRol_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsignacionRol" ADD CONSTRAINT "AsignacionRol_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membresia" ADD CONSTRAINT "Membresia_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Organizacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedor" ADD CONSTRAINT "Proveedor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodoFiscal" ADD CONSTRAINT "PeriodoFiscal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroFiscal" ADD CONSTRAINT "ParametroFiscal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldoCompensacionIVA" ADD CONSTRAINT "SaldoCompensacionIVA_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldoCompensacionIVA" ADD CONSTRAINT "SaldoCompensacionIVA_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_documentoAfectadoId_fkey" FOREIGN KEY ("documentoAfectadoId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_conceptoISLRId_fkey" FOREIGN KEY ("conceptoISLRId") REFERENCES "ConceptoISLR"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoCompra" ADD CONSTRAINT "PagoCompra_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoCompra" ADD CONSTRAINT "PagoCompra_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetencionIVA" ADD CONSTRAINT "RetencionIVA_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetencionIVA" ADD CONSTRAINT "RetencionIVA_comprobanteIVAId_fkey" FOREIGN KEY ("comprobanteIVAId") REFERENCES "ComprobanteIVA"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetencionIVA" ADD CONSTRAINT "RetencionIVA_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteIVA" ADD CONSTRAINT "ComprobanteIVA_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteIVA" ADD CONSTRAINT "ComprobanteIVA_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetencionISLR" ADD CONSTRAINT "RetencionISLR_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetencionISLR" ADD CONSTRAINT "RetencionISLR_comprobanteISLRId_fkey" FOREIGN KEY ("comprobanteISLRId") REFERENCES "ComprobanteISLR"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetencionISLR" ADD CONSTRAINT "RetencionISLR_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteISLR" ADD CONSTRAINT "ComprobanteISLR_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportacionFiscal" ADD CONSTRAINT "ExportacionFiscal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportacionFiscal" ADD CONSTRAINT "ExportacionFiscal_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExportacionFiscal" ADD CONSTRAINT "ExportacionFiscal_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogAuditoria" ADD CONSTRAINT "LogAuditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
