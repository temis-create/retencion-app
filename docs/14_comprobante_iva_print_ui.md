# 14_comprobante_iva_print_ui.md

# 1. Objetivo

Implementar la vista de impresión del Comprobante de Retención de IVA en formato media carta, con diseño profesional, claro y alineado con prácticas reales en Venezuela.

---

# 2. Tamaño y configuración

## Formato
- media carta horizontal

## CSS base

```css
@page {
  size: 21.59cm 13.97cm;
  margin: 0.5cm;
}

3. Estructura del layout

Dividir en 5 bloques:

Encabezado legal
Datos principales (comprobante + fechas)
Datos agente y proveedor
Tabla de detalle
Totales + pie legal + firma
4. Encabezado

Mostrar:

texto legal corto:
"Ley de IVA Art. 11..."
título centrado:
COMPROBANTE DE RETENCIÓN DE IVA
número de comprobante (destacado)
5. Datos principales

En grid:

Campo	Valor
Fecha	fecha emisión
Período	AAAA-MM
Nº comprobante	grande
6. Datos del agente

Bloque:

Razón social
RIF
Dirección
7. Datos del proveedor

Bloque:

Nombre / razón social
RIF
Dirección (si existe)
8. Tabla de detalle

Columnas MVP:

Fecha
Factura
Control
Tipo Op
Doc Afectado
Total
Base
% IVA
IVA
Retenido
Reglas
máximo 6–8 filas visibles
si hay más → paginación futura (no en MVP)
9. Totales

Mostrar alineado a la derecha:

Total factura
Base imponible
IVA causado
IVA retenido
10. Pie legal

Texto:

"Este comprobante se emite en función de la Providencia Administrativa SNAT/2015/0049..."

11. Firma

Espacio para:

firma
sello
fecha entrega
12. Estilo visual
Tipografía
Inter / Arial
Tamaños
título: 14–16px bold
contenido: 10–11px
Bordes
líneas finas
estilo limpio tipo factura
Colores
negro + gris
opcional acento leve (azul o naranja corporativo)
13. Componente React

Crear:

modules/retenciones/ui/comprobante-iva-print.tsx

Debe:

recibir comprobanteId
cargar data desde server
renderizar layout
14. Botón de impresión

Agregar en:

detalle de compra
detalle de comprobante

Botón:

Imprimir comprobante IVA

Acción:

window.print()
15. Ruta

Crear ruta:

/app/(app)/retenciones/iva/comprobantes/[id]/print

Sin layout del dashboard.

16. Validaciones

Antes de imprimir:

comprobante existe
pertenece al tenant
tiene retenciones
tiene correlativo válido
17. Resultado esperado

El sistema debe permitir:

abrir comprobante
visualizar formato limpio
imprimir en media carta
entregar documento válido al proveedor
18. Fuera de alcance

No incluir aún:

QR
firma digital
numeración avanzada multi-sede
múltiples páginas
PDF server-side