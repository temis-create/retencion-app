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

    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al calcular retención IVA." };
  }
}
