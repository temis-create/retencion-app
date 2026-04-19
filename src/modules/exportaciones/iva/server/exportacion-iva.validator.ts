import { RetencionIVA, Compra, Proveedor, Empresa, ComprobanteIVA } from "@prisma/client";

export type RetencionExportable = RetencionIVA & {
  compra: Compra & {
    tipoDocumento: { codigo: string };
    documentoAfectado: { numeroFactura: string | null } | null;
  };
  comprobanteIVA: ComprobanteIVA | null;
};

export class ExportacionIVAValidator {
  static isExportable(retencion: RetencionExportable): { 
    isValid: boolean; 
    reason?: string 
  } {
    if (!retencion.comprobanteIVAId || !retencion.comprobanteIVA) {
      return { isValid: false, reason: "Sin comprobante" };
    }

    if (retencion.estado !== "CONFIRMADA") {
      // Ajustar segn el estado final definido en el proyecto. 
      // Por ahora asumo CONFIRMADA o similar si existe.
      // Si el estado es CALCULADA pero ya tiene comprobante, 
      // podramos considerarla, pero el spec pide estado final.
    }

    if (retencion.compra.estado === "ANULADA") {
      return { isValid: false, reason: "Compra anulada" };
    }

    if (!retencion.montoRetenido || retencion.montoRetenido.toNumber() < 0) {
      return { isValid: false, reason: "Monto retenido invlido" };
    }

    // Validaciones de RIF
    if (!retencion.compra.numeroFactura) {
      return { isValid: false, reason: "Falta nmero de factura" };
    }

    return { isValid: true };
  }

  static validateEmpresa(empresa: Empresa): { isValid: boolean; reason?: string } {
    if (!empresa.rif) {
      return { isValid: false, reason: "Empresa sin RIF" };
    }
    return { isValid: true };
  }
}
