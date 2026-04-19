"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { PagoFormValues } from "../server/pago.schema";
import { createPago, getComprasPendientes } from "../server/pago.service";

export async function createPagoAction(data: PagoFormValues) {
  try {
    const tenantId = await getTenantId();
    const result = await createPago(data, tenantId);
    
    revalidatePath("/fiscal/pagos");
    revalidatePath("/compras");
    
    return { success: true, id: result.id };
  } catch (error: any) {
    console.error("Error creating pago:", error);
    return { success: false, error: error.message || "Error al registrar el pago" };
  }
}

export async function getComprasPendientesAction(empresaId: string, proveedorId: string) {
  try {
    const compras = await getComprasPendientes(empresaId, proveedorId);
    return { success: true, data: compras };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
