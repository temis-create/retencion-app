import { prisma } from "@/lib/prisma";
import { ISLREngineService } from "./islr-engine-service";

/**
 * Servicio para la gestión de retenciones ISLR.
 * Refactorizado para usar el motor 2025.
 */

export async function getRetencionISLRByPago(pagoId: string) {
  const retencion = await prisma.retencionISLR.findFirst({
    where: { pagoId },
    include: {
      comprobanteISLR: true,
      periodoFiscal: true
    }
  });

  if (!retencion) return null;

  // Sanitizar decimales para la UI
  return {
    ...retencion,
    valorUTSnapshot: Number(retencion.valorUTSnapshot),
    baseCalculoSnapshot: Number(retencion.baseCalculoSnapshot),
    porcentajeBaseSnapshot: Number(retencion.porcentajeBaseSnapshot),
    tarifaAplicadaSnapshot: Number(retencion.tarifaAplicadaSnapshot),
    sustraendoSnapshot: Number(retencion.sustraendoSnapshot),
    montoRetenido: Number(retencion.montoRetenido),
  };
}

/**
 * Método heredado refactorizado para usar el nuevo motor.
 */
export async function calculateAndSaveRetencionISLR(pagoId: string, tenantId: string) {
  try {
    const result = await ISLREngineService.calcularYGuardarRetencion(pagoId, tenantId);
    return {
      success: true,
      aplica: Number(result.montoRetenido) > 0,
      evaluacion: result // Para compatibilidad
    };
  } catch (error: any) {
    console.error("Error en calculateAndSaveRetencionISLR:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
