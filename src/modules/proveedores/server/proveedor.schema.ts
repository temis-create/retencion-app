import { z } from "zod";

export const proveedorSchema = z.object({
  empresaId: z.string().min(1, "Debe seleccionar una empresa"),
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  rif: z.string().regex(/^[JGVEP]-\d{8}-\d$/, "Formato de RIF inválido (ej: J-12345678-9)"),
  tipoPersona: z.enum(["NATURAL", "JURIDICA"]),
  tipoResidencia: z.enum(["RESIDENTE", "NO_RESIDENTE", "DOMICILIADO", "NO_DOMICILIADO"]),
  tipoContribuyente: z.enum(["ORDINARIO", "ESPECIAL", "FORMAL"]),
  porcentajeRetencionIVA: z.number().refine(val => val === 75 || val === 100, {
    message: "El porcentaje de retención IVA debe ser 75 o 100",
  }),

  // ── Campos fiscales IVA extendidos (SNAT/2025/000054) ──
  esAgentePercepcionIVA: z.boolean().default(false),
  rubroPercepcionIVA: z.string().nullable().optional(),
  proveedorMarcadoRetencion100: z.boolean().default(false),
  rifRegistrado: z.boolean().default(true),
});

export type ProveedorFormValues = z.infer<typeof proveedorSchema>;

