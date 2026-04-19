# 14d_checklist_pruebas_funcionales_islr.md

# 1. Objetivo

Definir y ejecutar un checklist de pruebas funcionales reales para validar el flujo completo de ISLR en RetenSaaS, desde el pago hasta la exportación documental, verificando que el motor de cálculo, comprobantes, impresión, PDF y exportación se comporten correctamente.

Este paso busca confirmar que el sistema no solo compila, sino que funciona tributaria y operativamente de forma consistente.

---

# 2. Alcance del checklist

Validar el flujo completo:

```txt
Compra → Pago / Abono → Retención ISLR → Comprobante ISLR → Impresión / PDF → Exportación

Debe comprobar:

cálculo correcto
uso del catálogo ISLR
selección correcta del concepto
aplicación de mínimos y sustraendos
Tarifa 2
fórmulas especiales
bloqueo por período cerrado
bloqueo de recálculo tras comprobante
coherencia documental
3. Casos mínimos de prueba
3.1 Caso estándar simple
proveedor válido
concepto estándar (ej. servicios)
pago completo
período abierto
Validar
calcula retención
guarda snapshots correctos
genera comprobante
impresión correcta
PDF correcto
exportación correcta
3.2 Monto inferior al mínimo

Usar un concepto con monto mínimo aplicable.

Validar
no aplica retención
motivo claro
no genera comprobante
no se exporta
3.3 Caso con sustraendo

Usar concepto con sustraendo.

Validar
calcula retención bruta
aplica sustraendo
monto retenido final correcto
3.4 Caso con Tarifa 2

Usar concepto del catálogo que tenga tipoTarifa = TARIFA_2.

Validar
calcula tramo correcto
aplica sustraendo del tramo
persiste resultado correctamente
comprobante refleja el resultado final
3.5 Caso con fórmula especial

Usar concepto que requiera cálculo especial (por ejemplo tarjetas de crédito o equivalente implementado).

Validar
usa la fórmula correcta
no usa cálculo simple
el monto retenido final es coherente
3.6 Pago parcial
una compra
dos pagos distintos
calcular retención sobre cada evento según política implementada
Validar
no duplica base incorrectamente
cada pago calcula sobre su monto retenible real
3.7 Pago múltiple
un pago aplicado a varias compras del mismo proveedor
Validar
suma base correcta
retención correcta
comprobante correcto
3.8 Período fiscal cerrado

Intentar calcular o recalcular ISLR en período cerrado.

Validar
sistema bloquea
error claro
no persiste cambios
3.9 Recalculo bloqueado por comprobante
calcular retención
emitir comprobante
intentar recalcular
Validar
recálculo bloqueado
mensaje claro
3.10 Impresión del comprobante ISLR

Con comprobante emitido.

Validar
formato correcto
datos del agente correctos
datos del retenido correctos
conceptos y montos correctos
totales correctos
3.11 PDF del comprobante ISLR

Con comprobante emitido.

Validar
descarga funcional
contenido igual al comprobante emitido
formato profesional y legible
3.12 Exportación ISLR

Generar exportación del período.

Validar
solo incluye comprobantes emitidos
conceptos correctos
montos correctos
período correcto
empresa correcta
4. Validaciones técnicas por caso

En cada caso validar:

resultado visual en UI
datos persistidos en DB
consistencia con catálogo ISLR
consistencia del período fiscal
estado de la retención
estado del comprobante
5. Validaciones específicas en DB

Revisar que RetencionISLR guarde correctamente:

conceptoISLRId
baseCalculoSnapshot
porcentajeRetencionSnapshot
montoRetenido
motivoCodigo
motivoDescripcion
categoriaRegla
baseLegal*
versionMotor
valorUTSnapshot

Y que ComprobanteISLR guarde:

número comprobante
empresa
proveedor
período
total retenido
6. Validaciones UX

Comprobar que el usuario pueda hacer el flujo sin hacks:

seleccionar concepto
registrar pago
calcular retención
emitir comprobante
imprimir/PDF
exportar

Si el selector de conceptos es muy técnico o confuso, documentarlo como pendiente UX.

7. Resultado esperado

Al finalizar este checklist, el sistema debe demostrar que el flujo ISLR funciona de punta a punta de forma consistente, auditable y usable.

8. Entregable requerido

Cursor debe dejar:

checklist ejecutable
resultados de cada caso
incidencias detectadas
recomendaciones de corrección si algo falla
resumen final indicando si el flujo ISLR está listo o qué gaps quedan