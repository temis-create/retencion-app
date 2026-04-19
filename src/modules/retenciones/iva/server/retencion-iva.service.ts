/**
 * Servicio de Retención IVA — Integrado con Motor de Reglas v2.0
 *
 * Este servicio:
 * 1. Carga la compra con contexto completo
 * 2. Construye el ContextoMotorRetencionIVA enriquecido
 * 3. Ejecuta el motor de reglas
 * 4. Persiste el resultado en la tabla RetencionIVA
 *
 * Los datos de metadataFiscal se construyen con valores por defecto
 * conservadores donde el schema aún no tiene los campos correspondientes.
 * Esto se documenta en el gap analysis del artefacto de implementación.
 */

import { prisma } from "@/lib/prisma";
import {
  ejecutarMotorRetencionIVA,
  ContextoMotorRetencionIVA,
  MetadataFiscal,
  ResultadoMotorRetencionIVA,
} from "../engine";

// ─── Consulta de retención existente ─────────────────────────────────────────

export async function getRetencionIVAByCompraId(compraId: string, tenantId: string) {
  return await prisma.retencionIVA.findFirst({
    where: { compraId, tenantId },
  });
}

export async function getRetencionesIVA(tenantId: string) {
  return await prisma.retencionIVA.findMany({
    where: { tenantId },
    include: {
      compra: {
        include: {
          proveedor: true,
          periodoFiscal: true,
          tipoDocumento: true,
        }
      },
      comprobanteIVA: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ─── Cálculo y persistencia ──────────────────────────────────────────────────

export async function calcularYGuardarRetencionIVA(
  compraId: string,
  tenantId: string
): Promise<{
  aplica: boolean;
  resultado: ResultadoMotorRetencionIVA;
  retencion?: any;
}> {
  // 1. Cargar compra con todo el contexto
  const compra = await prisma.compra.findFirst({
    where: { id: compraId, tenantId },
    include: {
      empresa: true,
      proveedor: true,
      periodoFiscal: true,
      tipoDocumento: true,
      retencionIVA: true,
    },
  });

  if (!compra) {
    throw new Error("Compra no encontrada o no pertenece al tenant.");
  }

  // 2. Bloquear si ya tiene comprobante
  if (compra.retencionIVA && compra.retencionIVA.comprobanteIVAId) {
    throw new Error(
      "La retención ya está asociada a un Comprobante de IVA y no puede recalcularse."
    );
  }

  // 3. Obtener valor de Unidad Tributaria vigente (si existe)
  const ut = await prisma.unidadTributaria.findFirst({
    where: {
      fechaDesde: { lte: compra.fechaFactura },
      OR: [
        { fechaHasta: { gte: compra.fechaFactura } },
        { fechaHasta: null },
      ],
    },
    orderBy: { fechaDesde: "desc" },
  });

  const valorUT = ut ? ut.valor.toNumber() : null;
  const totalFactura = compra.totalFactura.toNumber();
  const montoEnUT = valorUT && valorUT > 0 ? totalFactura / valorUT : null;

  // 4. Construir metadata fiscal desde los campos reales del schema
  const metadataFiscal: MetadataFiscal = {
    // Naturaleza IVA — lectura directa del campo extendido
    operacionNoSujeta: compra.naturalezaIVA === "NO_SUJETA",
    operacionExenta: compra.naturalezaIVA === "EXENTA",
    operacionExonerada: compra.naturalezaIVA === "EXONERADA",

    // Clasificadores operativos de la compra
    esViatico: compra.esViatico,
    esGastoReembolsable: compra.esGastoReembolsable,
    esServicioPublicoDomiciliario: compra.esServicioPublicoDomiciliario,
    esOperacionArticulo2RetencionTotal: compra.esOperacionArticulo2RetencionTotal,
    tienePercepcionAnticipadaIVA: compra.tienePercepcionAnticipadaIVA,

    // Formalidad documental
    ivaDiscriminado: compra.ivaDiscriminado,
    cumpleRequisitosFormales: compra.cumpleRequisitosFormales,

    // Campos del proveedor extendidos
    esAgentePercepcionIVA: compra.proveedor.esAgentePercepcionIVA,
    rubroPercepcion: compra.proveedor.rubroPercepcionIVA ?? null,
    rifRegistrado: compra.proveedor.rifRegistrado,
    proveedorMarcadoRetencion100: compra.proveedor.proveedorMarcadoRetencion100,

    // Unidad Tributaria
    unidadTributariaValor: valorUT,
    montoOperacionUT: montoEnUT ? Number(montoEnUT.toFixed(4)) : null,
  };

  // 5. Construir contexto del motor
  const ctx: ContextoMotorRetencionIVA = {
    compra: {
      id: compra.id,
      tenantId: compra.tenantId,
      empresaId: compra.empresaId,
      proveedorId: compra.proveedorId,
      periodoFiscalId: compra.periodoFiscalId,
      estado: compra.estado,
      impuestoIVA: compra.impuestoIVA.toNumber(),
      montoBase: compra.montoBase.toNumber(),
      montoExento: compra.montoExento.toNumber(),
      totalFactura: totalFactura,
    },
    empresa: {
      id: compra.empresa.id,
      tenantId: compra.empresa.tenantId,
      agenteRetencionIVA: compra.empresa.agenteRetencionIVA,
    },
    proveedor: {
      id: compra.proveedor.id,
      tipoContribuyente: compra.proveedor.tipoContribuyente,
      porcentajeRetencionIVA: compra.proveedor.porcentajeRetencionIVA.toNumber(),
      rif: compra.proveedor.rif,
    },
    periodoFiscal: {
      id: compra.periodoFiscal.id,
      estado: compra.periodoFiscal.estado,
      codigoPeriodo: compra.periodoFiscal.codigoPeriodo,
    },
    tipoDocumento: {
      id: compra.tipoDocumento.id,
      codigo: compra.tipoDocumento.codigo,
    },
    metadataFiscal,
  };

  // 6. Ejecutar motor
  const resultado = ejecutarMotorRetencionIVA(ctx);

  // 7. Persistir resultado
  if (!resultado.aplica) {
    // Si ya existía una retención calculada (sin comprobante), eliminarla
    if (compra.retencionIVA && !compra.retencionIVA.comprobanteIVAId) {
      await prisma.retencionIVA.delete({
        where: { id: compra.retencionIVA.id },
      });
    }
    return { aplica: false, resultado };
  }

  // Campos de auditoría comunes para create y update
  const auditFields = {
    aplicaRetencion: resultado.aplica,
    motivoCodigo: resultado.motivoCodigo,
    motivoDescripcion: resultado.motivoDescripcion,
    categoriaRegla: resultado.categoriaRegla as any,
    baseLegalNorma: resultado.baseLegal.norma,
    baseLegalArticulo: resultado.baseLegal.articulo,
    baseLegalDescripcion: resultado.baseLegal.descripcion,
    versionMotor: resultado.snapshotNormativo.versionMotor,
    valorUTSnapshot: resultado.snapshotNormativo.unidadTributariaValor,
    montoOperacionUTSnapshot: resultado.snapshotNormativo.montoOperacionUT,
  };

  const retencion = await prisma.retencionIVA.upsert({
    where: { compraId: compra.id },
    update: {
      porcentajeRetencionSnapshot: resultado.porcentajeRetencion,
      montoBaseSnapshot: compra.montoBase,
      impuestoIVASnapshot: resultado.impuestoIVA,
      montoRetenido: resultado.montoRetenido,
      estado: "CALCULADA",
      periodoFiscalId: compra.periodoFiscalId,
      ...auditFields,
    },
    create: {
      tenantId,
      compraId: compra.id,
      periodoFiscalId: compra.periodoFiscalId,
      estado: "CALCULADA",
      porcentajeRetencionSnapshot: resultado.porcentajeRetencion,
      montoBaseSnapshot: compra.montoBase,
      impuestoIVASnapshot: resultado.impuestoIVA,
      montoRetenido: resultado.montoRetenido,
      ...auditFields,
    },
  });

  return { aplica: true, resultado, retencion };
}
