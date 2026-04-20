"use server";

import { revalidatePath } from "next/cache";
import { UnidadTributariaService } from "../server/ut.service";

const service = new UnidadTributariaService();

export async function createUTAction(formData: FormData) {
  try {
    const valor = parseFloat(formData.get("valor") as string);
    const fechaInicio = new Date(formData.get("fechaInicio") as string);
    const descripcion = formData.get("descripcion") as string;

    if (isNaN(valor) || valor <= 0) throw new Error("Valor inválido");

    await service.createUT({ valor, fechaInicio, descripcion });
    revalidatePath("/dashboard-admin/unidad-tributaria");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUTAction(id: string, data: any) {
  try {
    await service.updateUT(id, data);
    revalidatePath("/dashboard-admin/unidad-tributaria");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
