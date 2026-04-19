import { prisma } from "@/lib/prisma";
import { ConceptoISLRFormValues } from "./islr-catalog.schema";
import { Prisma } from "@prisma/client";

export class ISLRCatalogService {
  static async getConceptos(filters?: {
    search?: string;
    sujeto?: string;
    tipoTarifa?: string;
    activo?: boolean;
    requiereCalculoEspecial?: boolean;
  }) {
    const where: Prisma.ConceptoRetencionISLRWhereInput = {};

    if (filters?.search) {
      where.OR = [
        { concepto: { contains: filters.search, mode: "insensitive" } },
        { codigoSeniat: { contains: filters.search, mode: "insensitive" } },
        { numeral: { contains: filters.search, mode: "insensitive" } },
        { notas: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.sujeto) {
      where.sujeto = filters.sujeto;
    }

    if (filters?.tipoTarifa) {
      where.tipoTarifa = filters.tipoTarifa;
    }

    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    if (filters?.requiereCalculoEspecial !== undefined) {
      where.requiereCalculoEspecial = filters.requiereCalculoEspecial;
    }

    return await prisma.conceptoRetencionISLR.findMany({
      where,
      orderBy: [
        { numeral: "asc" },
        { concepto: "asc" },
        { sujeto: "asc" },
      ],
    });
  }

  static async getConceptoById(id: number) {
    return await prisma.conceptoRetencionISLR.findUnique({
      where: { id },
    });
  }

  static async updateConcepto(id: number, data: ConceptoISLRFormValues, userId: string, tenantId: string) {
    const prev = await this.getConceptoById(id);
    
    // Convert numbers to Decimal if needed by Prisma
    const updateData: any = { ...data };
    delete updateData.id;

    const result = await prisma.conceptoRetencionISLR.update({
      where: { id },
      data: {
        ...updateData,
        baseImponiblePorcentaje: updateData.baseImponiblePorcentaje 
          ? new Prisma.Decimal(updateData.baseImponiblePorcentaje) 
          : null,
        porcentajeRetencion: updateData.porcentajeRetencion 
          ? new Prisma.Decimal(updateData.porcentajeRetencion) 
          : null,
        montoMinimoBs: updateData.montoMinimoBs 
          ? new Prisma.Decimal(updateData.montoMinimoBs) 
          : new Prisma.Decimal(0),
        sustraendoBs: updateData.sustraendoBs 
          ? new Prisma.Decimal(updateData.sustraendoBs) 
          : new Prisma.Decimal(0),
      },
    });

    // Auditoría
    await prisma.logAuditoria.create({
      data: {
        usuarioId: userId,
        tenantId: tenantId,
        accion: "UPDATE",
        entidadNombre: "ConceptoRetencionISLR",
        entidadId: id.toString(),
        datosPrevios: prev as any,
        datosNuevos: result as any,
      }
    });

    return result;
  }

  static async toggleActivo(id: number, userId: string, tenantId: string) {
    const concepto = await this.getConceptoById(id);
    if (!concepto) throw new Error("Concepto no encontrado");

    const result = await prisma.conceptoRetencionISLR.update({
      where: { id },
      data: { activo: !concepto.activo },
    });

    // Auditoría
    await prisma.logAuditoria.create({
      data: {
        usuarioId: userId,
        tenantId: tenantId,
        accion: "UPDATE",
        entidadNombre: "ConceptoRetencionISLR",
        entidadId: id.toString(),
        datosPrevios: { activo: concepto.activo },
        datosNuevos: { activo: result.activo },
      }
    });

    return result;
  }
}
