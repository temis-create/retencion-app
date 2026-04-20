import { z } from "zod";

export const OrganizationActionSchema = z.object({
  id: z.string(),
});

export const UpdateOrganizationStatusSchema = z.object({
  id: z.string(),
  activo: z.boolean(),
  estado: z.enum(["ACTIVA", "SUSPENDIDA", "EN_VIGILANCIA"]),
});

export const AssignPlanSchema = z.object({
  organizationId: z.string(),
  planId: z.string(),
  fechaFinPlan: z.date().optional().nullable(),
  limiteEmpresasOverride: z.number().int().min(1).optional().nullable(),
});

export const PlanFormSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(3),
  codigo: z.string().min(3),
  descripcion: z.string().optional().nullable(),
  precioReferencial: z.number().min(0),
  limiteEmpresas: z.number().int().min(1),
  limiteUsuarios: z.number().int().min(1).optional().nullable(),
  activo: z.boolean(),
});

export const CreateOrganizationSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  rif: z.string().min(6, "RIF inválido"),
  emailContacto: z.string().email("Email inválido").optional().nullable(),
  adminNombre: z.string().min(3, "Mínimo 3 caracteres"),
  adminEmail: z.string().email("Email del admin inválido"),
  adminPassword: z.string().min(6, "Password mínimo 6 caracteres"),
});

export const UpdateUserSchema = z.object({
  id: z.string(),
  nombre: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La clave debe tener al menos 6 caracteres").optional().or(z.literal("")),
  activo: z.boolean().default(true),
  rolGlobal: z.enum(["SUPERADMIN", "ADMIN_SAAS", "USUARIO"]),
});

export type OrganizationAction = z.infer<typeof OrganizationActionSchema>;
export type UpdateOrganizationStatus = z.infer<typeof UpdateOrganizationStatusSchema>;
export type AssignPlan = z.infer<typeof AssignPlanSchema>;
export type PlanForm = z.infer<typeof PlanFormSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
