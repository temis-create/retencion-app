import { prisma } from "@/lib/prisma";
import { ProveedorFormValues } from "./proveedor.schema";

export async function getProveedoresByTenant(tenantId: string, empresaId?: string) {
  const proveedores = await prisma.proveedor.findMany({
    where: {
      tenantId,
      deletedAt: null,
      ...(empresaId ? { empresaId } : {}),
    },
    include: {
      empresa: {
        select: {
          id: true,
          nombreFiscal: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return proveedores.map(sanitizeProveedor);
}

export async function getProveedorById(id: string, tenantId: string) {
  const proveedor = await prisma.proveedor.findFirst({
    where: {
      id,
      tenantId,
      deletedAt: null,
    },
    include: {
      empresa: {
        select: {
          id: true,
          nombreFiscal: true,
        },
      },
    },
  });

  if (!proveedor) return null;
  return sanitizeProveedor(proveedor);
}

function sanitizeProveedor(p: any) {
  return {
    ...p,
    porcentajeRetencionIVA: Number(p.porcentajeRetencionIVA)
  };
}

export async function checkProveedorRifExists(rif: string, empresaId: string, excludeId?: string) {
  const rifNorm = rif.trim().toUpperCase();
  const proveedor = await prisma.proveedor.findFirst({
    where: {
      rif: rifNorm,
      empresaId,
      deletedAt: null,
      id: excludeId ? { not: excludeId } : undefined,
    },
  });
  return !!proveedor;
}

export async function createProveedor(data: ProveedorFormValues, tenantId: string) {
  const rifNormalizado = data.rif.trim().toUpperCase();
  
  // Validar si la empresa pertenece al tenant
  const empresa = await prisma.empresa.findFirst({
    where: {
      id: data.empresaId,
      tenantId,
      deletedAt: null,
    },
  });

  if (!empresa) {
    throw new Error("La empresa seleccionada no existe o no pertenece a tu organización.");
  }

  const exists = await checkProveedorRifExists(rifNormalizado, data.empresaId);
  if (exists) {
    throw new Error("Ya existe un proveedor con este RIF en esta empresa.");
  }

  return await prisma.proveedor.create({
    data: {
      tenantId,
      empresaId: data.empresaId,
      nombre: data.nombre.trim(),
      rif: rifNormalizado,
      tipoPersona: data.tipoPersona,
      tipoResidencia: data.tipoResidencia,
      tipoContribuyente: data.tipoContribuyente,
      porcentajeRetencionIVA: data.porcentajeRetencionIVA,
      esAgentePercepcionIVA: data.esAgentePercepcionIVA ?? false,
      rubroPercepcionIVA: data.rubroPercepcionIVA ?? null,
      proveedorMarcadoRetencion100: data.proveedorMarcadoRetencion100 ?? false,
      rifRegistrado: data.rifRegistrado ?? true,
    },
  });
}

export async function updateProveedor(id: string, data: ProveedorFormValues, tenantId: string) {
  // Autenticar la existencia y membresía del proveedor al tenant (respetando soft delete)
  const proveedor = await prisma.proveedor.findFirst({
    where: { id, tenantId, deletedAt: null },
  });

  if (!proveedor) {
    throw new Error("Proveedor no encontrado o no autorizado.");
  }

  // Validar si la nueva empresa designada (si fue alterada) pertenece al tenant
  const empresa = await prisma.empresa.findFirst({
    where: {
      id: data.empresaId,
      tenantId,
      deletedAt: null,
    },
  });

  if (!empresa) {
    throw new Error("La empresa seleccionada no existe o no pertenece a tu organización.");
  }

  const rifNormalizado = data.rif.trim().toUpperCase();
  const exists = await checkProveedorRifExists(rifNormalizado, data.empresaId, id);
  if (exists) {
    throw new Error("Ya existe otro proveedor con este RIF en esta empresa.");
  }

  return await prisma.proveedor.update({
    where: { id },
    data: {
      empresaId: data.empresaId,
      nombre: data.nombre.trim(),
      rif: rifNormalizado,
      tipoPersona: data.tipoPersona,
      tipoResidencia: data.tipoResidencia,
      tipoContribuyente: data.tipoContribuyente,
      porcentajeRetencionIVA: data.porcentajeRetencionIVA,
      esAgentePercepcionIVA: data.esAgentePercepcionIVA ?? false,
      rubroPercepcionIVA: data.rubroPercepcionIVA ?? null,
      proveedorMarcadoRetencion100: data.proveedorMarcadoRetencion100 ?? false,
      rifRegistrado: data.rifRegistrado ?? true,
    },
  });
}
