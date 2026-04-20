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
    factura: string;
    control: string;
    sustraendo: number;
}

export function mapRetencionToLineaExport(retencion: any): LineaExportacionISLR {
    const comprobante = retencion.comprobanteISLR;
    const pago = retencion.pago;
    const proveedor = retencion.comprobanteISLR?.proveedor || pago.proveedor;
    const empresa = retencion.comprobanteISLR?.empresa || pago.empresa;

    // Obtener datos de la primera factura vinculada al pago (simplificación inicial)
    // En ISLR consolidado por pago, el SENIAT acepta un detalle por el total del pago.
    const primeraCompra = pago.pagoCompras?.[0]?.compra;

    return {
        rifAgente: empresa.rif,
        nombreAgente: empresa.nombreFiscal,
        periodo: retencion.periodoFiscal.codigoPeriodo,
        numeroComprobante: comprobante?.numeroComprobante || "S/N",
        fechaEmision: comprobante 
            ? new Date(comprobante.fechaEmision).toLocaleDateString('es-VE') 
            : new Date(pago.fechaPago).toLocaleDateString('es-VE'),
        rifBeneficiario: proveedor.rif,
        nombreBeneficiario: proveedor.nombre,
        tipoPersona: proveedor.tipologiaPersona || "PNRE", 
        codigoConcepto: retencion.codigoConceptoSnapshot,
        descripcionConcepto: retencion.descripcionConceptoSnapshot,
        montoPagado: Number(pago.montoTotal), 
        baseRetenible: Number(retencion.baseCalculoSnapshot),
        porcentaje: Number(retencion.tarifaAplicadaSnapshot),
        montoRetenido: Number(retencion.montoRetenido),
        factura: primeraCompra?.numeroFactura || "0",
        control: primeraCompra?.numeroControl || "0",
        sustraendo: Number(retencion.sustraendoSnapshot || 0)
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

/**
 * Genera el string XML en formato compatible con SENIAT (RetencionesISLR)
 */
export function formatToXML(lineas: LineaExportacionISLR[]): string {
    if (lineas.length === 0) return "";

    const rifAgente = lineas[0].rifAgente.replace(/[^JVEG0-9]/g, '');
    const periodo = lineas[0].periodo; // YYYYMM

    const xmlLines = lineas.map(l => {
        // Limpiar RIF
        const rifRetenido = l.rifBeneficiario.replace(/[^JVEG0-9]/g, '');
        // El porcentaje debe ser entero o decimal con punto (ej: 1, 3, 34)
        const porcentaje = l.porcentaje; 
        
        return `  <DetalleRetencion>
    <RifRetenido>${rifRetenido}</RifRetenido>
    <NumeroFactura>${l.factura}</NumeroFactura>
    <NumeroControl>${l.control}</NumeroControl>
    <FechaOperacion>${l.fechaEmision}</FechaOperacion>
    <CodigoConcepto>${l.codigoConcepto.padStart(3, '0')}</CodigoConcepto>
    <MontoOperacion>${l.baseRetenible.toFixed(2)}</MontoOperacion>
    <PorcentajeRetencion>${porcentaje}</PorcentajeRetencion>
    <Sustraendo>${l.sustraendo.toFixed(2)}</Sustraendo>
    <MontoRetenido>${l.montoRetenido.toFixed(2)}</MontoRetenido>
  </DetalleRetencion>`;
    });

    return `<?xml version="1.0" encoding="ISO-8859-1"?>
<RetencionesISLR>
  <RifAgente>${rifAgente}</RifAgente>
  <Periodo>${periodo}</Periodo>
${xmlLines.join("\n")}
</RetencionesISLR>`;
}
