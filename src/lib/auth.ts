import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/server/auth.config";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function getSession() {
  return await getServerSession(authOptions);
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  empresaActivaId?: string | null;
  rolGlobal: "SUPERADMIN" | "ADMIN_SAAS" | "USUARIO";
};

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user as AuthUser | undefined;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getTenantId() {
  const user = await getCurrentUser();
  if (!user || !user.tenantId) {
    throw new Error("Unauthorized");
  }
  return user.tenantId;
}

export async function getUserId() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }
  return user.id;
}

/**
 * Obtiene el ID de la empresa activa.
 * 1. Intenta desde cookie (cambio rápido)
 * 2. Si no hay cookie, usa el valor de la sesión
 * 3. Si no hay en sesión, retorna null
 */
export async function getEmpresaActivaId() {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get("empresaActivaId")?.value;
  
  if (cookieValue) return cookieValue;

  const user = await getCurrentUser();
  return user?.empresaActivaId || null;
}
