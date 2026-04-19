"use server";

import { ISLRCatalogService } from "../server/islr-catalog-service";
import { ConceptoISLRFormValues, ConceptoISLRSchema } from "../server/islr-catalog.schema";
import { revalidatePath } from "next/cache";
import { getCurrentUser, requireAuth } from "@/lib/auth";

export async function getConceptosAction(filters?: any) {
  try {
    await requireAuth();
    return await ISLRCatalogService.getConceptos(filters);
  } catch (error) {
    console.error("Error al obtener conceptos ISLR:", error);
    throw new Error("No se pudieron obtener los conceptos.");
  }
}

export async function updateConceptoAction(id: number, data: ConceptoISLRFormValues) {
  try {
    const user = await requireAuth();
    const validated = ConceptoISLRSchema.parse(data);
    const result = await ISLRCatalogService.updateConcepto(id, validated, user.id, user.tenantId);
    revalidatePath("/admin/catalogos/islr");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error al actualizar concepto ISLR:", error);
    return { success: false, error: error.message || "Error al actualizar." };
  }
}

export async function toggleConceptoActivoAction(id: number) {
  try {
    const user = await requireAuth();
    const result = await ISLRCatalogService.toggleActivo(id, user.id, user.tenantId);
    revalidatePath("/admin/catalogos/islr");
    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error al cambiar estado de concepto ISLR:", error);
    return { success: false, error: error.message || "Error al cambiar estado." };
  }
}
