import { SujetoISLR } from "./islr-retencion.types";

/**
 * Resuelve el código de sujeto ISLR normalizado (PNR, PNNR, PJD, PJND)
 * basándose en la clasificación fiscal del proveedor.
 */
export function resolverSujetoISLR(proveedor: {
  tipoPersona: string;
  tipoResidencia: string;
}): SujetoISLR {
  const { tipoPersona, tipoResidencia } = proveedor;

  if (tipoPersona === "NATURAL") {
    if (tipoResidencia === "RESIDENTE") return "PNR";
    return "PNNR";
  }

  if (tipoPersona === "JURIDICA") {
    if (tipoResidencia === "DOMICILIADO" || tipoResidencia === "RESIDENTE") return "PJD";
    return "PJND";
  }

  // Fallback seguro
  return "PJD";
}
