/**
 * Reglas de negocio para la emisión de comprobantes ISLR.
 */

export function esRetencionISLRElegibleParaComprobante(
  retencion: any,
  tenantId: string
) {
  if (retencion.tenantId !== tenantId) {
    return { elegible: false, motivo: "No pertenece a la organización." };
  }
  if (retencion.comprobanteISLRId) {
    return { elegible: false, motivo: "Ya tiene un comprobante asociado." };
  }
  if (retencion.estado !== "CALCULADA") {
    return { elegible: false, motivo: `Estado inválido para emisión: ${retencion.estado}` };
  }
  return { elegible: true };
}

/**
 * Valida que un conjunto de retenciones puedan agruparse en un mismo comprobante.
 */
export function validarAgrupacionComprobanteISLR(retenciones: any[]) {
  if (retenciones.length === 0) {
    return { valido: false, motivo: "No se han seleccionado retenciones." };
  }

  const first = retenciones[0];
  const empresaId = first.pago?.empresaId || first.empresaId;
  const proveedorId = first.pago?.proveedorId || first.proveedorId;
  const periodoId = first.periodoFiscalId;

  for (const r of retenciones) {
    const rEmpresaId = r.pago?.empresaId || r.empresaId;
    const rProveedorId = r.pago?.proveedorId || r.proveedorId;

    if (rEmpresaId !== empresaId) {
      return { valido: false, motivo: "Las retenciones deben pertenecer a la misma empresa." };
    }
    if (rProveedorId !== proveedorId) {
      return { valido: false, motivo: "Las retenciones deben ser del mismo proveedor." };
    }
    if (r.periodoFiscalId !== periodoId) {
      return { valido: false, motivo: "Las retenciones deben pertenecer al mismo período fiscal." };
    }
  }

  return { valido: true };
}

/**
 * Genera el formato de número de comprobante ISLR: ISLR-YYYYMM-XXXXXX
 */
export function generarNumeroComprobanteISLR(anio: number, mes: number, correlativo: number) {
  const anioStr = anio.toString();
  const mesStr = mes.toString().padStart(2, "0");
  const corrStr = correlativo.toString().padStart(6, "0");
  return `ISLR-${anioStr}${mesStr}-${corrStr}`;
}
