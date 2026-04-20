import { prisma } from "@/lib/prisma";
import { EmpresaFormValues } from "./empresa.schema";

export async function getEmpresasByTenant(tenantId: string) {
  return await prisma.empresa.findMany({
    where: {
      tenantId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getEmpresaById(id: string, tenantId: string) {
  return await prisma.empresa.findFirst({
    where: {
      id,
      tenantId,
      deletedAt: null,
    },
    include: {
      parametrosFiscales: true,
    },
  });
}

export async function checkRifExists(rif: string, tenantId: string, excludeId?: string) {
  const rifNormalizado = rif.trim().toUpperCase();
  const empresa = await prisma.empresa.findFirst({
    where: {
      rif: rifNormalizado,
      tenantId,
      deletedAt: null,
      id: excludeId ? { not: excludeId } : undefined,
    },
  });
  return !!empresa;
}

export async function createEmpresa(data: EmpresaFormValues, tenantId: string) {
  const rifNormalizado = data.rif.trim().toUpperCase();
  const exists = await checkRifExists(rifNormalizado, tenantId);
  if (exists) {
    throw new Error("Ya existe una empresa con este RIF en tu organización.");
  }

  // Verificar límites del SaaS
  const org = await prisma.organizacion.findFirst({
    where: { id: tenantId },
    select: { limiteEmpresas: true, _count: { select: { empresas: { where: { deletedAt: null } } } } }
  });

  if (org?.limiteEmpresas && org._count.empresas >= org.limiteEmpresas) {
    throw new Error("Tu organización alcanzó el límite de empresas permitidas por su plan actual.");
  }


  return await prisma.$transaction(async (tx) => {
    const nuevaEmpresa = await tx.empresa.create({
      data: {
        tenantId,
        nombreFiscal: data.nombreFiscal,
        rif: rifNormalizado,
        direccion: data.direccion,
        telefono: data.telefono,
        agenteRetencionIVA: data.agenteRetencionIVA,
        agenteRetencionISLR: data.agenteRetencionISLR,
        logoUrl: data.logoUrl,
        parametrosFiscales: {
          create: {
            proximoCorrelativoIVA: data.proximoCorrelativoIVA,
            proximoCorrelativoISLR: data.proximoCorrelativoISLR,
            reinicioCorrelativoMensual: true,
          },
        },
      },
    });

    return nuevaEmpresa;
  });
}

export async function updateEmpresa(id: string, data: EmpresaFormValues, tenantId: string) {
  const empresa = await prisma.empresa.findFirst({
    where: { id, tenantId, deletedAt: null },
  });

  if (!empresa) {
    throw new Error("Empresa no encontrada o no autorizada");
  }

  const rifNormalizado = data.rif.trim().toUpperCase();
  const exists = await checkRifExists(rifNormalizado, tenantId, id);
  if (exists) {
    throw new Error("Ya existe otra empresa con este RIF en tu organización.");
  }

  return await prisma.empresa.update({
    where: {
      id,
    },
    data: {
      nombreFiscal: data.nombreFiscal,
      rif: rifNormalizado,
      direccion: data.direccion,
      telefono: data.telefono,
      agenteRetencionIVA: data.agenteRetencionIVA,
      agenteRetencionISLR: data.agenteRetencionISLR,
      logoUrl: data.logoUrl,
      parametrosFiscales: {
        update: {
          proximoCorrelativoIVA: data.proximoCorrelativoIVA,
          proximoCorrelativoISLR: data.proximoCorrelativoISLR,
        }
      }
    },
  });
}
