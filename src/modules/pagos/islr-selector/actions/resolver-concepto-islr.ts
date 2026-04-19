"use server";

import { resolverConceptoISLR, ResolucionISLR } from "../server/concepto-islr-resolver";

/**
 * Action para resolver el concepto técnico desde el cliente.
 */
export async function resolverConceptoISLRAction(params: {
  conceptoUIId: string;
  proveedorId: string;
}): Promise<ResolucionISLR> {
  try {
    return await resolverConceptoISLR(params);
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al resolver concepto ISLR"
    };
  }
}
