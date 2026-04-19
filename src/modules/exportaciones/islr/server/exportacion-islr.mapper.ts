/**
 * Mapper para transformar datos de retenciones ISLR a formato exportable.
 */

export interface LineaExportacionISLR {
    rifAgente: string;
    nombreAgente: string;
    periodo: string;
    numeroComprobante: string;
    fechaEmision: string;
    rifBeneficiario: string;
    nombreBeneficiario: string;
    tipoPersona: string;
    codigoConcepto: string;
    descripcionConcepto: string;
    montoPagado: number;
    baseRetenible: number;
    porcentaje: number;
    montoRetenido: number;
}

export function mapRetencionToLineaExport(retencion: any): LineaExportacionISLR {
    const comprobante = retencion.comprobanteISLR;
    const pago = retencion.pago;
    const proveedor = retencion.comprobanteISLR?.proveedor || pago.proveedor;
    const empresa = retencion.comprobanteISLR?.empresa || pago.empresa;

    return {
        rifAgente: empresa.rif,
        nombreAgente: empresa.nombreFiscal,
        periodo: retencion.periodoFiscal.codigoPeriodo,
        numeroComprobante: comprobante?.numeroComprobante || "S/N",
        fechaEmision: comprobante ? new Date(comprobante.fechaEmision).toLocaleDateString('es-VE') : "N/A",
        rifBeneficiario: proveedor.rif,
        nombreBeneficiario: proveedor.nombre,
        tipoPersona: proveedor.tipologiaPersona || "PNRE", // Fallback si no está definido
        codigoConcepto: retencion.codigoConceptoSnapshot,
        descripcionConcepto: retencion.descripcionConceptoSnapshot,
        montoPagado: Number(retencion.pago.montoTotal), 
        baseRetenible: Number(retencion.baseCalculoSnapshot),
        porcentaje: Number(retencion.tarifaAplicadaSnapshot),
        montoRetenido: Number(retencion.montoRetenido)
    };
}

export function formatToCSV(lineas: LineaExportacionISLR[]): string {
    const headers = [
        "RIF Agente", "Nombre Empresa", "Periodo", "Nro Comprobante", "Fecha Emision",
        "RIF Beneficiario", "Nombre Beneficiario", "Tipo Persona", "Codigo Concepto",
        "Descripcion", "Monto Pagado", "Base Retenible", "%", "Monto Retenido"
    ];

    const rows = lineas.map(l => [
        l.rifAgente,
        `"${l.nombreAgente}"`,
        l.periodo,
        l.numeroComprobante,
        l.fechaEmision,
        l.rifBeneficiario,
        `"${l.nombreBeneficiario}"`,
        l.tipoPersona,
        l.codigoConcepto,
        `"${l.descripcionConcepto}"`,
        l.montoPagado.toFixed(2),
        l.baseRetenible.toFixed(2),
        l.porcentaje.toFixed(2),
        l.montoRetenido.toFixed(2)
    ].join(","));

    return [headers.join(","), ...rows].join("\n");
}

export function formatToTXT(lineas: LineaExportacionISLR[]): string {
    // Formato delimitado por tabulaciones (Tab-Separated)
    const rows = lineas.map(l => [
        l.rifAgente.padEnd(12),
        l.periodo,
        l.numeroComprobante.padEnd(16),
        l.fechaEmision,
        l.rifBeneficiario.padEnd(12),
        l.codigoConcepto.padEnd(5),
        l.montoPagado.toFixed(2).padStart(15),
        l.baseRetenible.toFixed(2).padStart(15),
        l.montoRetenido.toFixed(2).padStart(15)
    ].join("\t"));

    return rows.join("\n");
}
