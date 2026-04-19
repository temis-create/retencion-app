/**
 * Motor de Reglas de Retención IVA — Retención Total 100% (Paso 4)
 *
 * Estas reglas aplican retención del 100% del impuesto causado.
 * Se evalúan después de las exclusiones.
 *
 * Providencia SNAT/2025/000054
 */

import { ContextoMotorRetencionIVA, ReglaRetencionIVA } from "./iva-retencion.types";
import * as C from "./iva-retencion.codes";

// ─── Reglas ──────────────────────────────────────────────────────────────────

const reglasRetencionTotal: ReglaRetencionIVA[] = [
  {
    codigo: C.RET100_SIN_DESGLOSE_IVA,
    categoria: "RETENCION_TOTAL",
    evaluar: (ctx) => !ctx.metadataFiscal.ivaDiscriminado,
  },
  {
    codigo: C.RET100_DOC_SIN_REQUISITOS,
    categoria: "RETENCION_TOTAL",
    evaluar: (ctx) => !ctx.metadataFiscal.cumpleRequisitosFormales,
  },
  {
    codigo: C.RET100_SIN_RIF,
    categoria: "RETENCION_TOTAL",
    evaluar: (ctx) => !ctx.metadataFiscal.rifRegistrado,
  },
  {
    codigo: C.RET100_PROVEEDOR_MARCADO_100,
    categoria: "RETENCION_TOTAL",
    evaluar: (ctx) => ctx.metadataFiscal.proveedorMarcadoRetencion100,
  },
  {
    codigo: C.RET100_OPERACION_ART2_METALES_PIEDRAS,
    categoria: "RETENCION_TOTAL",
    evaluar: (ctx) => ctx.metadataFiscal.esOperacionArticulo2RetencionTotal,
  },
];

// ─── Evaluación ──────────────────────────────────────────────────────────────

/**
 * Evalúa las reglas de retención del 100%.
 * Devuelve el código de la primera regla que aplique, o null si ninguna aplica.
 */
export function evaluarRetencionTotal(
  ctx: ContextoMotorRetencionIVA
): string | null {
  for (const regla of reglasRetencionTotal) {
    if (regla.evaluar(ctx)) {
      return regla.codigo;
    }
  }
  return null;
}
