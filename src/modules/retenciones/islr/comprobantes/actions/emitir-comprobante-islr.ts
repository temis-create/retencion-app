"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { emitirComprobanteISLR } from "../server/comprobante-islr.service";

export async function emitirComprobanteISLRAction(retencionIds: string[], redirectPage?: string) {
  try {
    const tenantId = await getTenantId();
    const result = await emitirComprobanteISLR(retencionIds, tenantId);
    
    if (redirectPage) {
        revalidatePath(redirectPage);
    }
    revalidatePath(`/fiscal/pagos`);
    revalidatePath(`/retenciones/islr/comprobantes`);

    return { 
        success: true, 
        comprobanteId: result.id,
        numero: result.numeroComprobante 
    };
  } catch (error: any) {
    console.error("Error al emitir comprobante ISLR:", error);
    return { 
        success: false, 
        error: error instanceof Error ? error.message : "Error desconocido al emitir comprobante." 
    };
  }
}
