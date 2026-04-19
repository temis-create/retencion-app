"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { TipoImpuesto } from "@prisma/client";
import { periodoFiscalSchema, PeriodoFiscalFormValues } from "../server/periodo-fiscal.schema";
import {
  createPeriodoFiscal,
  closePeriodoFiscal,
  getPeriodoFiscalAbierto,
} from "../server/periodo-fiscal.service";

export async function createPeriodoFiscalAction(data: PeriodoFiscalFormValues) {
  try {
    const tenantId = await getTenantId();

    const parsed = periodoFiscalSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;
      return { success: false, error: firstError || "Datos de formulario inválidos." };
    }

    const result = await createPeriodoFiscal(parsed.data, tenantId);
    revalidatePath("/dashboard/fiscal/periodos");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al crear el período fiscal" };
  }
}

export async function closePeriodoFiscalAction(id: string) {
  try {
    const tenantId = await getTenantId();

    const result = await closePeriodoFiscal(id, tenantId);
    revalidatePath("/dashboard/fiscal/periodos");
    revalidatePath(`/dashboard/fiscal/periodos/${id}`);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al cerrar el período fiscal" };
  }
}

/**
 * Verifica si existe un período fiscal abierto de IVA para una empresa.
 * Opcionalmente recibe una fecha para buscar el período que la contenga.
 * Usado por el formulario de Compras para validación temprana (antes de submit).
 */
export async function checkPeriodoFiscalAbiertoAction(
  empresaId: string,
  fecha?: string
) {
  try {
    const periodo = await getPeriodoFiscalAbierto(
      empresaId,
      "IVA" as TipoImpuesto,
      fecha ? new Date(fecha) : undefined
    );

    if (!periodo) {
      return {
        abierto: false,
        mensaje: fecha
          ? `No existe un período fiscal abierto de IVA que cubra la fecha ${fecha}. Abra un período antes de registrar operaciones.`
          : "Esta empresa no tiene un período fiscal de IVA abierto. Abra un período antes de registrar compras.",
      };
    }

    return {
      abierto: true,
      periodo: {
        id: periodo.id,
        codigoPeriodo: periodo.codigoPeriodo,
      },
    };
  } catch (error: any) {
    return {
      abierto: false,
      mensaje: error.message || "Error al verificar período fiscal.",
    };
  }
}
