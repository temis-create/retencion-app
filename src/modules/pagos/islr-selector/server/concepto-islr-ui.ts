/**
 * Definición del catálogo amigable para el usuario final.
 * Estos son los conceptos que el usuario verá en el selector.
 */

export interface ConceptoISLR_UI {
  id: string; // Slug amigable
  label: string;
  categoria: string;
  keyword: string; // Usada para buscar en el catálogo técnico (ConceptoRetencionISLR)
  numeralPattern?: string; // Opcional: filtro por numeral si el keyword no es suficiente
}

export const CONCEPTOS_ISLR_UI: ConceptoISLR_UI[] = [
  // --- SERVICIOS ---
  {
    id: "honorarios-profesionales",
    label: "Honorarios Profesionales",
    categoria: "Servicios",
    keyword: "Honorarios",
    numeralPattern: "1"
  },
  {
    id: "servicios-generales",
    label: "Servicios Generales / Técnicos",
    categoria: "Servicios",
    keyword: "Servicios",
    numeralPattern: "11"
  },
  {
    id: "comisiones",
    label: "Comisiones y Corretajes",
    categoria: "Servicios",
    keyword: "Comisiones",
    numeralPattern: "2"
  },

  // --- ARRENDAMIENTOS ---
  {
    id: "arrendamiento-inmuebles",
    label: "Arrendamiento de Bienes Inmuebles",
    categoria: "Arrendamientos",
    keyword: "Inmuebles",
    numeralPattern: "12"
  },
  {
    id: "arrendamiento-muebles",
    label: "Arrendamiento de Bienes Muebles",
    categoria: "Muebles",
    keyword: "Muebles",
    numeralPattern: "13"
  },

  // --- TRANSPORTE Y PUBLICIDAD ---
  {
    id: "fletes-nacionales",
    label: "Fletes y Transporte Nacional",
    categoria: "Transporte",
    keyword: "Fletes",
    numeralPattern: "15"
  },
  {
    id: "publicidad-propaganda",
    label: "Publicidad y Propaganda",
    categoria: "Publicidad",
    keyword: "Publicidad",
    numeralPattern: "19"
  },

  // --- FINANCIEROS Y OTROS ---
  {
    id: "intereses",
    label: "Intereses y Rendimientos Financieros",
    categoria: "Financiero",
    keyword: "Intereses",
    numeralPattern: "3"
  },
  {
    id: "seguros-reaseguros",
    label: "Primas de Seguros y Reaseguros",
    categoria: "Seguros",
    keyword: "Seguros",
    numeralPattern: "7"
  },
  {
    id: "tarjetas-credito",
    label: "Pagos con Tarjeta de Crédito (PN/PJ)",
    categoria: "Operaciones Especiales",
    keyword: "Tarjeta",
    numeralPattern: "14"
  }
];

/**
 * Agrupa los conceptos amigables por categoría para la UI.
 */
export const CONCEPTOS_ISLR_UI_AGRUPADOS = CONCEPTOS_ISLR_UI.reduce((acc, current) => {
  const categoria = current.categoria;
  if (!acc[categoria]) {
    acc[categoria] = [];
  }
  acc[categoria].push(current);
  return acc;
}, {} as Record<string, ConceptoISLR_UI[]>);
