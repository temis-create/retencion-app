/**
 * Motor de Reglas de Retención IVA — Códigos Internos
 *
 * Códigos estables que identifican cada regla del motor.
 * Cada código tiene un significado normativo preciso.
 *
 * Providencia SNAT/2025/000054
 */

// ─── 6.1 Exclusiones absolutas ───────────────────────────────────────────────

/** Operación no sujeta a IVA */
export const EXC_NO_SUJETA = "EXC_NO_SUJETA";

/** Operación exenta de IVA */
export const EXC_EXENTA = "EXC_EXENTA";

/** Operación exonerada de IVA */
export const EXC_EXONERADA = "EXC_EXONERADA";

/** Proveedor contribuyente formal */
export const EXC_PROVEEDOR_FORMAL = "EXC_PROVEEDOR_FORMAL";

// ─── 6.2 Exclusiones condicionales ──────────────────────────────────────────

/** Proveedor agente de percepción en rubros de tabaco/alcohol */
export const EXC_AGENTE_PERCEPCION_TABACO_ALCOHOL = "EXC_AGENTE_PERCEPCION_TABACO_ALCOHOL";

/** Proveedor con percepción anticipada de IVA por importación */
export const EXC_PERCEPCION_ANTICIPADA_IMPORTACION = "EXC_PERCEPCION_ANTICIPADA_IMPORTACION";

/** Operación pagada como viáticos de empleados */
export const EXC_VIATICO = "EXC_VIATICO";

/** Gasto reembolsable por cuenta del agente de retención */
export const EXC_GASTO_REEMBOLSABLE = "EXC_GASTO_REEMBOLSABLE";

/** Monto de la operación no excede 20 Unidades Tributarias */
export const EXC_MONTO_MINIMO_20UT = "EXC_MONTO_MINIMO_20UT";

/** Servicio público domiciliario o categoría afín excluida */
export const EXC_SERVICIO_PUBLICO_DOMICILIARIO = "EXC_SERVICIO_PUBLICO_DOMICILIARIO";

// ─── 6.3 Retención total (100%) ─────────────────────────────────────────────

/** IVA no discriminado en factura o nota de débito */
export const RET100_SIN_DESGLOSE_IVA = "RET100_SIN_DESGLOSE_IVA";

/** Documento sin requisitos o formalidades fiscales */
export const RET100_DOC_SIN_REQUISITOS = "RET100_DOC_SIN_REQUISITOS";

/** Proveedor marcado al 100% en Portal Fiscal del SENIAT */
export const RET100_PROVEEDOR_MARCADO_100 = "RET100_PROVEEDOR_MARCADO_100";

/** Proveedor sin RIF registrado / válido */
export const RET100_SIN_RIF = "RET100_SIN_RIF";

/** Operación del artículo 2 (metales preciosos, piedras preciosas) */
export const RET100_OPERACION_ART2_METALES_PIEDRAS = "RET100_OPERACION_ART2_METALES_PIEDRAS";

// ─── 6.4 Retención general ───────────────────────────────────────────────────

/** Retención ordinaria del 75% del impuesto causado */
export const RETGEN_75_ORDINARIA = "RETGEN_75_ORDINARIA";

// ─── Contexto inválido ──────────────────────────────────────────────────────

/** La empresa no actúa como agente de retención de IVA */
export const CTX_NO_AGENTE_RETENCION = "CTX_NO_AGENTE_RETENCION";

/** La compra no está en estado válido para retención */
export const CTX_COMPRA_NO_RETENIBLE = "CTX_COMPRA_NO_RETENIBLE";

/** El período fiscal ha sido cerrado */
export const CTX_PERIODO_CERRADO = "CTX_PERIODO_CERRADO";

/** La compra no tiene IVA causado */
export const CTX_SIN_IVA_CAUSADO = "CTX_SIN_IVA_CAUSADO";

/** Tipo de documento no soportado para retención automática (NC/ND) */
export const CTX_TIPO_DOC_NO_SOPORTADO = "CTX_TIPO_DOC_NO_SOPORTADO";
