/**
 * Motor de Reglas de Retención IVA — Tipos
 *
 * Alineado con la Providencia SNAT/2025/000054.
 * Versión del motor: 2.0.0
 */

// ─── Tipos de resultado ──────────────────────────────────────────────────────

export type TipoResultadoRetencion =
  | "NO_APLICA"
  | "RETENCION_75"
  | "RETENCION_100";

export type CategoriaRegla =
  | "EXCLUSION_ABSOLUTA"
  | "EXCLUSION_CONDICIONAL"
  | "RETENCION_TOTAL"
  | "RETENCION_GENERAL";

// ─── Base legal trazable ─────────────────────────────────────────────────────

export interface BaseLegal {
  norma: string;
  articulo: string;
  descripcion: string;
}

export interface SnapshotNormativo {
  porcentajeAplicado: number;
  unidadTributariaValor?: number | null;
  montoOperacionUT?: number | null;
  versionMotor: string;
}

// ─── Resultado del motor ─────────────────────────────────────────────────────

export interface ResultadoMotorRetencionIVA {
  aplica: boolean;
  tipoResultado: TipoResultadoRetencion;
  porcentajeRetencion: number;
  montoRetenido: number;
  impuestoIVA: number;
  motivoCodigo: string;
  motivoDescripcion: string;
  categoriaRegla: CategoriaRegla;
  baseLegal: BaseLegal;
  snapshotNormativo: SnapshotNormativo;
}

// ─── Metadata fiscal enriquecida ────────────────────────────────────────────

export interface MetadataFiscal {
  /** La operación no está sujeta a IVA */
  operacionNoSujeta: boolean;
  /** Operación exenta de IVA */
  operacionExenta: boolean;
  /** Operación exonerada de IVA */
  operacionExonerada: boolean;
  /** Pago por concepto de viáticos de empleados */
  esViatico: boolean;
  /** Gasto reembolsable por cuenta del agente de retención */
  esGastoReembolsable: boolean;
  /** El proveedor es agente de percepción de IVA */
  esAgentePercepcionIVA: boolean;
  /** Rubro de percepción (bebidas alcohólicas, fósforos, cigarrillos, etc.) */
  rubroPercepcion?: string | null;
  /** El proveedor tiene percepción anticipada de IVA por importación */
  tienePercepcionAnticipadaIVA: boolean;
  /** La operación corresponde a un servicio público domiciliario */
  esServicioPublicoDomiciliario: boolean;
  /** Operación del artículo 2 de la providencia (metales/piedras preciosas) */
  esOperacionArticulo2RetencionTotal: boolean;
  /** El documento cumple con los requisitos formales fiscales */
  cumpleRequisitosFormales: boolean;
  /** El IVA está discriminado en la factura */
  ivaDiscriminado: boolean;
  /** El proveedor tiene RIF registrado/verificado */
  rifRegistrado: boolean;
  /** Proveedor marcado al 100% en el Portal Fiscal del SENIAT */
  proveedorMarcadoRetencion100: boolean;
  /** Valor de la Unidad Tributaria vigente */
  unidadTributariaValor?: number | null;
  /** Monto de la operación expresado en Unidades Tributarias */
  montoOperacionUT?: number | null;
}

// ─── Contexto enriquecido del motor ─────────────────────────────────────────

/**
 * Datos mínimos de la compra relevantes para el motor.
 * Usamos una interfaz liviana en lugar de los tipos Prisma directos
 * para mantener el motor desacoplado del ORM.
 */
export interface CompraContexto {
  id: string;
  tenantId: string;
  empresaId: string;
  proveedorId: string;
  periodoFiscalId: string;
  estado: string;
  impuestoIVA: number;
  montoBase: number;
  montoExento: number;
  totalFactura: number;
}

export interface EmpresaContexto {
  id: string;
  tenantId: string;
  agenteRetencionIVA: boolean;
}

export interface ProveedorContexto {
  id: string;
  tipoContribuyente: string;
  porcentajeRetencionIVA: number;
  rif: string;
}

export interface PeriodoFiscalContexto {
  id: string;
  estado: string;
  codigoPeriodo: string;
}

export interface TipoDocumentoContexto {
  id: string;
  codigo: string;
}

export interface ContextoMotorRetencionIVA {
  compra: CompraContexto;
  empresa: EmpresaContexto;
  proveedor: ProveedorContexto;
  periodoFiscal: PeriodoFiscalContexto;
  tipoDocumento: TipoDocumentoContexto;
  metadataFiscal: MetadataFiscal;
}

// ─── Tipo de regla individual ────────────────────────────────────────────────

export interface ReglaRetencionIVA {
  codigo: string;
  categoria: CategoriaRegla;
  evaluar: (ctx: ContextoMotorRetencionIVA) => boolean;
}
