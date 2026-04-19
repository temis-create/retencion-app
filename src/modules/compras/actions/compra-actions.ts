"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { compraSchema, CompraFormValues } from "../server/compra.schema";
import { createCompra, updateCompra } from "../server/compra.service";

export async function createCompraAction(data: CompraFormValues) {
  try {
    const tenantId = await getTenantId();

    const parsed = compraSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;
      return { success: false, error: firstError || "Datos de formulario inválidos." };
    }

    const result = await createCompra(parsed.data, tenantId);
    revalidatePath("/compras");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al registrar la compra." };
  }
}

export async function updateCompraAction(id: string, data: CompraFormValues) {
  try {
    const tenantId = await getTenantId();

    const parsed = compraSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message;
      return { success: false, error: firstError || "Datos de formulario inválidos." };
    }

    const result = await updateCompra(id, parsed.data, tenantId);
    revalidatePath("/compras");
    revalidatePath(`/compras/${id}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar la compra." };
  }
}
