"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Cambia la empresa activa estableciendo una cookie persistente.
 * Valida que la empresa pertenezca al tenant del usuario.
 */
export async function setEmpresaActivaAction(empresaId: string) {
  const tenantId = await getTenantId();

  // Validar pertenencia al tenant
  const empresa = await prisma.empresa.findFirst({
    where: {
      id: empresaId,
      tenantId,
      deletedAt: null,
    },
    select: { id: true }
  });

  if (!empresa) {
    throw new Error("La empresa no existe o no pertenece a tu organización.");
  }

  // Establecer cookie (expira en 30 días)
  cookies().set("empresaActivaId", empresaId, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Revalidar todo el dashboard para reflejar el cambio
  revalidatePath("/", "layout");

  return { success: true };
}
