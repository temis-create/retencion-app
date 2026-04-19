import { prisma } from "@/lib/prisma";
import { PagoFormValues } from "./pago.schema";
import { requirePeriodoAbierto } from "@/modules/fiscal/periodos/server/periodo-fiscal.service";

export async function getPagosByTenant(tenantId: string, empresaId?: string) {
  const pagos = await prisma.pago.findMany({
    where: {
      tenantId,
      ...(empresaId ? { empresaId } : {}),
    },
    include: {
      proveedor: {
        select: { nombre: true, rif: true }
      },
      empresa: {
        select: { nombreFiscal: true }
      },
      _count: {
        select: { pagoCompras: true }
      }
    },
    orderBy: { fechaPago: "desc" }
  });

  return pagos.map(p => ({
    ...p,
    montoTotal: Number(p.montoTotal)
  }));
}

export async function getPagoById(id: string, tenantId: string) {
  const pago = await prisma.pago.findFirst({
    where: { id, tenantId },
    include: {
      proveedor: true,
      empresa: true,
      conceptoISLR: true,
      periodoFiscal: true,
      pagoCompras: {
        include: {
          compra: {
            include: { tipoDocumento: true }
          }
        }
      }
    }
  });

  if (!pago) return null;

  // Sanitizar decimales
  return {
    ...pago,
    montoTotal: Number(pago.montoTotal),
    conceptoISLR: {
      ...pago.conceptoISLR,
      baseImponiblePorcentaje: Number(pago.conceptoISLR.baseImponiblePorcentaje),
      porcentajeRetencion: pago.conceptoISLR.porcentajeRetencion ? Number(pago.conceptoISLR.porcentajeRetencion) : null,
      montoMinimoBs: Number(pago.conceptoISLR.montoMinimoBs),
      sustraendoBs: Number(pago.conceptoISLR.sustraendoBs),
    },
    pagoCompras: pago.pagoCompras.map(pc => ({
      ...pc,
      montoAplicado: Number(pc.montoAplicado),
      compra: {
        ...pc.compra,
        montoExento: Number(pc.compra.montoExento),
        montoBase: Number(pc.compra.montoBase),
        impuestoIVA: Number(pc.compra.impuestoIVA),
        totalFactura: Number(pc.compra.totalFactura),
        porcentajeAlicuotaSnapshot: pc.compra.porcentajeAlicuotaSnapshot ? Number(pc.compra.porcentajeAlicuotaSnapshot) : null,
        valorUTSnapshot: pc.compra.valorUTSnapshot ? Number(pc.compra.valorUTSnapshot) : null,
        montoOperacionUTSnapshot: pc.compra.montoOperacionUTSnapshot ? Number(pc.compra.montoOperacionUTSnapshot) : null,
      }
    }))
  };
}

/**
 * Obtiene compras con saldo pendiente para un proveedor específico
 */
export async function getComprasPendientes(empresaId: string, proveedorId: string) {
  // 1. Obtener todas las compras de la empresa/proveedor
  const compras = await prisma.compra.findMany({
    where: {
      empresaId,
      proveedorId,
      estado: "REGISTRADA",
    },
    include: {
      tipoDocumento: true,
      pagoCompras: {
        select: { montoAplicado: true }
      }
    },
    orderBy: { fechaFactura: "asc" }
  });

  // 2. Calcular saldo y sanitizar decimales
  const comprasConSaldo = compras.map(c => {
    const pagado = c.pagoCompras.reduce((sum, p) => sum + Number(p.montoAplicado), 0);
    const total = Number(c.totalFactura);
    const saldo = total - pagado;
    
    return { 
      ...c, 
      totalFactura: total,
      montoExento: Number(c.montoExento),
      montoBase: Number(c.montoBase),
      impuestoIVA: Number(c.impuestoIVA),
      porcentajeAlicuotaSnapshot: c.porcentajeAlicuotaSnapshot ? Number(c.porcentajeAlicuotaSnapshot) : null,
      valorUTSnapshot: c.valorUTSnapshot ? Number(c.valorUTSnapshot) : null,
      montoOperacionUTSnapshot: c.montoOperacionUTSnapshot ? Number(c.montoOperacionUTSnapshot) : null,
      saldo 
    };
  });

  // 3. Filtrar las que tienen saldo > 0.01 (evitar redondeos)
  return comprasConSaldo.filter(c => c.saldo > 0.01);
}

export async function createPago(data: PagoFormValues, tenantId: string) {
  // 1. Validar período fiscal ISLR
  const periodo = await requirePeriodoAbierto(
    data.empresaId, 
    "ISLR", 
    new Date(data.fechaPago)
  );

  // 2. Transacción para asegurar integridad de aplicaciones
  return await prisma.$transaction(async (tx) => {
    // A. Crear el Pago
    const nuevoPago = await tx.pago.create({
      data: {
        tenantId,
        empresaId: data.empresaId,
        proveedorId: data.proveedorId,
        periodoFiscalId: periodo.id,
        conceptoISLRId: Number(data.conceptoISLRId),
        fechaPago: new Date(data.fechaPago),
        montoTotal: data.montoTotal,
        referencia: data.referencia,
        tipoEventoRetencion: data.tipoEventoRetencion,
      }
    });

    // B. Crear las aplicaciones (PagoCompra)
    for (const app of data.aplicaciones) {
      // Validar saldo de la compra ANTES de aplicar
      const compra = await tx.compra.findUnique({
        where: { id: app.compraId },
        include: { 
          pagoCompras: { select: { montoAplicado: true } } 
        }
      });

      if (!compra) throw new Error(`El documento de compra con ID ${app.compraId} ya no está disponible.`);
      
      const abonado = compra.pagoCompras.reduce((sum, p) => sum + Number(p.montoAplicado), 0);
      const saldoActual = Number(compra.totalFactura) - abonado;

      if (app.montoAplicado > saldoActual + 0.01) {
        throw new Error(`El monto que intentas aplicar (Bs. ${app.montoAplicado}) supera el saldo pendiente de la factura ${compra.numeroFactura} (Bs. ${saldoActual.toFixed(2)}).`);
      }

      await tx.pagoCompra.create({
        data: {
          pagoId: nuevoPago.id,
          compraId: app.compraId,
          montoAplicado: app.montoAplicado,
        }
      });
    }

    return nuevoPago;
  });
}

export async function getConceptosISLR() {
  const conceptos = await prisma.conceptoRetencionISLR.findMany({
    orderBy: { numeral: "asc" }
  });

  // Convertir Decimales a Numbers para evitar errores de Client Components
  return conceptos.map(c => ({
    ...c,
    baseImponiblePorcentaje: Number(c.baseImponiblePorcentaje),
    porcentajeRetencion: c.porcentajeRetencion ? Number(c.porcentajeRetencion) : null,
    montoMinimoBs: Number(c.montoMinimoBs),
    sustraendoBs: Number(c.sustraendoBs),
  }));
}
