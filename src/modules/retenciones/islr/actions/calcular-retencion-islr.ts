"use server";

import { ISLREngineService } from "../server/islr-engine-service";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

/**
 * Acción unificada para calcular la retención ISLR usando el nuevo motor 2025.
 */
export async function calcularRetencionISLRAction(pagoId: string) {
  try {
    const user = await requireAuth();
    
    // Ejecutar el motor y persistir
    const result = await ISLREngineService.calcularYGuardarRetencion(pagoId, user.tenantId);
    
    // Revalidar rutas
    revalidatePath(`/fiscal/pagos/${pagoId}`);
    revalidatePath("/retenciones/islr");
    
    // Devolver estructura compatible con la UI
    return { 
      success: true, 
      aplica: result.montoRetenido.toNumber() > 0, 
      motivo: (result as any).motivoDescripcion || "Procesado",
      data: result 
    };
  } catch (error: any) {
    console.error("Error al calcular retención ISLR (Motor):", error);
    return { success: false, error: error.message || "Error interno al calcular." };
  }
}
