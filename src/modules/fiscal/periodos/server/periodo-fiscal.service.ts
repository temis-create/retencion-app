import { prisma } from "@/lib/prisma";
import { Prisma, TipoImpuesto, FrecuenciaPeriodo } from "@prisma/client";
import { PeriodoFiscalFormValues, generarCodigoPeriodo } from "./periodo-fiscal.schema";

// ─── Listado ──────────────────────────────────────────────────────────────────

export async function getPeriodosByTenant(tenantId: string, empresaId?: string) {
  return await prisma.periodoFiscal.findMany({
    where: {
      tenantId,
      ...(empresaId ? { empresaId } : {}),
    },
    include: {
      empresa: {
        select: { id: true, nombreFiscal: true },
      },
    },
    orderBy: [{ anio: "desc" }, { mes: "desc" }, { subperiodo: "desc" }],
  });
}

// ─── Detalle ─────────────────────────────────────────────────────────────────

export async function getPeriodoById(id: string, tenantId: string) {
  return await prisma.periodoFiscal.findFirst({
    where: { id, tenantId },
    include: {
      empresa: {
        select: { id: true, nombreFiscal: true },
      },
    },
  });
}

// ─── Creación ─────────────────────────────────────────────────────────────────

export async function createPeriodoFiscal(
  data: PeriodoFiscalFormValues,
  tenantId: string
) {
  // Validar empresa del tenant
  const empresa = await prisma.empresa.findFirst({
    where: { id: data.empresaId, tenantId, deletedAt: null },
  });
  if (!empresa) {
    throw new Error("La empresa seleccionada no existe o no pertenece a tu organización.");
  }

  const codigoPeriodo = generarCodigoPeriodo(
    data.anio,
    data.mes,
    data.tipoImpuesto as "IVA" | "ISLR",
    data.frecuencia as "MENSUAL" | "QUINCENAL",
    data.subperiodo
  );

  // Verificar unicidad (tenantId + empresaId + tipoImpuesto + codigoPeriodo)
  const existing = await prisma.periodoFiscal.findFirst({
    where: {
      tenantId,
      empresaId: data.empresaId,
      tipoImpuesto: data.tipoImpuesto as TipoImpuesto,
      codigoPeriodo,
    },
  });
  if (existing) {
    throw new Error(
      `Ya existe un período fiscal con código "${codigoPeriodo}" para esta empresa.`
    );
  }

  return await prisma.periodoFiscal.create({
    data: {
      tenantId,
      empresaId: data.empresaId,
      anio: data.anio,
      mes: data.mes,
      tipoImpuesto: data.tipoImpuesto as TipoImpuesto,
      frecuencia: data.frecuencia as FrecuenciaPeriodo,
      subperiodo: data.subperiodo ?? null,
      codigoPeriodo,
      fechaInicio: new Date(data.fechaInicio),
      fechaFin: new Date(data.fechaFin),
      estado: "ABIERTO",
    },
  });
}

// ─── Cierre ──────────────────────────────────────────────────────────────────

export async function closePeriodoFiscal(id: string, tenantId: string) {
  const periodo = await prisma.periodoFiscal.findFirst({
    where: { id, tenantId },
  });

  if (!periodo) {
    throw new Error("Período fiscal no encontrado o no autorizado.");
  }

  if (periodo.estado === "CERRADO") {
    throw new Error("Este período ya fue cerrado.");
  }

  return await prisma.periodoFiscal.update({
    where: { id },
    data: {
      estado: "CERRADO",
      fechaCierre: new Date(),
    },
  });
}

// ─── Helper Infraestructura (reutilizado por Compras y Pagos) ─────────────────

/**
 * Obtiene el período fiscal ABIERTO de una empresa para un tipo de impuesto dado.
 * Si se pasa una fecha, intenta refinar buscando el período cuyo rango la contenga.
 * Si no existe período abierto, retorna null — el llamador decide si bloquear o continuar.
 *
 * USADO POR: Compras, Pagos, Retenciones.
 */
export async function getPeriodoFiscalAbierto(
  empresaId: string,
  tipoImpuesto: TipoImpuesto,
  fecha?: Date
) {
  const where: Prisma.PeriodoFiscalWhereInput = {
    empresaId,
    tipoImpuesto,
    estado: "ABIERTO",
  };

  // Si se pasa una fecha, filtrar por el rango que la contenga
  if (fecha) {
    where.OR = [
      // Período con fechas definidas que contengan la fecha
      {
        fechaInicio: { lte: fecha },
        fechaFin: { gte: fecha },
      },
      // Período con fechas no definidas (abierto sin restricción de rango)
      {
        fechaInicio: null,
        fechaFin: null,
      },
    ];
  }

  return await prisma.periodoFiscal.findFirst({
    where,
    orderBy: [{ anio: "desc" }, { mes: "desc" }, { subperiodo: "desc" }],
  });
}

/**
 * Lanza error si no existe período abierto.
 * Usar en Compras y Pagos para bloquear registro si no hay período.
 */
export async function requirePeriodoAbierto(
  empresaId: string,
  tipoImpuesto: TipoImpuesto,
  fecha?: Date
) {
  const periodo = await getPeriodoFiscalAbierto(empresaId, tipoImpuesto, fecha);
  if (!periodo) {
    throw new Error(
      `No existe un período fiscal abierto de ${tipoImpuesto} para esta empresa. Abra un período antes de registrar operaciones.`
    );
  }
  return periodo;
}
