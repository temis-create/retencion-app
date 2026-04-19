import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CompraFormValues } from "./compra.schema";
import { requirePeriodoAbierto } from "@/modules/fiscal/periodos/server/periodo-fiscal.service";

// ─── Tipos de include reutilizables ──────────────────────────────────────────

const compraInclude = {
  empresa: { select: { id: true, nombreFiscal: true } },
  proveedor: { select: { id: true, nombre: true, rif: true } },
  tipoDocumento: { select: { id: true, codigo: true, descripcion: true } },
  periodoFiscal: {
    select: {
      id: true,
      codigoPeriodo: true,
      anio: true,
      mes: true,
      estado: true,
    },
  },
  documentoAfectado: {
    select: {
      id: true,
      numeroFactura: true,
      tipoDocumento: { select: { codigo: true, descripcion: true } },
    },
  },
  retencionIVA: {
    include: {
      comprobanteIVA: { select: { id: true, numeroComprobante: true } }
    }
  },
  pagoCompras: {
    include: {
      pago: {
        select: {
          id: true,
          fechaPago: true,
          referencia: true,
          tipoEventoRetencion: true
        }
      }
    }
  }
} satisfies Prisma.CompraInclude;

// ─── Listado ──────────────────────────────────────────────────────────────────

export async function getComprasByTenant(
  tenantId: string,
  filters?: {
    empresaId?: string;
    proveedorId?: string;
    periodoFiscalId?: string;
    estado?: string;
  }
) {
  const compras = await prisma.compra.findMany({
    where: {
      tenantId,
      ...(filters?.empresaId ? { empresaId: filters.empresaId } : {}),
      ...(filters?.proveedorId ? { proveedorId: filters.proveedorId } : {}),
      ...(filters?.periodoFiscalId
        ? { periodoFiscalId: filters.periodoFiscalId }
        : {}),
      ...(filters?.estado ? { estado: filters.estado as any } : {}),
    },
    include: compraInclude,
    orderBy: [{ fechaFactura: "desc" }, { createdAt: "desc" }],
  });

  return compras.map(sanitizeCompra);
}

// ─── Detalle ─────────────────────────────────────────────────────────────────

export async function getCompraById(id: string, tenantId: string) {
  const compra = await prisma.compra.findFirst({
    where: { id, tenantId },
    include: compraInclude,
  });

  if (!compra) return null;
  return sanitizeCompra(compra);
}

function sanitizeCompra(compra: any) {
  return {
    ...compra,
    montoExento: Number(compra.montoExento),
    montoBase: Number(compra.montoBase),
    impuestoIVA: Number(compra.impuestoIVA),
    totalFactura: Number(compra.totalFactura),
    porcentajeAlicuotaSnapshot: compra.porcentajeAlicuotaSnapshot ? Number(compra.porcentajeAlicuotaSnapshot) : null,
    valorUTSnapshot: compra.valorUTSnapshot ? Number(compra.valorUTSnapshot) : null,
    montoOperacionUTSnapshot: compra.montoOperacionUTSnapshot ? Number(compra.montoOperacionUTSnapshot) : null,
    retencionIVA: compra.retencionIVA ? {
      ...compra.retencionIVA,
      porcentajeRetencionSnapshot: Number(compra.retencionIVA.porcentajeRetencionSnapshot),
      montoBaseSnapshot: Number(compra.retencionIVA.montoBaseSnapshot),
      impuestoIVASnapshot: Number(compra.retencionIVA.impuestoIVASnapshot),
      montoRetenido: Number(compra.retencionIVA.montoRetenido),
      valorUTSnapshot: compra.retencionIVA.valorUTSnapshot ? Number(compra.retencionIVA.valorUTSnapshot) : null,
      montoOperacionUTSnapshot: compra.retencionIVA.montoOperacionUTSnapshot ? Number(compra.retencionIVA.montoOperacionUTSnapshot) : null,
    } : null,
    pagoCompras: (compra.pagoCompras || []).map((pc: any) => ({
      ...pc,
      montoAplicado: Number(pc.montoAplicado),
      pago: pc.pago ? {
        ...pc.pago,
        // No hay decimales directos en el include del pago aquí según compraInclude
      } : null
    }))
  };
}

// ─── Creación ─────────────────────────────────────────────────────────────────

export async function createCompra(data: CompraFormValues, tenantId: string) {
  // 1. Validar empresa del tenant
  const empresa = await prisma.empresa.findFirst({
    where: { id: data.empresaId, tenantId, deletedAt: null },
  });
  if (!empresa) {
    throw new Error(
      "La empresa seleccionada no existe o no pertenece a tu organización."
    );
  }

  // 2. Validar proveedor del tenant y empresa
  const proveedor = await prisma.proveedor.findFirst({
    where: {
      id: data.proveedorId,
      tenantId,
      empresaId: data.empresaId,
      deletedAt: null,
    },
  });
  if (!proveedor) {
    throw new Error(
      "El proveedor seleccionado no existe, no pertenece a tu organización o no está asignado a esta empresa."
    );
  }

  // 3. Validar tipo de documento
  const tipoDocumento = await prisma.tipoDocumento.findFirst({
    where: { id: data.tipoDocumentoId },
  });
  if (!tipoDocumento) {
    throw new Error("El tipo de documento seleccionado no existe.");
  }

  // 4. Validar documento afectado si es NC/ND
  const esAjuste = ["NC", "ND"].includes(tipoDocumento.codigo);
  if (esAjuste) {
    if (!data.documentoAfectadoId) {
      throw new Error(
        "Las notas de crédito/débito requieren un documento afectado."
      );
    }
    const docAfectado = await prisma.compra.findFirst({
      where: {
        id: data.documentoAfectadoId,
        tenantId,
        empresaId: data.empresaId,
        proveedorId: data.proveedorId,
      },
    });
    if (!docAfectado) {
      throw new Error(
        "El documento afectado no existe, no pertenece a esta empresa o no corresponde al mismo proveedor."
      );
    }
  }

  // 5. Requerir período fiscal abierto de IVA (regla central)
  const fechaFactura = new Date(data.fechaFactura);
  const periodo = await requirePeriodoAbierto(
    data.empresaId,
    "IVA",
    fechaFactura
  );

  // 6. Resolver UT vigente para snapshot
  const ut = await prisma.unidadTributaria.findFirst({
    where: {
      fechaDesde: { lte: fechaFactura },
      OR: [
        { fechaHasta: { gte: fechaFactura } },
        { fechaHasta: null },
      ],
    },
    orderBy: { fechaDesde: "desc" },
  });
  const valorUT = ut ? ut.valor.toNumber() : null;
  const totalNum = Number(data.totalFactura);
  const montoEnUT = valorUT && valorUT > 0 ? Number((totalNum / valorUT).toFixed(4)) : null;

  // 7. Crear compra
  const nuevaCompra = await prisma.compra.create({
    data: {
      tenantId,
      empresaId: data.empresaId,
      proveedorId: data.proveedorId,
      tipoDocumentoId: data.tipoDocumentoId,
      periodoFiscalId: periodo.id,
      documentoAfectadoId: data.documentoAfectadoId ?? null,
      numeroFactura: data.numeroFactura,
      numeroControl: data.numeroControl ?? null,
      fechaFactura,
      porcentajeAlicuotaSnapshot: data.porcentajeAlicuotaSnapshot ?? null,
      montoExento: data.montoExento,
      montoBase: data.montoBase,
      impuestoIVA: data.impuestoIVA,
      totalFactura: data.totalFactura,
      tipoAjuste: data.tipoAjuste ?? null,
      motivoAjuste: data.motivoAjuste ?? null,
      estado: "REGISTRADA",
      // Campos fiscales IVA extendidos
      naturalezaIVA: data.naturalezaIVA ?? "GRAVADA",
      esViatico: data.esViatico ?? false,
      esGastoReembolsable: data.esGastoReembolsable ?? false,
      esServicioPublicoDomiciliario: data.esServicioPublicoDomiciliario ?? false,
      esOperacionArticulo2RetencionTotal: data.esOperacionArticulo2RetencionTotal ?? false,
      tienePercepcionAnticipadaIVA: data.tienePercepcionAnticipadaIVA ?? false,
      ivaDiscriminado: data.ivaDiscriminado ?? true,
      cumpleRequisitosFormales: data.cumpleRequisitosFormales ?? true,
      valorUTSnapshot: valorUT,
      montoOperacionUTSnapshot: montoEnUT,
    },
    include: compraInclude,
  });

  return sanitizeCompra(nuevaCompra);
}

// ─── Edición ─────────────────────────────────────────────────────────────────

export async function updateCompra(
  id: string,
  data: CompraFormValues,
  tenantId: string
) {
  // 1. Verificar que la compra pertenece al tenant
  const compraExistente = await prisma.compra.findFirst({
    where: { id, tenantId },
    include: {
      periodoFiscal: { select: { estado: true, codigoPeriodo: true } },
    },
  });
  if (!compraExistente) {
    throw new Error("Compra no encontrada o no autorizada.");
  }

  // 2. Bloquear si el período está cerrado
  if (compraExistente.periodoFiscal.estado === "CERRADO") {
    throw new Error(
      `No se puede editar esta compra porque el período fiscal "${compraExistente.periodoFiscal.codigoPeriodo}" está cerrado.`
    );
  }

  // 3. Validar empresa del tenant
  const empresa = await prisma.empresa.findFirst({
    where: { id: data.empresaId, tenantId, deletedAt: null },
  });
  if (!empresa) {
    throw new Error(
      "La empresa seleccionada no existe o no pertenece a tu organización."
    );
  }

  // 4. Validar proveedor del tenant y empresa
  const proveedor = await prisma.proveedor.findFirst({
    where: {
      id: data.proveedorId,
      tenantId,
      empresaId: data.empresaId,
      deletedAt: null,
    },
  });
  if (!proveedor) {
    throw new Error(
      "El proveedor seleccionado no existe o no está asignado a esta empresa."
    );
  }

  // 5. Validar tipo de documento
  const tipoDocumento = await prisma.tipoDocumento.findFirst({
    where: { id: data.tipoDocumentoId },
  });
  if (!tipoDocumento) {
    throw new Error("El tipo de documento seleccionado no existe.");
  }

  // 6. Validar documento afectado si es NC/ND
  const esAjuste = ["NC", "ND"].includes(tipoDocumento.codigo);
  if (esAjuste) {
    if (!data.documentoAfectadoId) {
      throw new Error(
        "Las notas de crédito/débito requieren un documento afectado."
      );
    }
    const docAfectado = await prisma.compra.findFirst({
      where: {
        id: data.documentoAfectadoId,
        tenantId,
        empresaId: data.empresaId,
        proveedorId: data.proveedorId,
        NOT: { id },
      },
    });
    if (!docAfectado) {
      throw new Error(
        "El documento afectado no existe, no pertenece a esta empresa o no corresponde al mismo proveedor."
      );
    }
  }

  // 7. Si la fecha cambia, revalidar período abierto
  const fechaFactura = new Date(data.fechaFactura);
  const periodo = await requirePeriodoAbierto(
    data.empresaId,
    "IVA",
    fechaFactura
  );

  // 8. Resolver UT vigente para snapshot
  const ut = await prisma.unidadTributaria.findFirst({
    where: {
      fechaDesde: { lte: fechaFactura },
      OR: [
        { fechaHasta: { gte: fechaFactura } },
        { fechaHasta: null },
      ],
    },
    orderBy: { fechaDesde: "desc" },
  });
  const valorUT = ut ? ut.valor.toNumber() : null;
  const totalNum = Number(data.totalFactura);
  const montoEnUT = valorUT && valorUT > 0 ? Number((totalNum / valorUT).toFixed(4)) : null;

  const compraActualizada = await prisma.compra.update({
    where: { id },
    data: {
      empresaId: data.empresaId,
      proveedorId: data.proveedorId,
      tipoDocumentoId: data.tipoDocumentoId,
      periodoFiscalId: periodo.id,
      documentoAfectadoId: data.documentoAfectadoId ?? null,
      numeroFactura: data.numeroFactura,
      numeroControl: data.numeroControl ?? null,
      fechaFactura,
      porcentajeAlicuotaSnapshot: data.porcentajeAlicuotaSnapshot ?? null,
      montoExento: data.montoExento,
      montoBase: data.montoBase,
      impuestoIVA: data.impuestoIVA,
      totalFactura: data.totalFactura,
      tipoAjuste: data.tipoAjuste ?? null,
      motivoAjuste: data.motivoAjuste ?? null,
      // Campos fiscales IVA extendidos
      naturalezaIVA: data.naturalezaIVA ?? "GRAVADA",
      esViatico: data.esViatico ?? false,
      esGastoReembolsable: data.esGastoReembolsable ?? false,
      esServicioPublicoDomiciliario: data.esServicioPublicoDomiciliario ?? false,
      esOperacionArticulo2RetencionTotal: data.esOperacionArticulo2RetencionTotal ?? false,
      tienePercepcionAnticipadaIVA: data.tienePercepcionAnticipadaIVA ?? false,
      ivaDiscriminado: data.ivaDiscriminado ?? true,
      cumpleRequisitosFormales: data.cumpleRequisitosFormales ?? true,
      valorUTSnapshot: valorUT,
      montoOperacionUTSnapshot: montoEnUT,
    },
    include: compraInclude,
  });

  return sanitizeCompra(compraActualizada);
}
