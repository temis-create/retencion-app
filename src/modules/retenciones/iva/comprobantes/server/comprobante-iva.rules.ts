import { Compra, RetencionIVA } from "@prisma/client";

export type RetencionIVACandidata = RetencionIVA & {
  compra: Compra;
};

export function esRetencionIVAElegibleParaComprobante(
  retencion: RetencionIVACandidata,
  tenantId: string
): { elegible: boolean; motivo?: string } {
  if (retencion.tenantId !== tenantId) {
    return { elegible: false, motivo: "Pertenece a otro tenant" };
  }
  if (retencion.estado !== "CALCULADA") {
    return { elegible: false, motivo: `Estado inválido: ${retencion.estado}` };
  }
  if (retencion.comprobanteIVAId) {
    return { elegible: false, motivo: "Ya posee comprobante IVA emitido" };
  }
  if (retencion.compra.estado === "ANULADA") {
    return { elegible: false, motivo: "La compra asociada está anulada" };
  }
  return { elegible: true };
}

export function validarAgrupacionComprobanteIVA(
  retenciones: RetencionIVACandidata[]
): { valido: boolean; motivo?: string } {
  if (retenciones.length === 0) {
    return { valido: false, motivo: "No hay retenciones para agrupar" };
  }

  const base = retenciones[0];

  for (const r of retenciones) {
    if (r.tenantId !== base.tenantId) {
      return {
        valido: false,
        motivo: "Las retenciones pertenecen a organizaciones distintas",
      };
    }
    if (r.compra.empresaId !== base.compra.empresaId) {
      return {
        valido: false,
        motivo: "Las retenciones pertenecen a empresas distintas",
      };
    }
    if (r.compra.proveedorId !== base.compra.proveedorId) {
      return {
        valido: false,
        motivo: "Las retenciones provienen de múltiples proveedores",
      };
    }
    if (r.periodoFiscalId !== base.periodoFiscalId) {
      return {
        valido: false,
        motivo: "Las retenciones pertenecen a períodos fiscales distintos",
      };
    }
  }

  return { valido: true };
}

export function generarNumeroComprobanteIVA(
  anio: number,
  mes: number,
  correlativoAumento: number
): string {
  const anioStr = anio.toString().padStart(4, "0");
  const mesStr = mes.toString().padStart(2, "0");
  const correlativoStr = correlativoAumento.toString().padStart(8, "0");

  return `${anioStr}${mesStr}${correlativoStr}`;
}
