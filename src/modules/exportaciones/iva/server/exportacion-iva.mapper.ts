import { RetencionIVA, Compra, Proveedor, Empresa, ComprobanteIVA, PeriodoFiscal } from "@prisma/client";
import { format } from "date-fns";

export class ExportacionIVAMapper {
  /**
   * Mapea una retencin a una lnea de texto delimitada por tabuladores (formato SENIAT TXT)
   */
  static mapRetencionToTxtLine(
    retencion: RetencionIVA & {
      compra: Compra & {
        tipoDocumento: { codigo: string };
        documentoAfectado: { numeroFactura: string | null } | null;
      };
      comprobanteIVA: ComprobanteIVA;
    },
    empresa: Empresa,
    periodo: PeriodoFiscal,
    proveedor: Proveedor
  ): string {
    const fields = [
      // A. RIF del Agente (Sin guiones)
      empresa.rif.replace(/-/g, ""),
      
      // B. Perodo Impositivo (AAAAMM)
      `${periodo.anio}${periodo.mes.toString().padStart(2, "0")}`,
      
      // C. Fecha de Factura (AAAA-MM-DD)
      format(retencion.compra.fechaFactura, "yyyy-MM-dd"),
      
      // D. Tipo de Operacin (C = Compra)
      "C",
      
      // E. Tipo de Documento
      retencion.compra.tipoDocumento.codigo,
      
      // F. RIF del Proveedor (Sin guiones)
      proveedor.rif.replace(/-/g, ""),
      
      // G. Nmero de Documento (Factura)
      retencion.compra.numeroFactura || "",
      
      // H. Nmero de Control
      retencion.compra.numeroControl || "",
      
      // I. Monto Total (Con 2 decimales)
      retencion.compra.totalFactura.toFixed(2),
      
      // J. Base Imponible
      retencion.compra.montoBase.toFixed(2),
      
      // K. Monto Retenido
      retencion.montoRetenido.toFixed(2),
      
      // L. Documento Afectado (Si es nota de crdito/dbito)
      retencion.compra.documentoAfectado?.numeroFactura || "0",
      
      // M. Nmero de Comprobante
      retencion.comprobanteIVA.numeroComprobante,
      
      // N. Monto Exento
      retencion.compra.montoExento.toFixed(2),
      
      // O. Alcuota (Porcentaje IVA)
      retencion.compra.porcentajeAlicuotaSnapshot?.toFixed(2) || "0.00",
      
      // P. Nmero de Expediente (0 por ahora)
      "0"
    ];

    return fields.join("\t");
  }
}
