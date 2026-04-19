# 13e_print_comprobante_islr.md

# 1. Objetivo

Implementar la vista de **impresión del Comprobante de Retención ISLR** en RetenSaaS, con formato profesional, claro y alineado con la lógica documental del sistema, usando como fuente un `ComprobanteISLR` ya emitido.

Este paso debe permitir:

- visualizar un comprobante ISLR emitido en formato imprimible
- abrir una vista limpia sin layout del dashboard
- imprimir desde navegador
- dejar una base visual consistente para el PDF posterior

---

# 2. Prerrequisito obligatorio

Este módulo solo aplica si ya existe:

```txt
Pago → Retención ISLR → Comprobante ISLR emitido

No imprimir:

pagos sin comprobante
retenciones calculadas sin emisión
comprobantes inexistentes o incompletos
3. Alcance del paso

Este paso debe incluir:

vista print-friendly del comprobante ISLR
layout limpio sin sidebar/dashboard
botón de imprimir
acceso desde detalle del comprobante ISLR
acceso opcional desde detalle del pago, si ya hay comprobante emitido

No implementar todavía:

PDF server-side
firma digital
QR
almacenamiento en nube
anulación o reimpresión con control especial
4. Fuente oficial de datos

La impresión debe construirse a partir de un ComprobanteISLR ya emitido.

Debe cargar como mínimo:

comprobante
empresa/agente de retención
proveedor/beneficiario
período fiscal
fecha de emisión
número de comprobante
retenciones incluidas
pagos asociados
conceptos ISLR
total retenido

No recalcular montos.

5. Formato recomendado
Tamaño
media carta horizontal
Configuración CSS base
@page {
  size: 21.59cm 13.97cm;
  margin: 0.5cm;
}
6. Estructura visual sugerida

Dividir el comprobante en 5 bloques:

Encabezado legal / título
Datos generales del comprobante
Datos del agente de retención
Datos del sujeto retenido
Tabla de detalle + totales + firma
7. Encabezado

Mostrar:

texto legal breve sobre agente de retención de ISLR
título:
COMPROBANTE DE RETENCIÓN DE ISLR
número de comprobante
fecha de emisión
período fiscal
8. Datos del agente

Mostrar:

razón social
RIF
dirección fiscal
9. Datos del sujeto retenido

Mostrar:

nombre o razón social
RIF
dirección fiscal si existe
tipo de persona si aporta valor visual
10. Tabla de detalle

Columnas mínimas recomendadas:

Fecha del pago
Referencia / N° pago
Concepto ISLR
Monto pagado
Base retenible
% retención
Monto retenido
Regla MVP

Mostrar una línea por cada RetencionISLR.

Si un comprobante tiene varias retenciones con conceptos distintos, deben ir en líneas separadas.

11. Totales

Mostrar al pie:

total monto pagado
total base retenible
total retenido
12. Firma

Dejar espacio visual para:

firma del agente
sello
fecha de entrega
13. Ruta sugerida

Crear ruta print-friendly tipo:

/dashboard/retenciones/islr/comprobantes/[id]/print

o una ruta equivalente sin layout del dashboard.

Debe renderizar solo el comprobante.

14. Botón de impresión

Agregar botón:

Imprimir comprobante ISLR

Debe usar:

window.print()
15. Integración con UI
Desde detalle del comprobante ISLR

Mostrar botón visible para imprimir.

Desde detalle del pago

Si existe comprobante emitido:

mostrar enlace al comprobante
y opción de imprimir si ya está disponible
16. Requisitos técnicos
validar tenant
validar existencia del comprobante
no mostrar layout del dashboard en la vista de impresión
mantener tipado fuerte
no meter lógica fiscal en el componente visual
17. Entregables requeridos

Cursor debe dejar implementado:

vista print-friendly
plantilla visual del comprobante ISLR
botón de imprimir
acceso desde detalle del comprobante
integración opcional desde pagos
resumen técnico corto
18. Resultado esperado

Al finalizar este paso, el sistema debe permitir abrir e imprimir un comprobante ISLR emitido con formato profesional y limpio.