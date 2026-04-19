import { prisma } from "@/lib/prisma";
import {
  esRetencionIVAElegibleParaComprobante,
  validarAgrupacionComprobanteIVA,
  generarNumeroComprobanteIVA,
} from "./comprobante-iva.rules";

export async function getRetencionesIVAElegibles(
  tenantId: string,
  empresaId?: string
) {
  return await prisma.retencionIVA.findMany({
    where: {
      tenantId,
      comprobanteIVAId: null,
      estado: "CALCULADA",
      ...(empresaId ? { compra: { empresaId } } : {}),
      compra: {
        estado: "REGISTRADA",
      },
    },
    include: {
      compra: {
        include: {
          proveedor: { select: { id: true, nombre: true, rif: true } },
          empresa: { select: { id: true, nombreFiscal: true } },
          tipoDocumento: { select: { codigo: true } },
        },
      },
      periodoFiscal: {
        select: { id: true, codigoPeriodo: true, anio: true, mes: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function emitirComprobanteIVA(
  retencionIds: string[],
  tenantId: string
) {
  if (!retencionIds || retencionIds.length === 0) {
    throw new Error("Debe seleccionar al menos una retención.");
  }

  // 1. Cargar retenciones
  const retenciones = await prisma.retencionIVA.findMany({
    where: { id: { in: retencionIds }, tenantId },
    include: {
      compra: true,
      periodoFiscal: true,
    },
  });

  if (retenciones.length !== retencionIds.length) {
    throw new Error(
      "Algunas retenciones no existen o no pertenecen a tu organización."
    );
  }

  // 2. Validar elegibilidad
  for (const r of retenciones) {
    const check = esRetencionIVAElegibleParaComprobante(r, tenantId);
    if (!check.elegible) {
      throw new Error(
        `La retención de la compra N° ${r.compra.numeroFactura} no es elegible: ${check.motivo}`
      );
    }
  }

  // 3. Validar agrupación
  const checkAgrupacion = validarAgrupacionComprobanteIVA(retenciones);
  if (!checkAgrupacion.valido) {
    throw new Error(`Error de agrupación: ${checkAgrupacion.motivo}`);
  }

  const base = retenciones[0];
  const empresaId = base.compra.empresaId;
  const proveedorId = base.compra.proveedorId;

  // Fecha y componentes para el comprobante
  const fechaEmision = new Date();
  const anioEmision = fechaEmision.getFullYear();
  const mesEmision = fechaEmision.getMonth() + 1;

  // 4. Transacción
  return await prisma.$transaction(async (tx) => {
    // 4.1. Verificar Configuración (ParametroFiscal)
    const pfCheck = await tx.parametroFiscal.findUnique({
      where: { empresaId },
    });
    if (!pfCheck) {
      throw new Error(
        "Configuración fiscal ausente para la empresa seleccionada. Asegúrese de inicializar o tener un ParametroFiscal válido."
      );
    }

    // 4.2. Incrementar Correlativo de forma Atómica
    const pFiscalActualizado = await tx.parametroFiscal.update({
      where: { empresaId },
      data: { proximoCorrelativoIVA: { increment: 1 } },
    });

    const correlativo = pFiscalActualizado.proximoCorrelativoIVA - 1;

    // 4.3. Generar Código String
    const numeroComprobante = generarNumeroComprobanteIVA(
      anioEmision,
      mesEmision,
      correlativo
    );

    // 4.4. Crear Comprobante IVA
    const comprobante = await tx.comprobanteIVA.create({
      data: {
        tenantId,
        empresaId,
        proveedorId,
        numeroComprobante,
        fechaEmision,
      },
    });

    // 4.5. Vincular y confirmar las retenciones
    await tx.retencionIVA.updateMany({
      where: { id: { in: retencionIds } },
      data: {
        comprobanteIVAId: comprobante.id,
        estado: "CONFIRMADA",
      },
    });

    return comprobante;
  });
}

export async function getComprobantesIVAByTenant(
  tenantId: string,
  empresaId?: string
) {
  return await prisma.comprobanteIVA.findMany({
    where: {
      tenantId,
      ...(empresaId ? { empresaId } : {}),
    },
    include: {
      empresa: { select: { id: true, nombreFiscal: true } },
      proveedor: { select: { id: true, nombre: true, rif: true } },
      _count: {
        select: { retencionesIVA: true },
      },
    },
    orderBy: { fechaEmision: "desc" },
  });
}

export async function getComprobanteIVAById(id: string, tenantId: string) {
  return await prisma.comprobanteIVA.findFirst({
    where: { id, tenantId },
    include: {
      empresa: { select: { id: true, nombreFiscal: true, rif: true, direccion: true } },
      proveedor: {
        select: { id: true, nombre: true, rif: true, tipoResidencia: true },
      },
      retencionesIVA: {
        include: {
          compra: {
            include: {
              tipoDocumento: true,
            },
          },
          periodoFiscal: true,
        },
        orderBy: {
          compra: { fechaFactura: "asc" }
        }
      },
    },
  });
}
