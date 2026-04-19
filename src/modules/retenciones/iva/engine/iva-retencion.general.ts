/**
 * Motor de Reglas de Retención IVA — Retención General 75% (Paso 5)
 *
 * Regla fallback: si no existe exclusión ni retención al 100%,
 * se aplica retención del 75% del impuesto causado.
 *
 * Fórmula: montoRetenido = impuestoIVA × 0.75
 *
 * Providencia SNAT/2025/000054, Artículo 4
 */

import * as C from "./iva-retencion.codes";

/** Porcentaje de retención general */
export const PORCENTAJE_RETENCION_GENERAL = 75;

/**
 * Retorna el código RETGEN_75_ORDINARIA.
 * Esta función existe por consistencia con los demás módulos
 * del motor (cada paso tiene su función evaluadora).
 */
export function evaluarRetencionGeneral(): string {
  return C.RETGEN_75_ORDINARIA;
}
