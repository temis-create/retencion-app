import { z } from "zod";

export const pagoSchema = z.object({
  empresaId: z.string().min(1, "Debes seleccionar una empresa para emitir el pago"),
  proveedorId: z.string().min(1, "Debes seleccionar un proveedor para poder determinar la retención ISLR"),
  conceptoISLRId: z.string().min(1, "Selecciona el tipo de concepto ISLR para que el sistema pueda calcular la retención correctamente"),
  fechaPago: z.string().min(1, "Indica la fecha en la que se realizó el pago"),
  montoTotal: z.number().positive("El monto total del pago debe ser mayor a cero"),
  referencia: z.string().optional(),
  tipoEventoRetencion: z.enum(["PAGO_EFECTIVO", "ABONO_EN_CUENTA"]),
  
  // Relación con compras
  aplicaciones: z.array(z.object({
    compraId: z.string().min(1, "Factura no identificada"),
    montoAplicado: z.number().positive("El monto a abonar debe ser mayor a cero"),
  })).min(1, "Debes asociar el pago al menos a una factura para poder distribuirlo"),
});

export type PagoFormValues = z.infer<typeof pagoSchema>;
