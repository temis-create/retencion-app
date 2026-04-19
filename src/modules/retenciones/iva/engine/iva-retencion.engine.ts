/**
 * Motor de Reglas de Retención IVA — Orquestador Principal
 *
 * Punto de entrada del motor. Recibe un contexto enriquecido y devuelve
 * un resultado estructurado, auditable y con base legal trazable.
 *
 * Orden de evaluación:
 *   1. Validación de contexto mínimo
 *   2. Exclusiones absolutas
 *   3. Exclusiones condicionales
 *   4. Retención del 100%
 *   5. Retención general (75%)
 *
 * Providencia SNAT/2025/000054
 * Versión del motor: 2.0.0
 */

import {
  ContextoMotorRetencionIVA,
  ResultadoMotorRetencionIVA,
  CategoriaRegla,
  TipoResultadoRetencion,
} from "./iva-retencion.types";
import * as C from "./iva-retencion.codes";
import { getBaseLegal } from "./iva-retencion.legal-map";
import { evaluarExclusionesAbsolutas } from "./iva-retencion.exclusiones-absolutas";
import { evaluarExclusionesCondicionales } from "./iva-retencion.exclusiones-condicionales";
import { evaluarRetencionTotal } from "./iva-retencion.total";
import { evaluarRetencionGeneral, PORCENTAJE_RETENCION_GENERAL } from "./iva-retencion.general";

/** Versión semántica del motor — incrementar al cambiar reglas */
export const VERSION_MOTOR = "2.0.0";

// ─── Helpers internos ────────────────────────────────────────────────────────

function buildResultado(
  aplica: boolean,
  tipoResultado: TipoResultadoRetencion,
  porcentajeRetencion: number,
  impuestoIVA: number,
  motivoCodigo: string,
  categoriaRegla: CategoriaRegla,
  ctx: ContextoMotorRetencionIVA
): ResultadoMotorRetencionIVA {
  const montoRetenido = aplica
    ? Number((impuestoIVA * (porcentajeRetencion / 100)).toFixed(2))
    : 0;

  const baseLegal = getBaseLegal(motivoCodigo);

  return {
    aplica,
    tipoResultado,
    porcentajeRetencion,
    montoRetenido,
    impuestoIVA,
    motivoCodigo,
    motivoDescripcion: baseLegal.descripcion,
    categoriaRegla,
    baseLegal,
    snapshotNormativo: {
      porcentajeAplicado: porcentajeRetencion,
      unidadTributariaValor: ctx.metadataFiscal.unidadTributariaValor ?? null,
      montoOperacionUT: ctx.metadataFiscal.montoOperacionUT ?? null,
      versionMotor: VERSION_MOTOR,
    },
  };
}

function noAplica(
  motivoCodigo: string,
  ctx: ContextoMotorRetencionIVA
): ResultadoMotorRetencionIVA {
  return buildResultado(
    false,
    "NO_APLICA",
    0,
    ctx.compra.impuestoIVA,
    motivoCodigo,
    "EXCLUSION_ABSOLUTA",
    ctx
  );
}

// ─── Motor principal ─────────────────────────────────────────────────────────

/**
 * Evalúa la retención IVA para una compra usando el contexto enriquecido.
 *
 * @param ctx - Contexto completo de la operación
 * @returns Resultado estructurado con base legal y snapshot normativo
 */
export function ejecutarMotorRetencionIVA(
  ctx: ContextoMotorRetencionIVA
): ResultadoMotorRetencionIVA {
  const impuestoIVA = ctx.compra.impuestoIVA;

  // ══════════════════════════════════════════════════════════════════════
  // PASO 1. Validación de contexto mínimo
  // ══════════════════════════════════════════════════════════════════════

  // 1.1 La empresa debe ser agente de retención de IVA
  if (!ctx.empresa.agenteRetencionIVA) {
    return noAplica(C.CTX_NO_AGENTE_RETENCION, ctx);
  }

  // 1.2 La compra debe estar en estado REGISTRADA
  if (ctx.compra.estado !== "REGISTRADA") {
    return noAplica(C.CTX_COMPRA_NO_RETENIBLE, ctx);
  }

  // 1.3 El período fiscal no debe estar cerrado
  if (ctx.periodoFiscal.estado === "CERRADO") {
    return noAplica(C.CTX_PERIODO_CERRADO, ctx);
  }

  // 1.4 Tipo de documento: NC/ND no soportado en cálculo automático
  if (["NC", "ND"].includes(ctx.tipoDocumento.codigo)) {
    return noAplica(C.CTX_TIPO_DOC_NO_SOPORTADO, ctx);
  }

  // 1.5 Debe haber IVA causado
  if (!impuestoIVA || impuestoIVA <= 0) {
    return noAplica(C.CTX_SIN_IVA_CAUSADO, ctx);
  }

  // ══════════════════════════════════════════════════════════════════════
  // PASO 2. Exclusiones absolutas
  // ══════════════════════════════════════════════════════════════════════

  const exclusionAbsoluta = evaluarExclusionesAbsolutas(ctx);
  if (exclusionAbsoluta) {
    return buildResultado(
      false,
      "NO_APLICA",
      0,
      impuestoIVA,
      exclusionAbsoluta,
      "EXCLUSION_ABSOLUTA",
      ctx
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PASO 3. Exclusiones condicionales
  // ══════════════════════════════════════════════════════════════════════

  const exclusionCondicional = evaluarExclusionesCondicionales(ctx);
  if (exclusionCondicional) {
    return buildResultado(
      false,
      "NO_APLICA",
      0,
      impuestoIVA,
      exclusionCondicional,
      "EXCLUSION_CONDICIONAL",
      ctx
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PASO 4. Retención del 100%
  // ══════════════════════════════════════════════════════════════════════

  const retencionTotal = evaluarRetencionTotal(ctx);
  if (retencionTotal) {
    return buildResultado(
      true,
      "RETENCION_100",
      100,
      impuestoIVA,
      retencionTotal,
      "RETENCION_TOTAL",
      ctx
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // PASO 5. Retención general (75%)
  // ══════════════════════════════════════════════════════════════════════

  const codigoGeneral = evaluarRetencionGeneral();
  return buildResultado(
    true,
    "RETENCION_75",
    PORCENTAJE_RETENCION_GENERAL,
    impuestoIVA,
    codigoGeneral,
    "RETENCION_GENERAL",
    ctx
  );
}
