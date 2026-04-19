/**
 * Motor de Reglas de Retención IVA — Exclusiones Condicionales (Paso 3)
 *
 * Estas reglas dependen de flags o metadata adicional de la operación.
 * Se evalúan después de las exclusiones absolutas.
 *
 * Providencia SNAT/2025/000054
 */

import { ContextoMotorRetencionIVA, ReglaRetencionIVA } from "./iva-retencion.types";
import * as C from "./iva-retencion.codes";

// ─── Rubros que califican como percepción por tabaco/alcohol ─────────────────

const RUBROS_PERCEPCION_TABACO_ALCOHOL = [
  "BEBIDAS_ALCOHOLICAS",
  "FOSFOROS",
  "CIGARRILLOS",
  "TABACOS",
  "DERIVADOS_TABACO",
];

// ─── Reglas ──────────────────────────────────────────────────────────────────

const reglasExclusionesCondicionales: ReglaRetencionIVA[] = [
  {
    codigo: C.EXC_AGENTE_PERCEPCION_TABACO_ALCOHOL,
    categoria: "EXCLUSION_CONDICIONAL",
    evaluar: (ctx) => {
      if (!ctx.metadataFiscal.esAgentePercepcionIVA) return false;
      const rubro = ctx.metadataFiscal.rubroPercepcion?.toUpperCase() ?? "";
      return RUBROS_PERCEPCION_TABACO_ALCOHOL.includes(rubro);
    },
  },
  {
    codigo: C.EXC_PERCEPCION_ANTICIPADA_IMPORTACION,
    categoria: "EXCLUSION_CONDICIONAL",
    evaluar: (ctx) => ctx.metadataFiscal.tienePercepcionAnticipadaIVA,
  },
  {
    codigo: C.EXC_VIATICO,
    categoria: "EXCLUSION_CONDICIONAL",
    evaluar: (ctx) => ctx.metadataFiscal.esViatico,
  },
  {
    codigo: C.EXC_GASTO_REEMBOLSABLE,
    categoria: "EXCLUSION_CONDICIONAL",
    evaluar: (ctx) => ctx.metadataFiscal.esGastoReembolsable,
  },
  {
    codigo: C.EXC_MONTO_MINIMO_20UT,
    categoria: "EXCLUSION_CONDICIONAL",
    evaluar: (ctx) => {
      const valorUT = ctx.metadataFiscal.unidadTributariaValor;
      if (!valorUT || valorUT <= 0) return false;

      const montoOperacion = ctx.compra.totalFactura;
      const montoEnUT = montoOperacion / valorUT;
      return montoEnUT <= 20;
    },
  },
  {
    codigo: C.EXC_SERVICIO_PUBLICO_DOMICILIARIO,
    categoria: "EXCLUSION_CONDICIONAL",
    evaluar: (ctx) => ctx.metadataFiscal.esServicioPublicoDomiciliario,
  },
];

// ─── Evaluación ──────────────────────────────────────────────────────────────

/**
 * Evalúa las exclusiones condicionales.
 * Devuelve el código de la primera regla que aplique, o null si ninguna aplica.
 */
export function evaluarExclusionesCondicionales(
  ctx: ContextoMotorRetencionIVA
): string | null {
  for (const regla of reglasExclusionesCondicionales) {
    if (regla.evaluar(ctx)) {
      return regla.codigo;
    }
  }
  return null;
}
