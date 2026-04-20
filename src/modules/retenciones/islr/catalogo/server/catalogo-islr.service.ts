import { prisma } from "@/lib/prisma";

export class CatalogoISLRClientService {
  /**
   * Obtiene los conceptos de ISLR para consulta del cliente.
   * Por defecto solo activos, a menos que se especifique lo contrario.
   */
  async getConceptos(filters: { search?: string; sujeto?: string; activo?: boolean; orderBy?: string; orderDir?: 'asc' | 'desc' } = {}) {
    const orderField = filters.orderBy || 'concepto';
    const direction = filters.orderDir || 'asc';

    return await prisma.conceptoRetencionISLR.findMany({
      where: {
        activo: filters.activo !== undefined ? filters.activo : true,
        sujeto: filters.sujeto ? (filters.sujeto as any) : undefined,
        OR: filters.search
          ? [
              { concepto: { contains: filters.search, mode: "insensitive" } },
              { codigoSeniat: { contains: filters.search, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: {
        [orderField]: direction,
      },
    });
  }

  /**
   * Obtiene el detalle de un concepto específico.
   */
  async getConceptoDetail(id: number) {
    return await prisma.conceptoRetencionISLR.findUnique({
      where: { id },
    });
  }
}
