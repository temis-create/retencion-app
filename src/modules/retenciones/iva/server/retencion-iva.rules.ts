import { Compra, Proveedor, TipoContribuyente, EstadoCompra, PeriodoFiscal, EstadoPeriodoFiscal } from "@prisma/client";

export interface EvaluacionRetencionIVA {
  aplica: boolean;
  motivoNoAplica?: string;
  porcentaje: number;
  impuestoIVA: number;
  montoRetenido: number;
}

export function esProveedorExcluidoDeRetencionIVA(proveedor: Proveedor): string | null {
  if (!proveedor) return "Proveedor no definido";
  if (proveedor.tipoContribuyente === TipoContribuyente.FORMAL) {
    return "El proveedor es contribuyente FORMAL (excluido de retención IVA)";
  }
  if (!proveedor.porcentajeRetencionIVA || proveedor.porcentajeRetencionIVA.toNumber() <= 0) {
    return "El proveedor tiene porcentaje de retención <= 0";
  }
  return null;
}

type CompraConTipoDoc = Compra & { tipoDocumento?: { codigo: string } | null };

export function esCompraRetenibleIVA(compra: CompraConTipoDoc, periodoFiscal: PeriodoFiscal): string | null {
  if (compra.tipoDocumento && ["NC", "ND"].includes(compra.tipoDocumento.codigo)) {
    return "El MVP no soporta cálculo automático de retención para Notas de Crédito o Débito";
  }
  if (compra.estado !== EstadoCompra.REGISTRADA) {
    return "La compra no está registrada";
  }
  if (!compra.impuestoIVA || compra.impuestoIVA.toNumber() <= 0) {
    return "La compra no tiene impuesto IVA causado";
  }
  if (periodoFiscal.estado === EstadoPeriodoFiscal.CERRADO) {
    return "El período fiscal de la compra está cerrado";
  }
  return null;
}

export function evaluarRetencionIVA(
  compra: CompraConTipoDoc,
  proveedor: Proveedor,
  periodoFiscal: PeriodoFiscal
): EvaluacionRetencionIVA {
  const motivoExclusionProveedor = esProveedorExcluidoDeRetencionIVA(proveedor);
  if (motivoExclusionProveedor) {
    return {
      aplica: false,
      motivoNoAplica: motivoExclusionProveedor,
      porcentaje: 0,
      impuestoIVA: compra.impuestoIVA.toNumber(),
      montoRetenido: 0,
    };
  }

  const motivoExclusionCompra = esCompraRetenibleIVA(compra, periodoFiscal);
  if (motivoExclusionCompra) {
    return {
      aplica: false,
      motivoNoAplica: motivoExclusionCompra,
      porcentaje: 0,
      impuestoIVA: compra.impuestoIVA.toNumber(),
      montoRetenido: 0,
    };
  }

  const porcentaje = proveedor.porcentajeRetencionIVA.toNumber();
  const impuestoIVA = compra.impuestoIVA.toNumber();
  const montoRetenido = Number((impuestoIVA * (porcentaje / 100)).toFixed(2));

  return {
    aplica: true,
    porcentaje,
    impuestoIVA,
    montoRetenido,
  };
}
