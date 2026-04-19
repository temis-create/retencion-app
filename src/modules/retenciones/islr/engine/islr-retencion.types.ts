export type SujetoISLR = "PNR" | "PNNR" | "PJD" | "PJND";

export type ResultadoMotorISLR = {
  aplica: boolean;
  tipoResultado: "NO_APLICA" | "RETENCION_PORCENTAJE" | "RETENCION_TARIFA_2";
  conceptoId: number;
  sujetoAplicado: SujetoISLR;
  basePago: number;
  baseCalculo: number;
  porcentajeBaseImponible: number;
  porcentajeRetencion: number | null;
  montoMinimoBs: number;
  sustraendoBs: number;
  montoRetenido: number;
  motivoCodigo: string;
  motivoDescripcion: string;
  categoriaRegla: "NO_APLICA" | "RETENCION_SIMPLE" | "RETENCION_TARIFA_2" | "CALCULO_ESPECIAL";
  baseLegal: {
    norma: string;
    articulo: string;
    descripcion: string;
  };
  snapshotNormativo: {
    valorUT: number;
    versionMotor: string;
  };
};

export type ContextoMotorISLR = {
  pagoId: string;
  montoTotalPago: number;
  sujeto: SujetoISLR;
  conceptoISLR: any; // ConceptoRetencionISLR
  valorUTVigente: number;
  tipoEventoRetencion: string; // PAGO_EFECTIVO | ABONO_EN_CUENTA
};
