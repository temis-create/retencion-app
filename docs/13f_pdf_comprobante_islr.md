
---

# `13f_pdf_comprobante_islr.md`

```md
# 13f_pdf_comprobante_islr.md

# 1. Objetivo

Implementar la generación de **PDF descargable del Comprobante de Retención ISLR** en RetenSaaS, tomando como fuente un `ComprobanteISLR` ya emitido y reutilizando el diseño base del comprobante de impresión.

Este paso debe permitir:

- generar PDF server-side
- descargar el comprobante ISLR en PDF
- mantener consistencia visual con la impresión
- dejar base lista para envío por correo o almacenamiento futuro

---

# 2. Prerrequisito obligatorio

Solo generar PDF sobre un `ComprobanteISLR` ya emitido.

No generar PDF sobre:
- pagos sin comprobante
- retenciones sin emisión
- datos incompletos

---

# 3. Alcance del paso

Este módulo debe incluir:

1. servicio server-side de generación PDF
2. template PDF reutilizable
3. route handler de descarga
4. botón de descarga PDF en UI
5. validación de tenant y acceso

No implementar todavía:
- firma digital
- QR
- almacenamiento permanente
- envío por correo
- PDFs por lote

---

# 4. Fuente oficial de datos

Cargar para el PDF:

- comprobante ISLR
- empresa
- proveedor
- período
- fecha
- número comprobante
- retenciones incluidas
- pagos asociados
- conceptos ISLR
- montos y total retenido

No recalcular.

---

# 5. Estrategia técnica recomendada

Usar generación server-side basada en HTML controlado.

Opciones aceptables:
- Playwright
- Puppeteer
- equivalente robusto

## Recomendación
Render HTML/React + conversión a PDF en servidor.

---

# 6. Tamaño y formato

## Formato
- media carta horizontal

## CSS base

```css
@page {
  size: 21.59cm 13.97cm;
  margin: 0.5cm;
}

7. Estructura técnica sugerida
src/modules/retenciones/islr/pdf/
  server/
    comprobante-islr-pdf.service.ts
    comprobante-islr-pdf.template.tsx
  ui/
    descargar-comprobante-islr-pdf-button.tsx

src/app/api/retenciones/islr/comprobantes/[id]/pdf/route.ts
8. Servicio principal

Crear:

generarComprobanteISLRPdf(comprobanteId, tenantId)

Debe:

cargar comprobante con relaciones
validar tenant
validar que esté emitido
renderizar template
convertir a PDF
devolver buffer/response
9. Template PDF

Crear template específico para PDF del comprobante ISLR.

Debe mostrar:

encabezado legal
título
número comprobante
fecha
período
agente
sujeto retenido
tabla de detalle
totales
pie legal
firma/sello

No meter lógica de negocio en el template.

10. Route handler de descarga

Crear ruta tipo:

/api/retenciones/islr/comprobantes/[id]/pdf

Debe:

exigir sesión
validar tenant
devolver application/pdf
usar Content-Disposition: attachment
Nombre sugerido
comprobante_islr_<numeroComprobante>.pdf
11. Botón en UI

Agregar botón:

Descargar PDF

Ubicación mínima:

detalle del comprobante ISLR

Ubicación opcional:

detalle del pago si ya existe comprobante vinculado
12. Requisitos de seguridad
no descargar comprobantes de otro tenant
404 si no existe
bloquear si no está emitido formalmente
13. Validaciones funcionales

El PDF debe:

coincidir con el comprobante emitido
mostrar montos correctos
mostrar conceptos correctos
ser imprimible y legible en media carta
14. Entregables requeridos

Cursor debe dejar implementado:

servicio PDF
template PDF
route handler
botón de descarga
validaciones de acceso
resumen técnico corto indicando librería usada y estrategia elegida
15. Resultado esperado

Al finalizar este paso, el sistema debe permitir descargar en PDF un comprobante ISLR emitido con formato profesional y consistente.
