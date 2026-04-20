"use server";

import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { empresaSchema, EmpresaFormValues } from "../server/empresa.schema";
import { createEmpresa, updateEmpresa } from "../server/empresa.service";
import { uploadToBunny } from "@/lib/bunny-storage";
import { prisma } from "@/lib/prisma";

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

export async function uploadEmpresaLogoAction(empresaId: string, formData: FormData) {
  try {
    const tenantId = await getTenantId();
    const file = formData.get("file") as File;
    if (!file) throw new Error("No se proporcionó ningún archivo");

    // Verificar que la empresa pertenece al tenant
    const empresa = await prisma.empresa.findFirst({
      where: { id: empresaId, tenantId, deletedAt: null }
    });

    if (!empresa) throw new Error("Empresa no encontrada.");

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop();
    const fileName = `logo_${empresaId}.${extension}`;
    
    const logoUrl = await uploadToBunny(buffer, fileName);
    
    await prisma.empresa.update({
      where: { id: empresaId },
      data: { logoUrl }
    });

    revalidatePath("/empresas");
    revalidatePath(`/empresas/${empresaId}`);
    
    return { success: true, url: logoUrl };
  } catch (error: any) {
    console.error("Upload Error:", error);
    return { success: false, error: error.message || "Error al cargar el logo" };
  }
}
