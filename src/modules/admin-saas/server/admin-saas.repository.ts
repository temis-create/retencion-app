import { prisma } from "@/lib/prisma";
import { EstadoOrganizacion, RolGlobal } from "@prisma/client";
import { 
  PlanForm, 
  AssignPlan, 
  UpdateOrganizationStatus,
  CreateOrganization,
  UpdateUser
} from "./admin-saas.schema";
import bcrypt from "bcryptjs";

export class AdminSaasRepository {
  async getDashboardKPIs() {
    const [
      totalOrgs,
      activeOrgs,
      suspendedOrgs,
      totalUsers,
      totalEmpresas,
      totalIvaComprobantes,
      totalIslrComprobantes,
      totalExportaciones,
    ] = await Promise.all([
      prisma.organizacion.count({ where: { deletedAt: null } }),
      prisma.organizacion.count({ where: { deletedAt: null, estado: "ACTIVA" } }),
      prisma.organizacion.count({ where: { deletedAt: null, estado: "SUSPENDIDA" } }),
      prisma.usuario.count({ where: { deletedAt: null } }),
      prisma.empresa.count({ where: { deletedAt: null } }),
      prisma.comprobanteIVA.count(),
      prisma.comprobanteISLR.count(),
      prisma.exportacionFiscal.count(),
    ]);

    return {
      totalOrgs,
      activeOrgs,
      suspendedOrgs,
      totalUsers,
      totalEmpresas,
      totalIvaComprobantes,
      totalIslrComprobantes,
      totalExportaciones,
    };
  }

  async listOrganizations() {
    return prisma.organizacion.findMany({
      where: { deletedAt: null },
      include: {
        plan: true,
        _count: {
          select: {
            empresas: { where: { deletedAt: null } },
            usuarios: { where: { deletedAt: null } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getOrganizationDetail(id: string) {
    return prisma.organizacion.findFirst({
      where: { id },
      include: {
        plan: true,
        empresas: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
        usuarios: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async updateOrganizationStatus(data: UpdateOrganizationStatus) {
    return prisma.organizacion.update({
      where: { id: data.id },
      data: {
        activo: data.activo,
        estado: data.estado,
      },
    });
  }

  async assignPlan(data: AssignPlan) {
    const plan = await prisma.plan.findFirst({ where: { id: data.planId } });
    if (!plan) throw new Error("Plan no encontrado");

    return prisma.organizacion.update({
      where: { id: data.organizationId },
      data: {
        planId: data.planId,
        fechaInicioPlan: new Date(),
        fechaFinPlan: data.fechaFinPlan,
        limiteEmpresas: data.limiteEmpresasOverride ?? plan.limiteEmpresas,
      },
    });
  }

  async listUsers() {
    return prisma.usuario.findMany({
      where: { deletedAt: null },
      include: {
        tenant: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPlans() {
    return prisma.plan.findMany({
      orderBy: { precioReferencial: "asc" },
    });
  }

  async upsertPlan(data: PlanForm) {
    const planData = {
      nombre: data.nombre,
      codigo: data.codigo,
      descripcion: data.descripcion,
      precioReferencial: data.precioReferencial,
      limiteEmpresas: data.limiteEmpresas,
      limiteUsuarios: data.limiteUsuarios,
      activo: data.activo,
    };

    if (data.id) {
      return prisma.plan.update({
        where: { id: data.id },
        data: planData,
      });
    }

    return prisma.plan.create({
      data: planData,
    });
  }

  async deletePlan(id: string) {
    // Check if any organization is using it
    const count = await prisma.organizacion.count({ where: { planId: id } });
    if (count > 0) throw new Error("No se puede eliminar un plan en uso");

    return prisma.plan.delete({ where: { id } });
  }

  async createOrganization(data: CreateOrganization) {
    const passwordHash = await bcrypt.hash(data.adminPassword, 10);

    return prisma.$transaction(async (tx) => {
      // 1. Crear Organización
      const org = await tx.organizacion.create({
        data: {
          nombre: data.nombre,
          rif: data.rif,
          emailContacto: data.emailContacto,
          estado: "ACTIVA",
        }
      });

      // 2. Crear Usuario Administrador para el nuevo tenant
      const user = await tx.usuario.create({
        data: {
          tenantId: org.id,
          nombre: data.adminNombre,
          email: data.adminEmail,
          passwordHash: passwordHash,
          rolGlobal: RolGlobal.USUARIO, // El rol de Admin se maneja por Membresia/AsignacionRol 
          activo: true,
        }
      });

      return { org, user };
    });
  }

  async updateUser(data: UpdateUser) {
    const updateData: any = {
      nombre: data.nombre,
      email: data.email,
      activo: data.activo,
      rolGlobal: data.rolGlobal,
    };

    if (data.password && data.password.trim().length >= 6) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return prisma.usuario.update({
      where: { id: data.id },
      data: updateData,
    });
  }
}
