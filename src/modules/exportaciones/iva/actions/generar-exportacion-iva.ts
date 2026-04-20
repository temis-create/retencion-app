"use server";

import { getCurrentUser } from "@/lib/auth";
import { ExportacionIVAService } from "../server/exportacion-iva.service";
import { revalidatePath } from "next/cache";

export async function generarExportacionIVAAction(
  periodoFiscalId: string,
  empresaId: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "No autorizado" };
    }

    const result = await ExportacionIVAService.generarExportacion(
      periodoFiscalId,
      empresaId,
      user.tenantId,
      user.id
    );

    revalidatePath("/fiscal/exportaciones-iva");

    return { 
      success: true, 
      data: {
        id: result.exportacion.id,
        content: result.content,
        fileName: result.fileName,
        cantidad: result.exportacion.cantidadRegistros,
        monto: result.exportacion.montoTotal.toNumber(),
      }
    };
  } catch (error: any) {
    console.error("Error en generarExportacionIVAAction:", error);
    return { success: false, error: error.message || "Error al generar la exportacin" };
  }
}

export async function getHistorialExportacionesIVAAction(empresaId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("No autorizado");
    }

    const records = await ExportacionIVAService.getHistorial(empresaId, user.tenantId);
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
