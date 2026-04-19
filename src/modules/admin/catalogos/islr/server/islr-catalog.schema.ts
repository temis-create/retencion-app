import { z } from "zod";

export const ConceptoISLRSchema = z.object({
  id: z.number().optional(),
  codigoSeniat: z.string().nullable().optional(),
  numeral: z.string().min(1, "El numeral es requerido"),
  literal: z.string().nullable().optional(),
  concepto: z.string().min(1, "El concepto es requerido"),
  sujeto: z.string().min(1, "El sujeto es requerido"),
  baseImponiblePorcentaje: z.number().nullable().optional(),
  tipoTarifa: z.string().min(1, "El tipo de tarifa es requerido"),
  porcentajeRetencion: z.number().nullable().optional(),
  montoMinimoBs: z.number().min(0).default(0),
  sustraendoBs: z.number().min(0).default(0),
  usaMontoMinimo: z.boolean().default(false),
  usaSustraendo: z.boolean().default(false),
  requiereCalculoEspecial: z.boolean().default(false),
  formulaEspecial: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  activo: z.boolean().default(true),
});

export type ConceptoISLRFormValues = z.infer<typeof ConceptoISLRSchema>;
