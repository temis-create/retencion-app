"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { calcularYGuardarRetencionIVA } from "../server/retencion-iva.service";

export async function calcularRetencionIVAAction(compraId: string) {
  try {
    const tenantId = await getTenantId();
    const result = await calcularYGuardarRetencionIVA(compraId, tenantId);

    // Revalidamos la ruta base de compras y el detalle específico
    revalidatePath("/compras");
    revalidatePath(`/compras/${compraId}`);

    // Sanitización para Client Components
    const sanitizedResult = {
      ...result,
      retencion: result.retencion ? {
        ...result.retencion,
        porcentajeRetencionSnapshot: Number(result.retencion.porcentajeRetencionSnapshot),
        montoBaseSnapshot: Number(result.retencion.montoBaseSnapshot),
        impuestoIVASnapshot: Number(result.retencion.impuestoIVASnapshot),
        montoRetenido: Number(result.retencion.montoRetenido),
      } : undefined
    };

    return { success: true, ...sanitizedResult };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al calcular retención IVA." };
  }
}
