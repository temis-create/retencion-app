"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { proveedorSchema, ProveedorFormValues } from "../server/proveedor.schema";
import { createProveedor, updateProveedor } from "../server/proveedor.service";

export async function createProveedorAction(data: ProveedorFormValues) {
  try {
    const tenantId = await getTenantId();
    
    // Server-side double validation
    const parsed = proveedorSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos de formulario inválidos." };
    }

    const result = await createProveedor(parsed.data, tenantId);
    revalidatePath("/proveedores");
    
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al registrar el proveedor" };
  }
}

export async function updateProveedorAction(id: string, data: ProveedorFormValues) {
  try {
    const tenantId = await getTenantId();
    
    const parsed = proveedorSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos de formulario inválidos." };
    }

    const result = await updateProveedor(id, parsed.data, tenantId);
    revalidatePath("/proveedores");
    revalidatePath(`/proveedores/${id}`);
    revalidatePath(`/proveedores/${id}/editar`);
    
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar el proveedor" };
  }
}
