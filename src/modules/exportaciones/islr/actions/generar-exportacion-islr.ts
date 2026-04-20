"use server";

import { getTenantId, getUserId } from "@/lib/auth";
import { generarExportacionISLR } from "../server/exportacion-islr.service";
import { revalidatePath } from "next/cache";

export async function generarExportacionISLRAction(formData: {
  empresaId: string;
  periodoFiscalId: string;
  formato: "TXT" | "CSV" | "XML";
}) {
  try {
    const tenantId = await getTenantId();
    const usuarioId = await getUserId();

    if (!formData.empresaId || !formData.periodoFiscalId) {
      return { success: false, error: "Empresa y Período son obligatorios." };
    }

    const result = await generarExportacionISLR(
      {
        tenantId,
        empresaId: formData.empresaId,
        periodoFiscalId: formData.periodoFiscalId,
        formato: formData.formato,
        usuarioId
      }
    );

    revalidatePath("/fiscal/declaraciones-islr");

    return { 
      success: true, 
      data: {
        id: result.id,
        nombre: result.nombreArchivo,
        contenido: result.contenido,
        resumen: `Exportación de ${result.cantidad} líneas generada.`
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
