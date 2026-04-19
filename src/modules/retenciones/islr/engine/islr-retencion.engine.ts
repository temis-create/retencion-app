import { Decimal } from "decimal.js";
import { ResultadoMotorISLR, ContextoMotorISLR } from "./islr-retencion.types";
import { ISLR_CODES } from "./islr-retencion.codes";
import { calcularRetencionTarifa2 } from "./islr-retencion.tarifa2";
import { calcularBaseEspecialISLR } from "./islr-retencion.especial";

export class ISLRRetencionEngine {
  static version = "1.0.0";

  static evaluar(ctx: ContextoMotorISLR): ResultadoMotorISLR {
    const { conceptoISLR, montoTotalPago, sujeto, valorUTVigente } = ctx;

    // 1. Validaciones básicas
    if (!conceptoISLR || !conceptoISLR.activo) {
      return this.resultadoNoAplica(ctx, ISLR_CODES.NOAPL_CONCEPTO_INACTIVO, "Concepto no habilitado para cálculos.");
    }

    if (montoTotalPago <= 0) {
      return this.resultadoNoAplica(ctx, ISLR_CODES.NOAPL_MONTO_CERO, "El monto del pago es cero o negativo.");
    }

    // 2. Determinar Base de Cálculo
    let baseCalculo = montoTotalPago;
    let categoriaRegla: ResultadoMotorISLR["categoriaRegla"] = "RETENCION_SIMPLE";

    if (conceptoISLR.requiereCalculoEspecial) {
      baseCalculo = calcularBaseEspecialISLR(conceptoISLR.formulaEspecial, montoTotalPago);
      categoriaRegla = "CALCULO_ESPECIAL";
    }

    // Aplicar porcentaje de base imponible del catálogo
    const basePorcentaje = conceptoISLR.baseImponiblePorcentaje ? Number(conceptoISLR.baseImponiblePorcentaje) : 100;
    const baseFinal = new Decimal(baseCalculo).mul(basePorcentaje).div(100).toNumber();

    // 3. Ejecutar Cálculo según Tarifa
    let montoRetenido = 0;
    let tarifaAplicada: number | null = null;
    let sustraendoBs = 0;
    let tipoResultado: ResultadoMotorISLR["tipoResultado"] = "RETENCION_PORCENTAJE";
    let motivoCodigo: string = ISLR_CODES.RET_SIMPLE_PORCENTAJE;

    if (conceptoISLR.tipoTarifa === "TARIFA_2") {
      const resT2 = calcularRetencionTarifa2(baseFinal, valorUTVigente);
      montoRetenido = resT2.montoRetenido;
      tarifaAplicada = resT2.porcentajeAplicado;
      sustraendoBs = resT2.sustraendoBs;
      tipoResultado = "RETENCION_TARIFA_2";
      categoriaRegla = "RETENCION_TARIFA_2";
      motivoCodigo = ISLR_CODES.RET_TARIFA_2;
    } else {
      // Tarifa por porcentaje simple
      tarifaAplicada = conceptoISLR.porcentajeRetencion ? Number(conceptoISLR.porcentajeRetencion) : 0;
      const retBruta = new Decimal(baseFinal).mul(tarifaAplicada).div(100);
      
      // Aplicar sustraendo si aplica
      sustraendoBs = conceptoISLR.usaSustraendo ? Number(conceptoISLR.sustraendoBs || 0) : 0;
      montoRetenido = Decimal.max(retBruta.minus(sustraendoBs), 0).toNumber();
    }

    // 4. Evaluar Monto Mínimo (Threshold)
    if (conceptoISLR.usaMontoMinimo) {
      const minBs = Number(conceptoISLR.montoMinimoBs || 0);
      if (montoTotalPago < minBs) {
        return this.resultadoNoAplica(ctx, ISLR_CODES.NOAPL_NO_SUPERA_MINIMO, `El monto pagado (${montoTotalPago.toLocaleString('es-VE')} Bs.) no supera el mínimo de retención para este concepto (${minBs.toLocaleString('es-VE')} Bs.).`);
      }
    }

    if (montoRetenido <= 0) {
      return this.resultadoNoAplica(ctx, ISLR_CODES.NOAPL_MONTO_CERO, "El cálculo resultó en retención cero.");
    }

    // 5. Resultado Exitoso
    return {
      aplica: true,
      tipoResultado,
      conceptoId: conceptoISLR.id,
      sujetoAplicado: sujeto,
      basePago: montoTotalPago,
      baseCalculo: baseFinal,
      porcentajeBaseImponible: basePorcentaje,
      porcentajeRetencion: tarifaAplicada,
      montoMinimoBs: Number(conceptoISLR.montoMinimoBs || 0),
      sustraendoBs,
      montoRetenido: new Decimal(montoRetenido).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      motivoCodigo: conceptoISLR.requiereCalculoEspecial ? ISLR_CODES.RET_FORMULA_ESPECIAL : motivoCodigo,
      motivoDescripcion: this.generarDescripcion(conceptoISLR, sujeto, montoRetenido),
      categoriaRegla,
      baseLegal: {
        norma: "Decreto 1.808 - Reglamento Parcial de la Ley de ISLR",
        articulo: `Numeral ${conceptoISLR.numeral}${conceptoISLR.literal ? `, Literal ${conceptoISLR.literal}` : ""}`,
        descripcion: conceptoISLR.concepto,
      },
      snapshotNormativo: {
        valorUT: valorUTVigente,
        versionMotor: this.version
      }
    };
  }

  private static resultadoNoAplica(ctx: ContextoMotorISLR, codigo: string, descripcion: string): ResultadoMotorISLR {
    return {
      aplica: false,
      tipoResultado: "NO_APLICA",
      conceptoId: ctx.conceptoISLR?.id || 0,
      sujetoAplicado: ctx.sujeto,
      basePago: ctx.montoTotalPago,
      baseCalculo: 0,
      porcentajeBaseImponible: 0,
      porcentajeRetencion: 0,
      montoMinimoBs: 0,
      sustraendoBs: 0,
      montoRetenido: 0,
      motivoCodigo: codigo,
      motivoDescripcion: descripcion,
      categoriaRegla: "NO_APLICA",
      baseLegal: {
        norma: "N/A",
        articulo: "N/A",
        descripcion: "N/A",
      },
      snapshotNormativo: {
        valorUT: ctx.valorUTVigente,
        versionMotor: this.version
      }
    };
  }

  private static generarDescripcion(concepto: any, sujeto: string, monto: number): string {
    const rateDesc = concepto.tipoTarifa === 'TARIFA_2' ? 'Progresiva (Tarifa 2)' : `${Number(concepto.porcentajeRetencion)}%`;
    return `Retención ISLR aplicada sobre ${concepto.concepto} para ${sujeto}. Tarifa: ${rateDesc}. Monto: ${monto.toLocaleString('es-VE')} Bs.`;
  }
}
