/**
 * Motor de Reglas de Retención IVA — Exclusiones Absolutas (Paso 2)
 *
 * Estas reglas bloquean cualquier retención de forma incondicional.
 * Se evalúan antes de cualquier otra lógica.
 *
 * Providencia SNAT/2025/000054
 */

import { ContextoMotorRetencionIVA, ReglaRetencionIVA } from "./iva-retencion.types";
import * as C from "./iva-retencion.codes";

// ─── Reglas ──────────────────────────────────────────────────────────────────

const reglasExclusionesAbsolutas: ReglaRetencionIVA[] = [
  {
    codigo: C.EXC_NO_SUJETA,
    categoria: "EXCLUSION_ABSOLUTA",
    evaluar: (ctx) => ctx.metadataFiscal.operacionNoSujeta,
  },
  {
    codigo: C.EXC_EXENTA,
    categoria: "EXCLUSION_ABSOLUTA",
    evaluar: (ctx) => ctx.metadataFiscal.operacionExenta,
  },
  {
    codigo: C.EXC_EXONERADA,
    categoria: "EXCLUSION_ABSOLUTA",
    evaluar: (ctx) => ctx.metadataFiscal.operacionExonerada,
  },
  {
    codigo: C.EXC_PROVEEDOR_FORMAL,
    categoria: "EXCLUSION_ABSOLUTA",
    evaluar: (ctx) => ctx.proveedor.tipoContribuyente === "FORMAL",
  },
];

// ─── Evaluación ──────────────────────────────────────────────────────────────

/**
 * Evalúa las exclusiones absolutas.
 * Devuelve el código de la primera regla que aplique, o null si ninguna aplica.
 */
export function evaluarExclusionesAbsolutas(
  ctx: ContextoMotorRetencionIVA
): string | null {
  for (const regla of reglasExclusionesAbsolutas) {
    if (regla.evaluar(ctx)) {
      return regla.codigo;
    }
  }
  return null;
}
