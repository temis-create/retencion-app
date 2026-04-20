import { z } from "zod";

export const empresaSchema = z.object({
  nombreFiscal: z.string().min(3, "El nombre fiscal debe tener al menos 3 caracteres"),
  rif: z.string().regex(/^[JGVEP]-\d{8}-\d$/, "Formato de RIF inválido (ej: J-12345678-9)"),
  direccion: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  agenteRetencionIVA: z.boolean().default(false),
  agenteRetencionISLR: z.boolean().default(false),
  logoUrl: z.string().optional().nullable(),
  proximoCorrelativoIVA: z.number().int().min(1).default(1),
  proximoCorrelativoISLR: z.number().int().min(1).default(1),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
