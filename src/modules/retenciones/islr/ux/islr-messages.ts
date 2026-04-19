import { ISLR_CODES } from "../engine/islr-retencion.codes";

/**
 * Mapeo de códigos internos del motor ISLR a mensajes comprensibles para el usuario.
 */
export const ISLR_UX_MESSAGES: Record<string, { title: string; explanation: string; variant: 'info' | 'warning' | 'success' | 'error' }> = {
  // --- NO APLICA (Motivos) ---
  [ISLR_CODES.NOAPL_SIN_CONCEPTO]: {
    title: "Sin Concepto Seleccionado",
    explanation: "Selecciona el tipo de operación para que el sistema pueda determinar la retención ISLR.",
    variant: 'warning'
  },
  [ISLR_CODES.NOAPL_CONCEPTO_INACTIVO]: {
    title: "Concepto Inactivo",
    explanation: "Este concepto ISLR ya no está vigente según la normativa configurada.",
    variant: 'error'
  },
  [ISLR_CODES.NOAPL_MONTO_CERO]: {
    title: "Monto en Cero",
    explanation: "El pago no tiene base de cálculo imponible.",
    variant: 'info'
  },
  [ISLR_CODES.NOAPL_NO_SUPERA_MINIMO]: {
    title: "Monto Exento (Mínimo)",
    explanation: "No aplica retención porque el monto es inferior al umbral mínimo exigido para este concepto (Base < Mínimo).",
    variant: 'info'
  },
  [ISLR_CODES.NOAPL_PERIODO_CERRADO]: {
    title: "Período Fiscal Cerrado",
    explanation: "No se pueden realizar cálculos en un período que ya ha sido declarado o cerrado.",
    variant: 'error'
  },
  [ISLR_CODES.NOAPL_DATOS_INCOMPLETOS]: {
    title: "Datos Incompletos",
    explanation: "Faltan datos del proveedor (Sujeto Pasivo) para poder determinar la tarifa legal.",
    variant: 'warning'
  },

  // --- EXITOSOS ---
  [ISLR_CODES.RET_SIMPLE_PORCENTAJE]: {
    title: "Retención Estándar",
    explanation: "Se aplicó el porcentaje fijo definido en el catálogo para este tipo de beneficiario.",
    variant: 'success'
  },
  [ISLR_CODES.RET_TARIFA_2]: {
    title: "Cálculo Tarifa N° 2",
    explanation: "Se aplicó el cálculo progresivo según el tramo de Unidades Tributarias correspondiente.",
    variant: 'success'
  },
  [ISLR_CODES.RET_FORMULA_ESPECIAL]: {
    title: "Cálculo Especial",
    explanation: "Se utilizó una fórmula de cálculo específica según la naturaleza de la operación (ej. desglose de IVA).",
    variant: 'success'
  }
};

/**
 * Obtiene el mensaje UX basado en un código.
 */
export function getISLRLabel(code: string | null) {
  if (!code) return { title: "Pendiente", explanation: "Esperando cálculo...", variant: 'info' };
  return ISLR_UX_MESSAGES[code] || { title: "Calculada", explanation: "Retención procesada.", variant: 'success' };
}
