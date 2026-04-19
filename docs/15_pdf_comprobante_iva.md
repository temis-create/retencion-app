# 15_pdf_comprobante_iva.md

# 1. Objetivo

Implementar la generación de **PDF descargable del Comprobante de Retención de IVA** en RetenSaaS, partiendo de un `ComprobanteIVA` ya emitido y consolidado, para obtener un documento profesional, imprimible y consistente con el formato media carta definido para el comprobante.

Este paso debe permitir:

- generar PDF desde servidor
- descargar el comprobante IVA en PDF
- reutilizar el diseño base del comprobante de impresión
- mantener consistencia con el correlativo y los montos ya emitidos
- dejar la base lista para envío por correo o almacenamiento futuro

---

# 2. Prerrequisito obligatorio

Este módulo solo tiene sentido si ya existe el flujo de:

```txt
Compra → Retención IVA → Emisión de Comprobante IVA

El PDF debe generarse únicamente sobre un ComprobanteIVA ya emitido.

No generar PDF sobre:

compras sin comprobante
retenciones calculadas pero no emitidas
documentos incompletos o inconsistentes
3. Alcance del paso

Este módulo debe incluir:

servicio server-side para generar PDF del comprobante IVA
plantilla HTML/React reutilizable para PDF
route handler para descarga
botón de descarga PDF en el detalle del comprobante
integración opcional desde detalle de compra, si ya existe comprobante emitido
validación de tenant y acceso

No implementar todavía:

firma digital
QR
almacenamiento definitivo en S3/Blob
envío por correo
PDF masivo por lote
historial de PDFs generados
anulación o reemisión
4. Fuente oficial de datos

El PDF debe construirse a partir de un ComprobanteIVA ya emitido, con todas sus relaciones.

Debe cargar como mínimo:

comprobante
empresa/agente de retención
proveedor/sujeto retenido
período fiscal
fecha de emisión
número de comprobante
retenciones incluidas
compras asociadas
montos totales

No recalcular montos en esta fase.
El PDF debe reflejar exactamente lo consolidado en el comprobante y sus retenciones asociadas.

5. Estrategia técnica recomendada
5.1 Enfoque

Generar el PDF en servidor a partir de HTML controlado por el sistema.

Opciones aceptables:

Playwright
Puppeteer
otra librería robusta y mantenible
Recomendación preferida

Usar una plantilla HTML/React y convertirla a PDF en servidor.

5.2 Principio

El PDF no debe depender de window.print() ni de una captura de pantalla.
Debe ser determinista, consistente y descargable desde backend.

6. Tamaño y formato
Formato
media carta horizontal
CSS esperado

Ejemplo base:

@page {
  size: 21.59cm 13.97cm;
  margin: 0.5cm;
}
Requisitos
buena legibilidad
tabla compacta
tipografía estable
alineación monetaria correcta
apariencia profesional y limpia
7. Estructura técnica sugerida
src/modules/retenciones/iva/pdf/
  server/
    comprobante-iva-pdf.service.ts
    comprobante-iva-pdf.template.tsx
  ui/
    descargar-comprobante-iva-pdf-button.tsx

src/app/api/retenciones/iva/comprobantes/[id]/pdf/route.ts

Puedes adaptar nombres, pero mantener separación clara entre:

carga de datos
template
servicio PDF
descarga
UI
8. Servicio de generación

Crear función tipo:

generarComprobanteIVAPdf(comprobanteId, tenantId)

Debe:

cargar el comprobante con sus relaciones
validar pertenencia al tenant
validar que el comprobante exista y esté emitido
renderizar el template HTML
convertir a PDF
devolver buffer o response lista para descarga
9. Template del PDF

Crear template específico para PDF, por ejemplo:

comprobante-iva-pdf.template.tsx

Debe reutilizar al máximo la estructura del comprobante print-friendly.

Debe mostrar:
texto legal superior
título del comprobante
número de comprobante
fecha de emisión
período fiscal
datos del agente de retención
datos del sujeto retenido
tabla de detalle
totales
pie legal
zona de firma/sello si aplica visualmente
Regla

No meter lógica de negocio en el template.
El template solo recibe data ya consolidada.

10. Route handler de descarga

Crear ruta:

/api/retenciones/iva/comprobantes/[id]/pdf

Debe:

exigir sesión válida
obtener tenantId
validar acceso al comprobante
devolver application/pdf
usar Content-Disposition: attachment
Nombre sugerido del archivo
comprobante_iva_<numeroComprobante>.pdf

Opcional:

comprobante_iva_<rif_empresa>_<numeroComprobante>.pdf
11. Botón en UI

Agregar botón en:

detalle del comprobante IVA
opcionalmente en detalle de compra si ya existe comprobante emitido asociado

Texto sugerido:

Descargar PDF
PDF del comprobante

Este botón debe aparecer solo si el comprobante ya existe.

12. Requisitos de seguridad
12.1 Multitenancy

No se puede descargar PDF de comprobantes de otro tenant.

12.2 Estado válido

No generar PDF de comprobantes inexistentes o no emitidos formalmente.

12.3 Manejo de errores
404 si no existe
error controlado si no pertenece al tenant
error claro si el comprobante está incompleto
13. Consideraciones de diseño
13.1 Tipografía

Usar una fuente estable y legible:

Inter
Arial
sans-serif equivalente
13.2 Tabla

La tabla del detalle debe incluir al menos:

fecha documento
número factura
número control
tipo operación
documento afectado
total factura
base imponible
alícuota
IVA causado
IVA retenido
13.3 Totales

Mostrar al pie:

total factura
base imponible
IVA causado
IVA retenido
13.4 Cantidad de filas

Para el MVP, asumir comprobantes que caben en una sola media carta.

Si supera el espacio:

documentar limitación
o implementar paginación simple si resulta manejable
14. Reutilización con la vista print

Aprovechar la vista print-friendly ya diseñada o implementada.

Recomendación

Compartir estructura visual si es posible.
Si la generación PDF necesita un template más controlado, crear una variante específica, pero manteniendo coherencia visual.

15. Validaciones funcionales

Cursor debe verificar que el PDF generado:

muestre el número correcto de comprobante
muestre la fecha correcta
muestre el período correcto
muestre agente y proveedor correctos
muestre todas las líneas del comprobante
muestre los montos correctos
coincida con el comprobante emitido en DB
sea imprimible en media carta
16. Entregables requeridos

Cursor debe dejar implementado:

servicio de generación PDF
template PDF del comprobante
route handler de descarga
botón de descarga en UI
validaciones de tenant y estado
resumen técnico corto con:
librería usada
estrategia elegida
cómo se genera el PDF
qué quedó pendiente para almacenamiento o correo
17. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

entrar al detalle de un comprobante IVA emitido
descargarlo en PDF
obtener un documento profesional y consistente
dejar lista la base para correo o archivo futuro
18. Fuera de alcance de este paso

No implementar todavía:

firma digital avanzada
QR
almacenamiento persistente en nube
historial de PDFs
PDF consolidado por lotes
anexos múltiples