"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { empresaSchema, EmpresaFormValues } from "../server/empresa.schema";
import { createEmpresa, updateEmpresa } from "../server/empresa.service";

export async function createEmpresaAction(data: EmpresaFormValues) {
  try {
    const tenantId = await getTenantId();
    
    // Server-side validation
    const parsed = empresaSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos de formulario inválidos." };
    }

    const result = await createEmpresa(parsed.data, tenantId);
    revalidatePath("/empresas");
    
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al crear la empresa" };
  }
}

export async function updateEmpresaAction(id: string, data: EmpresaFormValues) {
  try {
    const tenantId = await getTenantId();
    
    // Server-side validation
    const parsed = empresaSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos de formulario inválidos." };
    }

    const result = await updateEmpresa(id, parsed.data, tenantId);
    revalidatePath("/empresas");
    revalidatePath(`/empresas/${id}`);
    revalidatePath(`/empresas/${id}/editar`);
    
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al actualizar la empresa" };
  }
}
