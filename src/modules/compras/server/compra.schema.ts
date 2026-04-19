import { z } from "zod";

// Códigos de tipo documento que corresponden a ajustes (NC/ND)
// Se validan contra la BD en el service, pero aquí listamos los códigos estándar
export const CODIGOS_AJUSTE = ["NC", "ND"] as const;

export const compraSchema = z
  .object({
    empresaId: z.string().min(1, "Debe seleccionar una empresa"),
    proveedorId: z.string().min(1, "Debe seleccionar un proveedor"),
    tipoDocumentoId: z.string().min(1, "Debe seleccionar un tipo de documento"),
    // Código del tipo de documento para aplicar refinements condicionales en el cliente
    tipoDocumentoCodigo: z.string().optional(),
    documentoAfectadoId: z.string().nullable().optional(),
    numeroFactura: z.string().min(1, "El número de factura es requerido"),
    numeroControl: z.string().optional().nullable(),
    fechaFactura: z.string().min(1, "La fecha de factura es requerida"),
    porcentajeAlicuotaSnapshot: z.number().nullable().optional(),
    montoExento: z
      .number({ error: "Debe ser un número" })
      .min(0, "No puede ser negativo"),
    montoBase: z
      .number({ error: "Debe ser un número" })
      .min(0, "No puede ser negativo"),
    impuestoIVA: z
      .number({ error: "Debe ser un número" })
      .min(0, "No puede ser negativo"),
    totalFactura: z
      .number({ error: "Debe ser un número" })
      .min(0, "No puede ser negativo"),
    tipoAjuste: z.enum(["ANULACION", "DESCUENTO", "DEVOLUCION", "ERROR_PRECIO"]).nullable().optional(),
    motivoAjuste: z.string().nullable().optional(),

    // ── Clasificación fiscal IVA (SNAT/2025/000054) ──
    naturalezaIVA: z.enum(["GRAVADA", "EXENTA", "EXONERADA", "NO_SUJETA"]).default("GRAVADA"),
    esViatico: z.boolean().default(false),
    esGastoReembolsable: z.boolean().default(false),
    esServicioPublicoDomiciliario: z.boolean().default(false),
    esOperacionArticulo2RetencionTotal: z.boolean().default(false),
    tienePercepcionAnticipadaIVA: z.boolean().default(false),
    ivaDiscriminado: z.boolean().default(true),
    cumpleRequisitosFormales: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Al menos un monto debe ser mayor a cero
      return (
        data.montoExento > 0 ||
        data.montoBase > 0 ||
        data.impuestoIVA > 0 ||
        data.totalFactura > 0
      );
    },
    {
      message: "Los montos no pueden ser todos cero",
      path: ["totalFactura"],
    }
  )
  .refine(
    (data) => {
      // Total debe ser coherente con la suma con tolerancia de ±1
      const sumaCalculada = data.montoExento + data.montoBase + data.impuestoIVA;
      return Math.abs(data.totalFactura - sumaCalculada) <= 1;
    },
    {
      message: "El total no es coherente con la suma de base exenta + base imponible + IVA",
      path: ["totalFactura"],
    }
  )
  .refine(
    (data) => {
      // Fecha válida
      const fecha = new Date(data.fechaFactura);
      return !isNaN(fecha.getTime());
    },
    {
      message: "La fecha de factura no es válida",
      path: ["fechaFactura"],
    }
  )
  .refine(
    (data) => {
      // Si es NC o ND, debe tener documentoAfectadoId
      const esAjuste =
        data.tipoDocumentoCodigo &&
        CODIGOS_AJUSTE.includes(data.tipoDocumentoCodigo as any);
      if (esAjuste) {
        return !!data.documentoAfectadoId;
      }
      return true;
    },
    {
      message: "Las notas de crédito/débito requieren un documento afectado",
      path: ["documentoAfectadoId"],
    }
  );

export type CompraFormValues = z.infer<typeof compraSchema>;
