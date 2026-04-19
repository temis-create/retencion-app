import { prisma } from "@/lib/prisma";
import { TipoExportacionFiscal } from "@prisma/client";
import { mapRetencionToLineaExport, formatToCSV, formatToTXT } from "./exportacion-islr.mapper";

/**
 * Servicio para la generación de archivos de exportación fiscal ISLR.
 */

export async function getHistorialExportacionesISLR(tenantId: string, empresaId?: string) {
  return await prisma.exportacionFiscal.findMany({
    where: {
      tenantId,
      empresaId,
      tipo: {
        in: [TipoExportacionFiscal.ISLR_TXT, TipoExportacionFiscal.ISLR_CSV, TipoExportacionFiscal.XML_ISLR]
      }
    },
    include: {
      periodoFiscal: true,
      empresa: true,
      usuario: {
        select: { nombre: true }
      }
    },
    orderBy: { fechaGeneracion: 'desc' }
  });
}

export async function generarExportacionISLR(params: {
  tenantId: string;
  empresaId: string;
  periodoFiscalId: string;
  formato: "TXT" | "CSV";
  usuarioId: string;
}) {
  const { tenantId, empresaId, periodoFiscalId, formato, usuarioId } = params;

  // 1. Validar Periodo y Empresa
  const periodo = await prisma.periodoFiscal.findUnique({
    where: { id: periodoFiscalId }
  });

  if (!periodo || periodo.empresaId !== empresaId) {
    throw new Error("El período fiscal seleccionado no corresponde a la empresa.");
  }

  // 2. Cargar retenciones que tengan comprobante emitido
  const retenciones = await prisma.retencionISLR.findMany({
    where: {
      tenantId,
      periodoFiscalId,
      comprobanteISLRId: { not: null }, // Solo con comprobante
      estado: "CONFIRMADA"
    },
    include: {
      comprobanteISLR: {
        include: {
          proveedor: true,
          empresa: true
        }
      },
      pago: {
        include: {
          proveedor: true,
          empresa: true
        }
      },
      periodoFiscal: true
    }
  });

  if (retenciones.length === 0) {
    throw new Error("No existen retenciones confirmadas con comprobante para exportar en este período.");
  }

  // 3. Transformar datos
  const lineas = retenciones.map(mapRetencionToLineaExport);
  const montoTotal = retenciones.reduce((acc, r) => acc + Number(r.montoRetenido), 0);
  
  // 4. Generar contenido del archivo
  let contenido = "";
  let nombreArchivo = "";
  let tipoExport: TipoExportacionFiscal;

  if (formato === "CSV") {
    contenido = formatToCSV(lineas);
    nombreArchivo = `ISLR_${periodo.codigoPeriodo}_${empresaId.slice(0,4)}.csv`;
    tipoExport = TipoExportacionFiscal.ISLR_CSV;
  } else {
    contenido = formatToTXT(lineas);
    nombreArchivo = `ISLR_${periodo.codigoPeriodo}_${empresaId.slice(0,4)}.txt`;
    tipoExport = TipoExportacionFiscal.ISLR_TXT;
  }

  // 5. Registrar en el historial (Persistencia)
  const exportacion = await prisma.exportacionFiscal.create({
    data: {
      tenantId,
      empresaId,
      periodoFiscalId,
      tipo: tipoExport,
      usuarioId,
      cantidadRegistros: lineas.length,
      montoTotal,
      nombreArchivo,
      metadata: {
        formato,
        registros: lineas.length,
        version: "1.0"
      }
    }
  });

  return {
    id: exportacion.id,
    nombreArchivo,
    contenido,
    cantidad: lineas.length,
    totalRetenido: montoTotal
  };
}
