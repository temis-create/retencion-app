import { prisma } from "@/lib/prisma";

export class UnidadTributariaService {
  /**
   * Obtiene la Unidad Tributaria vigente para una fecha dada.
   */
  async getUTByFecha(fecha: Date = new Date()) {
    return await prisma.unidadTributaria.findFirst({
      where: {
        activo: true,
        fechaInicio: { lte: fecha },
        OR: [
          { fechaFin: null },
          { fechaFin: { gte: fecha } },
        ],
      },
      orderBy: { fechaInicio: "desc" },
    });
  }

  /**
   * Obtiene todas las UT registradas (historial).
   */
  async getAll() {
    return await prisma.unidadTributaria.findMany({
      orderBy: { fechaInicio: "desc" },
    });
  }

  /**
   * Crea una nueva Unidad Tributaria.
   * Auto-cierra la anterior si es necesario.
   */
  async createUT(data: { valor: number; fechaInicio: Date; descripcion?: string }) {
    // 1. Validar que no haya solapamiento directo
    // Para simplificar, cerramos cualquier UT que esté abierta (sin fechaFin) 
    // y cuya fecha de inicio sea anterior a la nueva.
    
    await prisma.unidadTributaria.updateMany({
      where: {
        fechaFin: null,
        fechaInicio: { lt: data.fechaInicio },
      },
      data: {
        fechaFin: data.fechaInicio,
        activo: false,
      },
    });

    return await prisma.unidadTributaria.create({
      data: {
        valor: data.valor,
        fechaInicio: data.fechaInicio,
        descripcion: data.descripcion,
        activo: true,
      },
    });
  }

  /**
   * Actualiza una UT existente.
   */
  async updateUT(id: string, data: { valor?: number; fechaInicio?: Date; fechaFin?: Date | null; descripcion?: string; activo?: boolean }) {
    return await prisma.unidadTributaria.update({
      where: { id },
      data,
    });
  }
}
