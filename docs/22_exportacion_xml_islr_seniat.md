# 22_exportacion_xml_islr_seniat.md

# 1. Objetivo

Implementar la **exportación XML de retenciones ISLR** en formato compatible con requerimientos del SENIAT, basado en comprobantes emitidos dentro de un período fiscal.

Este XML será utilizado para:

- carga en sistemas fiscales
- entrega a contadores
- cumplimiento normativo

---

# 2. Estructura requerida del XML

Formato base:

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<RetencionesISLR>
  <RifAgente>J000000000</RifAgente>
  <Periodo>202604</Periodo>

  <DetalleRetencion>
    <RifRetenido>J000000000</RifRetenido>
    <NumeroFactura>000001</NumeroFactura>
    <NumeroControl>00-000001</NumeroControl>
    <FechaOperacion>20/04/2026</FechaOperacion>
    <CodigoConcepto>001</CodigoConcepto>
    <MontoOperacion>1000.00</MontoOperacion>
    <PorcentajeRetencion>1</PorcentajeRetencion>
    <Sustraendo>0.00</Sustraendo>
    <MontoRetenido>10.00</MontoRetenido>
  </DetalleRetencion>

</RetencionesISLR>

3. Fuente de datos

El XML debe construirse a partir de:

ComprobanteISLR (solo emitidos)
RetencionISLR
Pago
Compra
Proveedor
ConceptoISLR
4. Regla principal

❗ Solo incluir retenciones que:

tengan comprobante emitido
pertenezcan al período solicitado
estén asociadas a la empresa activa
5. Parámetros de entrada

La exportación debe recibir:

{
  empresaId: string
  periodo: "YYYYMM"
}
6. Cabecera del XML
6.1 RifAgente

Debe salir de la empresa:

empresa.rif
6.2 Periodo

Formato:

YYYYMM

Ejemplo:

202604
7. Nodo DetalleRetencion

Se genera un nodo por cada retención.

7.1 RifRetenido
proveedor.rif
7.2 NumeroFactura
compra.numeroFactura
7.3 NumeroControl
compra.numeroControl
7.4 FechaOperacion

Formato:

DD/MM/YYYY

Tomar de:

pago.fecha
o
compra.fechaFactura (según tu política)

Recomendación:
👉 usar fecha del pago (evento de retención)

7.5 CodigoConcepto
conceptoISLR.codigoSeniat

⚠️ Debe ser EXACTAMENTE el código del catálogo

7.6 MontoOperacion
retencion.baseCalculoSnapshot

Formato:

2 decimales
punto decimal
7.7 PorcentajeRetencion
retencion.porcentajeRetencionSnapshot

Ejemplo:

1
3
5

⚠️ No usar formato decimal tipo 0.01

7.8 Sustraendo
retencion.sustraendoSnapshot || 0
7.9 MontoRetenido
retencion.montoRetenido
8. Generación del XML
8.1 Encoding

Debe ser:

ISO-8859-1
8.2 Estructura
nodo raíz: RetencionesISLR
múltiples DetalleRetencion
9. Validaciones obligatorias

Antes de generar XML:

9.1 Debe haber datos

Si no hay retenciones:

No existen retenciones ISLR para el período seleccionado
9.2 RIF válidos
agente
retenido
9.3 Código concepto válido

No permitir:

null
vacío
9.4 Montos válidos

0

consistentes
10. Servicio backend

Crear:

generateISLRXml({
  empresaId,
  periodo
})

Debe:

buscar comprobantes ISLR emitidos
construir dataset
mapear a estructura XML
retornar string XML
11. Endpoint / Action

Crear server action:

exportISLRXmlAction(periodo)

Debe:

validar tenant
validar empresa activa
retornar archivo descargable
12. Descarga del archivo

Nombre sugerido:

ISLR_YYYYMM_RIF.xml

Ejemplo:

ISLR_202604_J123456789.xml
13. UI

Ubicación sugerida:

Retenciones → ISLR → Exportar XML

Botón:

Exportar XML SENIAT
14. Mensajes UX
Éxito
Archivo XML ISLR generado correctamente
Error
No se pudo generar el archivo XML. Verifica los datos del período.
15. Arquitectura sugerida
src/modules/retenciones/islr/export/
  xml/
    islr-xml-builder.ts
    islr-xml.service.ts
  actions/
    export-islr-xml.ts
16. Ejemplo de builder
function buildISLRXml(data) {
  return `
<?xml version="1.0" encoding="ISO-8859-1"?>
<RetencionesISLR>
  <RifAgente>${data.rifAgente}</RifAgente>
  <Periodo>${data.periodo}</Periodo>
  ${data.detalles.map(d => `
  <DetalleRetencion>
    <RifRetenido>${d.rif}</RifRetenido>
    <NumeroFactura>${d.factura}</NumeroFactura>
    <NumeroControl>${d.control}</NumeroControl>
    <FechaOperacion>${d.fecha}</FechaOperacion>
    <CodigoConcepto>${d.codigo}</CodigoConcepto>
    <MontoOperacion>${d.base}</MontoOperacion>
    <PorcentajeRetencion>${d.porcentaje}</PorcentajeRetencion>
    <Sustraendo>${d.sustraendo}</Sustraendo>
    <MontoRetenido>${d.retenido}</MontoRetenido>
  </DetalleRetencion>
  `).join("")}
</RetencionesISLR>
`
}
17. Snapshot crítico

Asegurarte que RetencionISLR tenga:

baseCalculoSnapshot
porcentajeRetencionSnapshot
sustraendoSnapshot
montoRetenido
18. Entregables

Cursor debe dejar:

servicio de generación XML
builder XML
server action de exportación
botón en UI
descarga funcional
validaciones
resumen técnico corto
19. Resultado esperado

El usuario debe poder:

seleccionar período
generar XML
descargar archivo
usarlo en procesos fiscales
20. Errores críticos a evitar

❌ usar porcentajes en decimal
❌ fechas mal formateadas
❌ encoding incorrecto
❌ incluir retenciones sin comprobante
❌ no usar snapshot