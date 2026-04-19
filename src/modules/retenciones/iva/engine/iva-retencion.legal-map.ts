/**
 * Motor de Reglas de Retención IVA — Mapa de Base Legal
 *
 * Vincula cada código de motivo con su base legal normativa.
 * Providencia SNAT/2025/000054
 */

import { BaseLegal } from "./iva-retencion.types";
import * as C from "./iva-retencion.codes";

const NORMA = "Providencia SNAT/2025/000054";

export const LEGAL_MAP: Record<string, BaseLegal> = {
  // ─── Exclusiones absolutas ──────────────────────────────────────────
  [C.EXC_NO_SUJETA]: {
    norma: NORMA,
    articulo: "Artículo 1",
    descripcion:
      "No se practicará retención cuando la operación no esté sujeta al Impuesto al Valor Agregado.",
  },
  [C.EXC_EXENTA]: {
    norma: NORMA,
    articulo: "Artículo 1",
    descripcion:
      "No se practicará retención cuando la operación esté exenta del Impuesto al Valor Agregado.",
  },
  [C.EXC_EXONERADA]: {
    norma: NORMA,
    articulo: "Artículo 1",
    descripcion:
      "No se practicará retención cuando la operación esté exonerada del Impuesto al Valor Agregado.",
  },
  [C.EXC_PROVEEDOR_FORMAL]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 2",
    descripcion:
      "No se practicará retención cuando el proveedor sea contribuyente formal del impuesto.",
  },

  // ─── Exclusiones condicionales ─────────────────────────────────────
  [C.EXC_AGENTE_PERCEPCION_TABACO_ALCOHOL]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 3",
    descripcion:
      "No se practicará retención cuando el proveedor sea agente de percepción del IVA en operaciones de venta de bebidas alcohólicas, fósforos, cigarrillos, tabacos y derivados del tabaco.",
  },
  [C.EXC_PERCEPCION_ANTICIPADA_IMPORTACION]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 4",
    descripcion:
      "No se practicará retención cuando el proveedor tenga percepción anticipada del IVA por importación debidamente acreditada.",
  },
  [C.EXC_VIATICO]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 5",
    descripcion:
      "No se practicará retención en operaciones pagadas por empleados por concepto de viáticos.",
  },
  [C.EXC_GASTO_REEMBOLSABLE]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 6",
    descripcion:
      "No se practicará retención en gastos reembolsables por cuenta del agente de retención.",
  },
  [C.EXC_MONTO_MINIMO_20UT]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 7",
    descripcion:
      "No se practicará retención cuando el monto de la operación no exceda de veinte (20) Unidades Tributarias, en los supuestos aplicables.",
  },
  [C.EXC_SERVICIO_PUBLICO_DOMICILIARIO]: {
    norma: NORMA,
    articulo: "Artículo 3, numeral 8",
    descripcion:
      "No se practicará retención en pagos de servicios públicos domiciliarios (electricidad, agua, aseo, telefonía) y conceptos afines.",
  },

  // ─── Retención total (100%) ────────────────────────────────────────
  [C.RET100_SIN_DESGLOSE_IVA]: {
    norma: NORMA,
    articulo: "Artículo 5, numeral 1",
    descripcion:
      "Se aplicará retención del 100% cuando el IVA no esté discriminado en la factura o nota de débito.",
  },
  [C.RET100_DOC_SIN_REQUISITOS]: {
    norma: NORMA,
    articulo: "Artículo 5, numeral 2",
    descripcion:
      "Se aplicará retención del 100% cuando la factura o nota de débito no cumpla los requisitos o formalidades establecidas.",
  },
  [C.RET100_PROVEEDOR_MARCADO_100]: {
    norma: NORMA,
    articulo: "Artículo 5, numeral 3",
    descripcion:
      "Se aplicará retención del 100% cuando del Portal Fiscal se desprenda que el proveedor está sujeto al 100%.",
  },
  [C.RET100_SIN_RIF]: {
    norma: NORMA,
    articulo: "Artículo 5, numeral 3",
    descripcion:
      "Se aplicará retención del 100% cuando del Portal Fiscal se desprenda que el proveedor no está inscrito en el RIF.",
  },
  [C.RET100_OPERACION_ART2_METALES_PIEDRAS]: {
    norma: NORMA,
    articulo: "Artículo 2",
    descripcion:
      "Se aplicará retención del 100% en las operaciones señaladas en el artículo 2 de la providencia (metales y piedras preciosas).",
  },

  // ─── Retención general ─────────────────────────────────────────────
  [C.RETGEN_75_ORDINARIA]: {
    norma: NORMA,
    articulo: "Artículo 4",
    descripcion:
      "Se practicará retención del 75% del impuesto causado como regla general.",
  },

  // ─── Contexto inválido ─────────────────────────────────────────────
  [C.CTX_NO_AGENTE_RETENCION]: {
    norma: NORMA,
    articulo: "Artículo 1",
    descripcion:
      "La empresa no está designada como agente de retención del IVA.",
  },
  [C.CTX_COMPRA_NO_RETENIBLE]: {
    norma: "",
    articulo: "",
    descripcion:
      "La compra no se encuentra en un estado válido para practicar retención (debe estar REGISTRADA).",
  },
  [C.CTX_PERIODO_CERRADO]: {
    norma: "",
    articulo: "",
    descripcion:
      "El período fiscal asociado está cerrado. No se permiten nuevas retenciones.",
  },
  [C.CTX_SIN_IVA_CAUSADO]: {
    norma: "",
    articulo: "",
    descripcion:
      "La compra no tiene impuesto IVA causado (monto ≤ 0).",
  },
  [C.CTX_TIPO_DOC_NO_SOPORTADO]: {
    norma: "",
    articulo: "",
    descripcion:
      "El tipo de documento (NC/ND) no es soportado para cálculo automático de retención en esta versión.",
  },
};

/**
 * Obtiene la base legal para un código de motivo.
 * Si el código no existe en el mapa, devuelve una base legal genérica.
 */
export function getBaseLegal(codigo: string): BaseLegal {
  return (
    LEGAL_MAP[codigo] ?? {
      norma: NORMA,
      articulo: "—",
      descripcion: `Código de motivo no mapeado: ${codigo}`,
    }
  );
}
