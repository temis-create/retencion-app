import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Catálogo Maestro de Conceptos de Retención ISLR 2025
 * Basado en docs/14_catalogo_islr_global_2025.md
 * Valor UT: Bs. 43,00
 */
interface ConceptoISLRInput {
  codigoSeniat: string | null;
  numeral: string;
  literal: string | null;
  concepto: string;
  sujeto: string;
  baseImponiblePorcentaje?: number | null;
  tipoTarifa: string;
  porcentajeRetencion?: number | null;
  montoMinimoBs?: number | null;
  sustraendoBs?: number | null;
  usaMontoMinimo?: boolean;
  usaSustraendo?: boolean;
  requiereCalculoEspecial?: boolean;
  formulaEspecial?: string | null;
  notas?: string | null;
  activo?: boolean;
}

const conceptosISLR: ConceptoISLRInput[] = [
  // 1. Honorarios profesionales
  {
    codigoSeniat: "003",
    numeral: "1",
    literal: "a",
    concepto: "Honorarios profesionales",
    sujeto: "PNNR",
    baseImponiblePorcentaje: 90,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    montoMinimoBs: 0,
    sustraendoBs: 0,
    usaMontoMinimo: false,
    usaSustraendo: false,
    requiereCalculoEspecial: false,
    notas: "No residente",
    activo: true
  },
  {
    codigoSeniat: "002",
    numeral: "1",
    literal: "b/c/d",
    concepto: "Honorarios profesionales",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 107.50,
    usaMontoMinimo: true,
    usaSustraendo: true,
    requiereCalculoEspecial: false,
    notas: "Incluye sociedades de personas",
    activo: true
  },
  {
    codigoSeniat: "005",
    numeral: "1",
    literal: "a",
    concepto: "Honorarios profesionales",
    sujeto: "PJND",
    baseImponiblePorcentaje: 90,
    tipoTarifa: "TARIFA_2",
    porcentajeRetencion: null,
    montoMinimoBs: 0,
    sustraendoBs: 0,
    usaMontoMinimo: false,
    usaSustraendo: false,
    requiereCalculoEspecial: false,
    notas: "Acumulativa",
    activo: true
  },
  {
    codigoSeniat: "004",
    numeral: "1",
    literal: "b",
    concepto: "Honorarios profesionales",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    montoMinimoBs: 0,
    sustraendoBs: 0,
    usaMontoMinimo: false,
    usaSustraendo: false,
    requiereCalculoEspecial: false,
    activo: true
  },

  // 2. Comisiones
  {
    codigoSeniat: "019",
    numeral: "2",
    literal: "a/b",
    concepto: "Comisiones",
    sujeto: "PNNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    montoMinimoBs: 0,
    sustraendoBs: 0,
    usaMontoMinimo: false,
    usaSustraendo: false,
    requiereCalculoEspecial: false,
    activo: true
  },
  {
    codigoSeniat: "018",
    numeral: "2",
    literal: "a/b",
    concepto: "Comisiones",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 107.50,
    usaMontoMinimo: true,
    usaSustraendo: true,
    requiereCalculoEspecial: false,
    activo: true
  },
  {
    codigoSeniat: "020",
    numeral: "2",
    literal: "a/b",
    concepto: "Comisiones",
    sujeto: "PJND",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    montoMinimoBs: 0,
    sustraendoBs: 0,
    usaMontoMinimo: false,
    usaSustraendo: false,
    requiereCalculoEspecial: false,
    activo: true
  },
  {
    codigoSeniat: "021",
    numeral: "2",
    literal: "a/b",
    concepto: "Comisiones",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    montoMinimoBs: 0,
    sustraendoBs: 0,
    usaMontoMinimo: false,
    usaSustraendo: false,
    requiereCalculoEspecial: false,
    activo: true
  },

  // 3. Intereses
  {
    codigoSeniat: "022",
    numeral: "3",
    literal: "a",
    concepto: "Intereses art. 27 #2 LISLR",
    sujeto: "PNNR",
    baseImponiblePorcentaje: 95,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    activo: true
  },
  {
    codigoSeniat: "023",
    numeral: "3",
    literal: "a",
    concepto: "Intereses art. 27 #2 LISLR",
    sujeto: "PJND",
    baseImponiblePorcentaje: 95,
    tipoTarifa: "TARIFA_2",
    activo: true
  },
  {
    codigoSeniat: "024",
    numeral: "3",
    literal: "b",
    concepto: "Intereses art. 52 parágrafo 2° LISLR",
    sujeto: "PJND",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 4.95,
    notas: "Instituciones financieras no domiciliadas",
    activo: true
  },
  {
    codigoSeniat: "025",
    numeral: "3",
    literal: "c",
    concepto: "Intereses",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 107.50,
    usaMontoMinimo: true,
    usaSustraendo: true,
    activo: true
  },
  {
    codigoSeniat: "027",
    numeral: "3",
    literal: "c",
    concepto: "Intereses",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    activo: true
  },

  // 11. Servicios
  {
    codigoSeniat: "054",
    numeral: "11",
    literal: null,
    concepto: "Servicios",
    sujeto: "PNNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    activo: true
  },
  {
    codigoSeniat: "053",
    numeral: "11",
    literal: null,
    concepto: "Servicios",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 1.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 35.83,
    usaMontoMinimo: true,
    usaSustraendo: true,
    notas: "Ejecución de obras y prestación de servicios",
    activo: true
  },
  {
    codigoSeniat: "056",
    numeral: "11",
    literal: null,
    concepto: "Servicios",
    sujeto: "PJND",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "TARIFA_2",
    notas: "Acumulativa",
    activo: true
  },
  {
    codigoSeniat: "055",
    numeral: "11",
    literal: null,
    concepto: "Servicios",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 2.00,
    activo: true
  },

  // 12. Arrendamientos Inmuebles
  {
    codigoSeniat: "058",
    numeral: "12",
    literal: null,
    concepto: "Arrendamiento de bienes inmuebles",
    sujeto: "PNNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    activo: true
  },
  {
    codigoSeniat: "057",
    numeral: "12",
    literal: null,
    concepto: "Arrendamiento de bienes inmuebles",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 107.50,
    usaMontoMinimo: true,
    usaSustraendo: true,
    activo: true
  },
  {
    codigoSeniat: "060",
    numeral: "12",
    literal: null,
    concepto: "Arrendamiento de bienes inmuebles",
    sujeto: "PJND",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "TARIFA_2",
    notas: "Acumulativa",
    activo: true
  },
  {
    codigoSeniat: "059",
    numeral: "12",
    literal: null,
    concepto: "Arrendamiento de bienes inmuebles",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    notas: "Incluye administradoras",
    activo: true
  },

  // 13. Arrendamientos Muebles
  {
    codigoSeniat: "062",
    numeral: "13",
    literal: null,
    concepto: "Arrendamiento de bienes muebles",
    sujeto: "PNNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    activo: true
  },
  {
    codigoSeniat: "061",
    numeral: "13",
    literal: null,
    concepto: "Arrendamiento de bienes muebles",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 107.50,
    usaMontoMinimo: true,
    usaSustraendo: true,
    activo: true
  },
  {
    codigoSeniat: "064",
    numeral: "13",
    literal: null,
    concepto: "Arrendamiento de bienes muebles",
    sujeto: "PJND",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    activo: true
  },
  {
    codigoSeniat: "063",
    numeral: "13",
    literal: null,
    concepto: "Arrendamiento de bienes muebles",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    activo: true
  },

  // 14. Tarjetas de crédito (Fórmula Especial)
  {
    codigoSeniat: "066",
    numeral: "14",
    literal: null,
    concepto: "Pagos de tarjetas de crédito o consumo",
    sujeto: "PNNR",
    baseImponiblePorcentaje: null,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 34.00,
    requiereCalculoEspecial: true,
    formulaEspecial: "PAGO / ((IVA_RATE / 100) + 1)",
    notas: "Base según fórmula especial",
    activo: true
  },
  {
    codigoSeniat: "065",
    numeral: "14",
    literal: null,
    concepto: "Pagos de tarjetas de crédito o consumo",
    sujeto: "PNR",
    baseImponiblePorcentaje: null,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    requiereCalculoEspecial: true,
    formulaEspecial: "PAGO / ((IVA_RATE / 100) + 1)",
    notas: "Base según fórmula especial",
    activo: true
  },
  {
    codigoSeniat: "068",
    numeral: "14",
    literal: null,
    concepto: "Pagos de tarjetas de crédito o consumo",
    sujeto: "PJND",
    baseImponiblePorcentaje: null,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    requiereCalculoEspecial: true,
    formulaEspecial: "PAGO / ((IVA_RATE / 100) + 1)",
    notas: "Base según fórmula especial",
    activo: true
  },
  {
    codigoSeniat: "067",
    numeral: "14",
    literal: null,
    concepto: "Pagos de tarjetas de crédito o consumo",
    sujeto: "PJD",
    baseImponiblePorcentaje: null,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    requiereCalculoEspecial: true,
    formulaEspecial: "PAGO / ((IVA_RATE / 100) + 1)",
    notas: "Base según fórmula especial",
    activo: true
  },
  {
    codigoSeniat: "069",
    numeral: "14",
    literal: null,
    concepto: "Pago de gasolina con tarjeta de crédito o consumo",
    sujeto: "PNR",
    baseImponiblePorcentaje: null,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 1.00,
    requiereCalculoEspecial: true,
    formulaEspecial: "PAGO / ((IVA_RATE / 100) + 1)",
    activo: true
  },
  {
    codigoSeniat: "070",
    numeral: "14",
    literal: null,
    concepto: "Pago de gasolina con tarjeta de crédito o consumo",
    sujeto: "PJD",
    baseImponiblePorcentaje: null,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 1.00,
    requiereCalculoEspecial: true,
    formulaEspecial: "PAGO / ((IVA_RATE / 100) + 1)",
    activo: true
  },

  // 15. Fletes Nacionales
  {
    codigoSeniat: "071",
    numeral: "15",
    literal: null,
    concepto: "Fletes y gastos de transporte nacional",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 1.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 35.83,
    usaMontoMinimo: true,
    usaSustraendo: true,
    activo: true
  },
  {
    codigoSeniat: "072",
    numeral: "15",
    literal: null,
    concepto: "Fletes y gastos de transporte nacional",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    activo: true
  },

  // 19. Publicidad
  {
    codigoSeniat: "083",
    numeral: "19",
    literal: null,
    concepto: "Publicidad y propaganda",
    sujeto: "PNR",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    montoMinimoBs: 3583.34,
    sustraendoBs: 107.50,
    usaMontoMinimo: true,
    usaSustraendo: true,
    activo: true
  },
  {
    codigoSeniat: "084",
    numeral: "19",
    literal: null,
    concepto: "Publicidad y propaganda",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    activo: true
  },
  {
    codigoSeniat: "085",
    numeral: "19",
    literal: null,
    concepto: "Publicidad y propaganda",
    sujeto: "PJND",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 5.00,
    activo: true
  },
  {
    codigoSeniat: "086",
    numeral: "19",
    literal: null,
    concepto: "Publicidad y propaganda emisoras de radio",
    sujeto: "PJD",
    baseImponiblePorcentaje: 100,
    tipoTarifa: "PORCENTAJE",
    porcentajeRetencion: 3.00,
    activo: true
  }
];

export async function seedConceptosISLR() {
  console.log(" Iniciando sembrado del Catálogo Global ISLR 2025...");
  
  let creadoCount = 0;
  let actualizadoCount = 0;

  for (const item of conceptosISLR) {
    try {
      // Estrategia de idempotencia: numeral + sujeto + concepto
      const existe = await prisma.conceptoRetencionISLR.findFirst({
        where: {
          numeral: item.numeral,
          sujeto: item.sujeto,
          concepto: item.concepto
        }
      });

      const data = {
        ...item,
        baseImponiblePorcentaje: item.baseImponiblePorcentaje ? new Prisma.Decimal(item.baseImponiblePorcentaje) : null,
        porcentajeRetencion: item.porcentajeRetencion ? new Prisma.Decimal(item.porcentajeRetencion) : null,
        montoMinimoBs: item.montoMinimoBs ? new Prisma.Decimal(item.montoMinimoBs) : new Prisma.Decimal(0),
        sustraendoBs: item.sustraendoBs ? new Prisma.Decimal(item.sustraendoBs) : new Prisma.Decimal(0),
        usaMontoMinimo: item.usaMontoMinimo ?? (item.montoMinimoBs ? item.montoMinimoBs > 0 : false),
        usaSustraendo: item.usaSustraendo ?? (item.sustraendoBs ? item.sustraendoBs > 0 : false),
      };

      if (existe) {
        await prisma.conceptoRetencionISLR.update({
          where: { id: existe.id },
          data
        });
        actualizadoCount++;
      } else {
        await prisma.conceptoRetencionISLR.create({
          data
        });
        creadoCount++;
      }
    } catch (error) {
      console.error(` Error sembrando concepto ${item.codigoSeniat} - ${item.concepto}:`, error);
    }
  }

  console.log(` Catálogo ISLR finalizado: ${creadoCount} creados, ${actualizadoCount} actualizados.`);
}

// Permitir ejecución directa
if (require.main === module) {
  seedConceptosISLR()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
