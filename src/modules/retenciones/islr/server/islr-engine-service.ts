import { prisma } from "@/lib/prisma";
import { ISLRRetencionEngine } from "../engine/islr-retencion.engine";
import { resolverSujetoISLR } from "../engine/islr-retencion.subject";
import { Prisma } from "@prisma/client";
import { UnidadTributariaService } from "@/modules/admin-saas/unidad-tributaria/server/ut.service";

export class ISLREngineService {
  /**
   * Evalúa y calcula la retención ISLR para un pago.
   * NO persiste, solo devuelve el cálculo.
   */
  static async evaluarRetencionParaPago(pagoId: string) {
    const pago = await prisma.pago.findUnique({
      where: { id: pagoId },
      include: {
        proveedor: true,
        conceptoISLR: true,
      },
    });

    if (!pago) throw new Error("Pago no encontrado");

    // 1. Obtener UT vigente según fecha del pago
    const utService = new UnidadTributariaService();
    const ut = await utService.getUTByFecha(new Date(pago.fechaPago));
    const valorUT = ut ? Number(ut.valor) : 43.00; 

    // 2. Resolver Sujeto
    const sujeto = resolverSujetoISLR({
      tipoPersona: pago.proveedor.tipoPersona,
      tipoResidencia: pago.proveedor.tipoResidencia,
    });

    // 3. Ejecutar Motor
    const resultado = ISLRRetencionEngine.evaluar({
      pagoId: pago.id,
      montoTotalPago: Number(pago.montoTotal),
      sujeto,
      conceptoISLR: pago.conceptoISLR,
      valorUTVigente: valorUT,
      tipoEventoRetencion: pago.tipoEventoRetencion,
    });

    return resultado;
  }

  /**
   * Ejecuta el cálculo y persiste el resultado en la base de datos.
   */
  static async calcularYGuardarRetencion(pagoId: string, tenantId: string) {
    const res = await this.evaluarRetencionParaPago(pagoId);
    
    // Buscar si ya existe una retención para este pago (idempotencia)
    const existente = await prisma.retencionISLR.findFirst({
      where: { pagoId, tenantId },
    });

    // Obtener el periodo fiscal del pago
    const pago = await prisma.pago.findUnique({
      where: { id: pagoId }
    });
    
    if (!pago) throw new Error("Pago no encontrado");

    const data: any = {
      tenantId,
      pagoId,
      periodoFiscalId: pago.periodoFiscalId,
      estado: res.aplica ? "CALCULADA" : "ANULADA", // 'CALCULADA' es el estado requerido para emitir comprobante
      valorUTSnapshot: new Prisma.Decimal(res.snapshotNormativo.valorUT),
      baseCalculoSnapshot: new Prisma.Decimal(res.baseCalculo),
      codigoConceptoSnapshot: res.aplica ? (res.conceptoId.toString()) : "N/A",
      descripcionConceptoSnapshot: res.motivoDescripcion,
      porcentajeBaseSnapshot: new Prisma.Decimal(res.porcentajeBaseImponible),
      tarifaAplicadaSnapshot: new Prisma.Decimal(res.porcentajeRetencion || 0),
      sustraendoSnapshot: new Prisma.Decimal(res.sustraendoBs),
      montoRetenido: new Prisma.Decimal(res.montoRetenido),
      // Campos extendidos
      tipoEventoRetencionSnapshot: pago.tipoEventoRetencion,
      sujetoSnapshot: res.sujetoAplicado,
      motivoCodigo: res.motivoCodigo,
      motivoDescripcion: res.motivoDescripcion,
      categoriaRegla: res.categoriaRegla,
      baseLegalNorma: res.baseLegal.norma,
      baseLegalArticulo: res.baseLegal.articulo,
      baseLegalDescripcion: res.baseLegal.descripcion,
      versionMotor: res.snapshotNormativo.versionMotor,
    };

    if (existente) {
      return await prisma.retencionISLR.update({
        where: { id: existente.id },
        data,
      });
    } else {
      return await prisma.retencionISLR.create({
        data,
      });
    }
  }

  static async getRetencionByPagoId(pagoId: string) {
    return await prisma.retencionISLR.findFirst({
      where: { pagoId },
    });
  }
}
