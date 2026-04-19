import { Decimal } from "decimal.js";

/**
 * Tabla Tarifa N° 2 (2025)
 * - Hasta 2000 UT: 15%, sustraendo 0 UT
 * - 2001 a 3000 UT: 22%, sustraendo 140 UT
 * - 3001 UT en adelante: 34%, sustraendo 500 UT
 */
export function calcularRetencionTarifa2(baseCalculoBs: number, valorUT: number) {
  const baseUT = new Decimal(baseCalculoBs).div(valorUT);
  let porcentaje = 0;
  let sustraendoUT = 0;

  if (baseUT.lte(2000)) {
    porcentaje = 15;
    sustraendoUT = 0;
  } else if (baseUT.lte(3000)) {
    porcentaje = 22;
    sustraendoUT = 140;
  } else {
    porcentaje = 34;
    sustraendoUT = 500;
  }

  const retencionBrutaBs = new Decimal(baseCalculoBs).mul(porcentaje).div(100);
  const sustraendoBs = new Decimal(sustraendoUT).mul(valorUT);
  const retencionNetaBs = retencionBrutaBs.minus(sustraendoBs);

  return {
    montoRetenido: Decimal.max(retencionNetaBs, 0).toNumber(),
    porcentajeAplicado: porcentaje,
    sustraendoBs: sustraendoBs.toNumber(),
    tramoUT: baseUT.toNumber()
  };
}
