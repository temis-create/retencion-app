/**
 * Motor de Reglas de Retención IVA — Barrel Export
 */

export { ejecutarMotorRetencionIVA, VERSION_MOTOR } from "./iva-retencion.engine";
export type {
  ResultadoMotorRetencionIVA,
  ContextoMotorRetencionIVA,
  MetadataFiscal,
  CompraContexto,
  EmpresaContexto,
  ProveedorContexto,
  PeriodoFiscalContexto,
  TipoDocumentoContexto,
  BaseLegal,
  SnapshotNormativo,
  TipoResultadoRetencion,
  CategoriaRegla,
} from "./iva-retencion.types";
export * from "./iva-retencion.codes";
export { getBaseLegal, LEGAL_MAP } from "./iva-retencion.legal-map";
export { PORCENTAJE_RETENCION_GENERAL } from "./iva-retencion.general";
