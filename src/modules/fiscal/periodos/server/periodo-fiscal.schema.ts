import { z } from "zod";

export const periodoFiscalSchema = z
  .object({
    empresaId: z.string().min(1, "Debe seleccionar una empresa"),
    anio: z
      .number()
      .int()
      .min(2020, "El año debe ser 2020 o posterior")
      .max(2100, "El año no puede superar 2100"),
    mes: z
      .number()
      .int()
      .min(1, "El mes debe estar entre 1 y 12")
      .max(12, "El mes debe estar entre 1 y 12"),
    tipoImpuesto: z.enum(["IVA", "ISLR"]),
    frecuencia: z.enum(["MENSUAL", "QUINCENAL"]),
    subperiodo: z.number().int().nullable().optional(),
    fechaInicio: z.string().min(1, "La fecha de inicio es requerida"),
    fechaFin: z.string().min(1, "La fecha de fin es requerida"),
  })
  .refine(
    (data) => {
      if (data.frecuencia === "QUINCENAL") {
        return data.subperiodo === 1 || data.subperiodo === 2;
      }
      return true;
    },
    {
      message: "El subperíodo debe ser 1 o 2 para períodos quincenales",
      path: ["subperiodo"],
    }
  )
  .refine(
    (data) => {
      if (data.fechaInicio && data.fechaFin) {
        return new Date(data.fechaInicio) <= new Date(data.fechaFin);
      }
      return true;
    },
    {
      message: "La fecha de inicio debe ser anterior o igual a la de fin",
      path: ["fechaFin"],
    }
  );

export type PeriodoFiscalFormValues = z.infer<typeof periodoFiscalSchema>;

/**
 * Genera el código de período de forma determinista.
 * Formato:
 *   MENSUAL  IVA  → 2026-03-IVA-M
 *   QUINCENAL IVA 1 → 2026-03-IVA-Q1
 *   MENSUAL ISLR → 2026-03-ISLR-M
 */
export function generarCodigoPeriodo(
  anio: number,
  mes: number,
  tipoImpuesto: "IVA" | "ISLR",
  frecuencia: "MENSUAL" | "QUINCENAL",
  subperiodo?: number | null
): string {
  const mesStr = String(mes).padStart(2, "0");
  const sufijo = frecuencia === "QUINCENAL" ? `Q${subperiodo}` : "M";
  return `${anio}-${mesStr}-${tipoImpuesto}-${sufijo}`;
}
