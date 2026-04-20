import { z } from "zod";

export const OrganizationActionSchema = z.object({
  id: z.string().uuid(),
});

export const UpdateOrganizationStatusSchema = z.object({
  id: z.string().uuid(),
  activo: z.boolean(),
  estado: z.enum(["ACTIVA", "SUSPENDIDA", "EN_VIGILANCIA"]),
});

export const AssignPlanSchema = z.object({
  organizationId: z.string().uuid(),
  planId: z.string().uuid(),
  fechaFinPlan: z.date().optional().nullable(),
  limiteEmpresasOverride: z.number().int().min(1).optional().nullable(),
});

export const PlanFormSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(3),
  codigo: z.string().min(3),
  descripcion: z.string().optional().nullable(),
  precioReferencial: z.number().min(0),
  limiteEmpresas: z.number().int().min(1),
  limiteUsuarios: z.number().int().min(1).optional().nullable(),
  activo: z.boolean(),
});

export type OrganizationAction = z.infer<typeof OrganizationActionSchema>;
export type UpdateOrganizationStatus = z.infer<typeof UpdateOrganizationStatusSchema>;
export type AssignPlan = z.infer<typeof AssignPlanSchema>;
export type PlanForm = z.infer<typeof PlanFormSchema>;
