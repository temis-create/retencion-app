"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { emitirComprobanteIVA } from "../server/comprobante-iva.service";

export async function emitirComprobanteIVAAction(retencionIds: string[]) {
  try {
    const tenantId = await getTenantId();
    const result = await emitirComprobanteIVA(retencionIds, tenantId);

    // Revalidar rutas para reflejar las retenciones ya confirmadas
    revalidatePath("/(app)/compras", "page");
    revalidatePath("/(app)/compras/[id]", "page");
    revalidatePath("/(app)/fiscal/comprobantes-iva", "page");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error al emitir comprobante:", error);
    return { success: false, error: error.message || "Ocurrió un error inesperado al emitir el comprobante." };
  }
}
