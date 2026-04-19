import { TipoPersona, TipoResidencia } from "@prisma/client";

export interface EvaluacionISLR {
  aplica: boolean;
  motivoNoAplica?: string;
  pagoId: string;
  conceptoId: number;
  baseCalculo: number; // Base bruta antes de aplicar el concepto
  porcentajeBaseImponible: number;
  montoSujetoRetencion: number; // baseCalculo * porcentajeBaseImponible
  tarifaAplicada: number;
  sustraendo: number;
  montoRetenido: number;
  valorUT: number;
  usaTarifa2?: boolean;
}

/**
 * Reglas de negocio para el cálculo de retención ISLR en Venezuela 2025.
 * Basado en el catálogo global de conceptos.
 */
export function evaluarRetencionISLR(
  pago: any, // Pago con relaciones: proveedor, conceptoISLR, pagoCompras.compra
  valorUT: number
): EvaluacionISLR {
  const pagoId = pago.id;

  // 1. Validaciones básicas de estado
  if (pago.estado === "ANULADO") {
    return { 
      aplica: false, 
      motivoNoAplica: "El pago está anulado.", 
      ...defaultValues(pagoId, valorUT) 
    };
  }

  const { proveedor, conceptoISLR } = pago;
  if (!conceptoISLR) {
    return { 
      aplica: false, 
      motivoNoAplica: "El pago no tiene un concepto ISLR asociado.", 
      ...defaultValues(pagoId, valorUT) 
    };
  }

  // 1.1 Validar que el sujeto del concepto coincida con el proveedor (simplificado)
  // En una versión más avanzada, la UI ya filtra esto, pero aquí validamos.
  
  // 2. Determinar Tarifa y Base
  let tarifa = conceptoISLR.tipoTarifa === "PORCENTAJE" ? Number(conceptoISLR.porcentajeRetencion) / 100 : 0;
  const pctBase = Number(conceptoISLR.baseImponiblePorcentaje) / 100;

  // 3. Calcular Base Imponible ISLR
  let baseImponibleTotal = 0;
  if (pago.pagoCompras && pago.pagoCompras.length > 0) {
    for (const pc of pago.pagoCompras) {
      const totalFactura = Number(pc.compra.totalFactura);
      const montoBase = Number(pc.compra.montoBase);
      const montoAplicado = Number(pc.montoAplicado);
      
      if (totalFactura > 0) {
        const proporcion = montoAplicado / totalFactura;
        baseImponibleTotal += proporcion * montoBase;
      } else {
        baseImponibleTotal += montoAplicado;
      }
    }
  } else {
    baseImponibleTotal = Number(pago.montoTotal);
  }

  // Redondear a 2 decimales
  baseImponibleTotal = Math.round(baseImponibleTotal * 100) / 100;
  
  // Aplicar fórmula especial si se requiere (p.ej. Tarjetas de crédito)
  let baseSujeta = baseImponibleTotal;
  if (conceptoISLR.requiereCalculoEspecial && conceptoISLR.numeral === "14") {
    // La base para tarjetas es monto_pagado / ((alicuota_iva / 100) + 1)
    // Para simplificar aquí, asumimos que baseImponibleTotal ya es el total pagado 
    // y extraemos el IVA (asumiendo 16% si no hay contexto de factura específica)
    // En un sistema real usaríamos la alícuota de la factura.
    baseSujeta = baseImponibleTotal / 1.16; 
  }

  const montoSujeto = Math.round((baseSujeta * pctBase) * 100) / 100;

  // 4. Validar Mínimo Exento
  const montoMinimo = Number(conceptoISLR.montoMinimoBs);

  if (conceptoISLR.usaMontoMinimo && montoSujeto < montoMinimo) {
    return {
      aplica: false,
      motivoNoAplica: `El monto sujeto (Bs. ${montoSujeto.toFixed(2)}) es inferior al mínimo exento (Bs. ${montoMinimo.toFixed(2)}).`,
      ...defaultValues(pagoId, valorUT, conceptoISLR.id, baseImponibleTotal, pctBase * 100, montoSujeto, tarifa * 100)
    };
  }

  // 5. Calcular Retención y Sustraendo
  let montoRetenido = 0;
  let sustraendo = 0;

  if (conceptoISLR.tipoTarifa === "TARIFA_2") {
    // Tarifa 2: Acumulativa por tramos de UT
    // 0-2000 UT -> 15% (sust 0)
    // 2001-3000 UT -> 22% (sust 140 UT)
    // >3000 UT -> 34% (sust 500 UT)
    const montoUT = montoSujeto / valorUT;
    
    if (montoUT <= 2000) {
      tarifa = 0.15;
      sustraendo = 0;
    } else if (montoUT <= 3000) {
      tarifa = 0.22;
      sustraendo = 140 * valorUT;
    } else {
      tarifa = 0.34;
      sustraendo = 500 * valorUT;
    }
    montoRetenido = (montoSujeto * tarifa) - sustraendo;
  } else {
    // Tarifa Porcentual Fija
    sustraendo = conceptoISLR.usaSustraendo ? Number(conceptoISLR.sustraendoBs) : 0;
    
    // Si la UT cambió respecto a la del catálogo (43), recalculamos el sustraendo proporcionalmente
    if (conceptoISLR.usaSustraendo && valorUT !== 43) {
        // sustraendo_nuevo = (valorUT_nuevo / 43) * sustraendo_catalogo
        sustraendo = (valorUT / 43) * sustraendo;
    }
    
    montoRetenido = (montoSujeto * tarifa) - sustraendo;
  }

  if (montoRetenido < 0) montoRetenido = 0;
  montoRetenido = Math.round(montoRetenido * 100) / 100;

  if (montoRetenido === 0) {
    return {
      aplica: false,
      motivoNoAplica: "El cálculo resultó en un monto de retención cero.",
      ...defaultValues(pagoId, valorUT, conceptoISLR.id, baseImponibleTotal, pctBase * 100, montoSujeto, tarifa * 100, sustraendo)
    };
  }

  return {
    aplica: true,
    pagoId,
    conceptoId: conceptoISLR.id,
    baseCalculo: baseImponibleTotal,
    porcentajeBaseImponible: pctBase * 100,
    montoSujetoRetencion: montoSujeto,
    tarifaAplicada: tarifa * 100,
    sustraendo,
    montoRetenido,
    valorUT,
    usaTarifa2: conceptoISLR.tipoTarifa === "TARIFA_2"
  };
}

function defaultValues(
  pagoId: string, 
  valorUT: number,
  conceptoId = 0, 
  base = 0, 
  pctBase = 0, 
  sujeto = 0, 
  tarifa = 0,
  sustraendo = 0
): Omit<EvaluacionISLR, 'aplica' | 'motivoNoAplica'> {
  return {
    pagoId,
    conceptoId,
    baseCalculo: base,
    porcentajeBaseImponible: pctBase,
    montoSujetoRetencion: sujeto,
    tarifaAplicada: tarifa,
    sustraendo,
    montoRetenido: 0,
    valorUT
  };
}
