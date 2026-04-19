import { Decimal } from "decimal.js";

/**
 * Motor de Fórmulas Especiales ISLR
 */
export function calcularBaseEspecialISLR(
  formula: string,
  montoPago: number,
  metadata: { ivaRate?: number } = { ivaRate: 16 }
): number {
  if (!formula) return montoPago;

  // Caso: Pago de tarjetas de crédito o consumo
  // PAGO / ((IVA_RATE / 100) + 1)
  if (formula.includes("IVA_RATE")) {
    const ivaRate = metadata.ivaRate || 16;
    const factor = new Decimal(ivaRate).div(100).plus(1);
    return new Decimal(montoPago).div(factor).toNumber();
  }

  return montoPago;
}
