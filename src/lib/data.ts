import { prisma } from "@/lib/prisma";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";

/**
 * Obtiene la empresa activa completa desde la DB.
 * Valida que pertenezca al tenant del usuario.
 */
export async function getEmpresaActiva() {
  const tenantId = await getTenantId();
  const empresaId = await getEmpresaActivaId();

  if (empresaId) {
    const empresa = await prisma.empresa.findFirst({
      where: {
        id: empresaId,
        tenantId,
        deletedAt: null,
      },
    });
    if (empresa) return empresa;
  }

  // Fallback: Si no hay empresaId o es inválida, tomar la primera del tenant
  const fallback = await prisma.empresa.findFirst({
    where: {
      tenantId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return fallback;
}

/**
 * Versión estricta que lanza error si no hay empresa activa
 */
export async function requireEmpresaActiva() {
  const empresa = await getEmpresaActiva();
  if (!empresa) {
    throw new Error("No hay una empresa activa seleccionada o configurada para este tenant.");
  }
  return empresa;
}

export async function getDashboardMetrics(empresaId?: string) {
  const tenantId = await getTenantId();
  
  // Si no pasan empresaId, intentamos usar la activa
  const finalEmpresaId = empresaId || (await getEmpresaActivaId());

  // Condiciones base
  const whereTenant = { tenantId };
  // Conditions filtered by empresa if it exists
  const whereEmpresa = finalEmpresaId ? { tenantId, empresaId: finalEmpresaId } : { tenantId };

  const [
    empresasCount,
    proveedoresCount,
    comprasCount,
    pagosCount,
    retencionesIVACount,
    retencionesISLRCount,
  ] = await Promise.all([
    prisma.empresa.count({ where: { ...whereTenant, deletedAt: null } }),
    prisma.proveedor.count({ where: { ...whereEmpresa, deletedAt: null } }),
    prisma.compra.count({ where: whereEmpresa }),
    prisma.pago.count({ where: whereEmpresa }),
    prisma.retencionIVA.count({ 
      where: { 
        tenantId, 
        ...(finalEmpresaId ? { periodoFiscal: { empresaId: finalEmpresaId } } : {}) 
      } 
    }),
    prisma.retencionISLR.count({ 
      where: { 
        tenantId, 
        ...(finalEmpresaId ? { periodoFiscal: { empresaId: finalEmpresaId } } : {}) 
      } 
    }),
  ]);

  return {
    empresas: empresasCount,
    proveedores: proveedoresCount,
    compras: comprasCount,
    pagos: pagosCount,
    retencionesIVA: retencionesIVACount,
    retencionesISLR: retencionesISLRCount,
  };
}
