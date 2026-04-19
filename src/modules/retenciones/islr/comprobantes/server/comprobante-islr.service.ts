import { prisma } from "@/lib/prisma";
import { 
  esRetencionISLRElegibleParaComprobante, 
  validarAgrupacionComprobanteISLR, 
  generarNumeroComprobanteISLR 
} from "./comprobante-islr.rules";

/**
 * Obtiene retenciones ISLR que están calculadas pero aún no tienen comprobante.
 */
export async function getRetencionesISLRElegibles(tenantId: string, empresaId?: string) {
  return await prisma.retencionISLR.findMany({
    where: {
      tenantId,
      comprobanteISLRId: null,
      estado: "CALCULADA",
      ...(empresaId ? { empresaId } : {}),
    },
    include: {
      pago: {
        include: {
          proveedor: { select: { id: true, nombre: true, rif: true } },
          conceptoISLR: { select: { codigoSeniat: true, concepto: true } },
        }
      },
      periodoFiscal: { select: { id: true, codigoPeriodo: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Emite un comprobante ISLR agrupando una o varias retenciones.
 */
export async function emitirComprobanteISLR(retencionIds: string[], tenantId: string) {
  if (!retencionIds || retencionIds.length === 0) {
    throw new Error("Debe seleccionar al menos una retención para emitir el comprobante.");
  }

  // 1. Cargar retenciones con relaciones críticas
  const retenciones = await prisma.retencionISLR.findMany({
    where: { id: { in: retencionIds }, tenantId },
    include: {
      pago: true,
      periodoFiscal: true,
    }
  });

  if (retenciones.length !== retencionIds.length) {
    throw new Error("Algunas retenciones seleccionadas no existen o no pertenecen a su organización.");
  }

  // 2. Validar elegibilidad individual
  for (const r of retenciones) {
    const check = esRetencionISLRElegibleParaComprobante(r, tenantId);
    if (!check.elegible) {
      throw new Error(`La retención seleccionada no es elegible: ${check.motivo}`);
    }
  }

  // 3. Validar agrupación (Misma empresa, mismo proveedor, mismo período)
  const checkAgrupacion = validarAgrupacionComprobanteISLR(retenciones);
  if (!checkAgrupacion.valido) {
    throw new Error(`Error de agrupación: ${checkAgrupacion.motivo}`);
  }

  const base = retenciones[0];
  const empresaId = base.pago.empresaId;
  const proveedorId = base.pago.proveedorId;
  const periodoFiscalId = base.periodoFiscalId;
  const montoTotal = retenciones.reduce((sum, r) => sum + Number(r.montoRetenido), 0);

  const fechaEmision = new Date();
  const anio = fechaEmision.getFullYear();
  const mes = fechaEmision.getMonth() + 1;

  // 4. Transacción atómica
  return await prisma.$transaction(async (tx) => {
    // 4.1. Obtener y actualizar correlativo
    const pf = await tx.parametroFiscal.update({
      where: { empresaId },
      data: { proximoCorrelativoISLR: { increment: 1 } }
    });

    const correlativo = pf.proximoCorrelativoISLR - 1;
    const numeroComprobante = generarNumeroComprobanteISLR(anio, mes, correlativo);

    // 4.2. Crear el Comprobante
    const comprobante = await tx.comprobanteISLR.create({
      data: {
        tenantId,
        empresaId,
        proveedorId,
        periodoFiscalId,
        numeroComprobante,
        fechaEmision,
        montoTotalRetenido: montoTotal,
      }
    });

    // 4.3. Vincular retenciones y cambiar su estado
    await tx.retencionISLR.updateMany({
      where: { id: { in: retencionIds } },
      data: {
        comprobanteISLRId: comprobante.id,
        estado: "CONFIRMADA"
      }
    });

    return comprobante;
  });
}

/**
 * Lista comprobantes ISLR por tenant y opcionalmente por empresa.
 */
export async function getComprobantesISLRByTenant(tenantId: string, empresaId?: string) {
  const comprobantes = await prisma.comprobanteISLR.findMany({
    where: {
      tenantId,
      ...(empresaId ? { empresaId } : {}),
    },
    include: {
      proveedor: { select: { nombre: true, rif: true } },
      empresa: { select: { nombreFiscal: true } },
      periodoFiscal: { select: { codigoPeriodo: true } },
      _count: { select: { retencionesISLR: true } }
    },
    orderBy: { fechaEmision: "desc" }
  });

  return comprobantes.map(c => ({
    ...c,
    montoTotalRetenido: Number(c.montoTotalRetenido)
  }));
}

/**
 * Obtiene el detalle de un comprobante ISLR específico.
 */
export async function getComprobanteISLRById(id: string, tenantId: string) {
  const comprobante = await prisma.comprobanteISLR.findFirst({
    where: { id, tenantId },
    include: {
      empresa: true,
      proveedor: true,
      periodoFiscal: true,
      retencionesISLR: {
        include: {
          pago: {
            include: {
              pagoCompras: {
                include: {
                  compra: { include: { tipoDocumento: true } }
                }
              }
            }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!comprobante) return null;

  return {
    ...comprobante,
    montoTotalRetenido: Number(comprobante.montoTotalRetenido),
    retencionesISLR: comprobante.retencionesISLR.map(r => ({
      ...r,
      montoRetenido: Number(r.montoRetenido),
      baseCalculoSnapshot: Number(r.baseCalculoSnapshot),
      tarifaAplicadaSnapshot: Number(r.tarifaAplicadaSnapshot),
      sustraendoSnapshot: Number(r.sustraendoSnapshot),
    }))
  };
}
