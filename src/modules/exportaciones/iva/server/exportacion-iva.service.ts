import { prisma } from "@/lib/prisma";
import { ExportacionIVAMapper } from "./exportacion-iva.mapper";
import { ExportacionIVAValidator, RetencionExportable } from "./exportacion-iva.validator";
import { TipoExportacionFiscal, EstadoExportacionFiscal } from "@prisma/client";

export class ExportacionIVAService {
  static async generarExportacion(
    periodoFiscalId: string,
    empresaId: string,
    tenantId: string,
    usuarioId: string
  ) {
    // 1. Cargar datos necesarios
    const [empresa, periodo, retenciones] = await Promise.all([
      prisma.empresa.findUnique({ where: { id: empresaId } }),
      prisma.periodoFiscal.findUnique({ where: { id: periodoFiscalId } }),
      prisma.retencionIVA.findMany({
        where: {
          periodoFiscalId,
          tenantId,
          compra: { empresaId },
          comprobanteIVAId: { not: null },
        },
        include: {
          compra: {
            include: {
              tipoDocumento: true,
              documentoAfectado: true,
              proveedor: true,
            },
          },
          comprobanteIVA: true,
        },
      }),
    ]);

    if (!empresa || !periodo) {
      throw new Error("Empresa o perodo no encontrado");
    }

    // 2. Validar elegibilidad
    const validacionEmpresa = ExportacionIVAValidator.validateEmpresa(empresa);
    if (!validacionEmpresa.isValid) {
      throw new Error(validacionEmpresa.reason);
    }

    const retencionesValidas = retenciones.filter((r) => {
      const v = ExportacionIVAValidator.isExportable(r as unknown as RetencionExportable);
      return v.isValid;
    });

    if (retencionesValidas.length === 0) {
      throw new Error("No hay retenciones confirmadas para exportar en este perodo");
    }

    // 3. Generar contenido TXT
    const lines = retencionesValidas.map((r) => {
      return ExportacionIVAMapper.mapRetencionToTxtLine(
        r as any,
        empresa,
        periodo,
        r.compra.proveedor
      );
    });

    const content = lines.join("\r\n");

    // 4. Calcular metadatos
    const amountTotal = retencionesValidas.reduce(
      (acc, r) => acc + r.montoRetenido.toNumber(),
      0
    );

    const fileName = `retenciones_iva_${empresa.rif.replace(/-/g, "")}_${periodo.anio}${periodo.mes
      .toString()
      .padStart(2, "0")}.txt`;

    // 5. Persistir ExportacionFiscal
    const exportacion = await prisma.exportacionFiscal.create({
      data: {
        tenantId,
        empresaId,
        periodoFiscalId,
        tipo: TipoExportacionFiscal.TXT_IVA,
        estado: EstadoExportacionFiscal.GENERADA,
        usuarioId,
        cantidadRegistros: retencionesValidas.length,
        montoTotal: amountTotal,
        // En un escenario real aqu guardaramos el hash o la URL si se sube a S3
      },
    });

    return {
      exportacion,
      content,
      fileName,
    };
  }

  static async getHistorial(empresaId: string, tenantId: string) {
    return prisma.exportacionFiscal.findMany({
      where: { empresaId, tenantId, tipo: TipoExportacionFiscal.TXT_IVA },
      include: {
        periodoFiscal: true,
        usuario: { select: { nombre: true } },
      },
      orderBy: { fechaGeneracion: "desc" },
    });
  }
}
