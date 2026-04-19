import { prisma } from "@/lib/prisma";
import { CONCEPTOS_ISLR_UI } from "./concepto-islr-ui";

/**
 * Determina el sujeto (PNR, PNNR, PJD, PJND) basado en los atributos del proveedor.
 */
export function determinarSujetoProveedor(proveedor: { 
  tipoPersona: string; 
  tipoResidencia: string; 
}) {
  const { tipoPersona, tipoResidencia } = proveedor;

  if (tipoPersona === "NATURAL") {
    return tipoResidencia === "RESIDENTE" ? "PNR" : "PNNR";
  } else {
    return tipoResidencia === "DOMICILIADO" ? "PJD" : "PJND";
  }
}

/**
 * Resuelve el ConceptoRetencionISLR técnico basado en la selección amigable y el proveedor.
 */
export async function resolverConceptoISLR(params: {
  conceptoUIId: string;
  proveedorId: string;
}) {
  const { conceptoUIId, proveedorId } = params;

  // 1. Obtener proveedor
  const proveedor = await prisma.proveedor.findUnique({
    where: { id: proveedorId },
  });

  if (!proveedor) {
    throw new Error("Proveedor no encontrado para resolución de ISLR.");
  }

  // 2. Determinar sujeto legal
  const sujeto = determinarSujetoProveedor({
    tipoPersona: proveedor.tipoPersona,
    tipoResidencia: proveedor.tipoResidencia
  });

  // 3. Obtener el concepto amigable de la UI para saber qué buscar
  const conceptoUI = CONCEPTOS_ISLR_UI.find(c => c.id === conceptoUIId);
  if (!conceptoUI) {
    throw new Error(`Configuración UI no encontrada para: ${conceptoUIId}`);
  }

  // 4. Buscar en el catálogo técnico
  const conceptoTecnico = await prisma.conceptoRetencionISLR.findFirst({
    where: {
      sujeto: sujeto,
      numeral: conceptoUI.numeralPattern || undefined,
      concepto: { contains: conceptoUI.keyword, mode: 'insensitive' },
      activo: true
    }
  });

  if (!conceptoTecnico) {
    return {
      success: false,
      error: `No se encontró una regla de retención para ${conceptoUI.label} aplicada a un sujeto ${sujeto}.`
    };
  }

  return {
    success: true,
    conceptoTecnicoId: conceptoTecnico.id
  };
}

// Interfaz para el resultado del resolver
export interface ResolucionISLR {
    success: boolean;
    conceptoTecnicoId?: number;
    error?: string;
}
