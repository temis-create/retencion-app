# 14f_validacion_ux_mensajes_inteligentes_islr.md

# 1. Objetivo

Implementar una capa de **validación UX y mensajes inteligentes para el flujo ISLR** en RetenSaaS, con foco en:

- reducir errores operativos del usuario
- hacer entendible la selección y cálculo de ISLR
- mostrar mensajes claros y accionables
- evitar mensajes técnicos crudos o ambiguos
- mejorar la confianza del usuario en el sistema

Este paso debe actuar sobre el flujo:

```txt
Pago → Selección de concepto ISLR → Cálculo → Comprobante → Exportación

No cambia la lógica tributaria del motor; mejora la experiencia y la claridad del flujo.

2. Problema actual

Aunque ya existan:

catálogo global ISLR
selector inteligente
motor de cálculo
comprobante
exportación

el usuario aún puede tropezar con varios problemas de UX:

no entender por qué una retención no aplica
no saber qué concepto elegir
ver errores demasiado técnicos
no comprender por qué el sistema bloquea una operación
no identificar rápidamente si el problema es del proveedor, del pago, del período o del concepto
3. Principio UX

Toda validación del flujo ISLR debe cumplir estas reglas:

3.1 Clara

El mensaje debe decir qué pasó.

3.2 Accionable

Debe decir qué puede hacer el usuario.

3.3 No técnica

Evitar mensajes tipo:

"constraint violation"
"null value"
"invalid enum"
"concept not found"
3.4 Contextual

El mensaje debe salir cerca del campo o acción donde ocurre el problema.

4. Alcance del paso

Este paso debe incluir:

validaciones UX en el formulario de pago
validaciones UX en el selector de conceptos ISLR
mensajes inteligentes para cálculo de retención
mensajes de bloqueo por período cerrado
mensajes por concepto no aplicable o no resoluble
mensajes por proveedor mal clasificado
mensajes claros en emisión de comprobante ISLR
mensajes claros en exportación ISLR

No implementar todavía:

tutorial paso a paso
asistente IA
onboarding guiado
sistema avanzado de help center
5. Puntos del flujo que deben mejorarse
5.1 Formulario de pago

Debe validar y explicar mejor:

falta seleccionar proveedor
falta seleccionar concepto ISLR
no hay compras asociadas si aplica
monto aplicado mayor al saldo
suma aplicada mayor al total del pago
período fiscal ISLR inexistente o cerrado
5.2 Selector inteligente de conceptos

Debe explicar:

qué significa el concepto visible
que el sistema resolverá internamente el concepto técnico
por qué un concepto no está disponible si aplica
por qué no se puede resolver para ese proveedor
5.3 Resultado del cálculo

Debe mostrar de manera entendible:

si aplica o no aplica
por qué
qué porcentaje usó
si hubo monto mínimo
si hubo sustraendo
si fue Tarifa 2
si fue fórmula especial
5.4 Emisión de comprobante

Debe explicar:

si la retención ya fue comprobantada
si faltan datos para emitir
si se emitió correctamente
cuál es el número de comprobante
5.5 Exportación

Debe explicar:

si no hay comprobantes para exportar
si el período está vacío
si hubo exportación exitosa
cuántos registros fueron exportados
6. Validaciones UX en formulario de pago
6.1 Proveedor requerido

Mensaje sugerido:

Debes seleccionar un proveedor para poder determinar la retención ISLR.
6.2 Concepto requerido

Mensaje sugerido:

Selecciona el tipo de concepto ISLR para que el sistema pueda calcular la retención correctamente.
6.3 Monto inválido

Mensaje sugerido:

El monto del pago debe ser mayor que cero.
6.4 Monto aplicado excede saldo

Mensaje sugerido:

El monto aplicado supera el saldo disponible de la compra seleccionada.
6.5 Suma aplicada excede pago

Mensaje sugerido:

La suma de los montos aplicados no puede ser mayor que el monto total del pago.
6.6 Período cerrado o inexistente

Mensaje sugerido:

No existe un período fiscal ISLR abierto para la fecha del pago. Revisa la fecha o abre el período correspondiente.
7. Validaciones UX en selector inteligente de conceptos ISLR
7.1 No existe configuración para ese proveedor

Mensaje sugerido:

No existe una configuración ISLR válida para este proveedor y el concepto seleccionado.
7.2 Concepto inactivo

Mensaje sugerido:

Este concepto ISLR está inactivo y no puede utilizarse en nuevos pagos.
7.3 Ayuda contextual

Agregar una ayuda visual breve cerca del selector:

Selecciona el tipo de operación. El sistema resolverá automáticamente el concepto ISLR técnico según la clasificación del proveedor.
8. Mensajes del cálculo de retención ISLR
8.1 Retención calculada con éxito

Mensaje sugerido:

Retención ISLR calculada correctamente.
Información adicional visible
concepto aplicado
base de cálculo
porcentaje
monto retenido
8.2 No aplica por monto mínimo

Mensaje sugerido:

No aplica retención porque el monto no supera el mínimo exigido para este concepto.
8.3 No aplica por datos incompletos

Mensaje sugerido:

No se pudo calcular la retención porque faltan datos obligatorios del pago, proveedor o concepto.
8.4 Tarifa 2

Mostrar explicación breve:

Se aplicó Tarifa N° 2 según el tipo de beneficiario y el monto acumulado del concepto.
8.5 Fórmula especial

Mostrar explicación breve:

Se aplicó una fórmula especial de cálculo según la naturaleza del concepto seleccionado.
8.6 Recalculo bloqueado

Mensaje sugerido:

No se puede recalcular esta retención porque ya está vinculada a un comprobante emitido.
9. Mensajes en emisión de comprobante ISLR
9.1 Éxito

Mensaje sugerido:

Comprobante ISLR emitido correctamente.

Y mostrar:

número de comprobante
enlace al detalle si aplica
9.2 Ya emitido

Mensaje sugerido:

Esta retención ya tiene un comprobante emitido.
9.3 Inconsistencia de agrupación

Mensaje sugerido:

No se puede emitir un solo comprobante con retenciones de distintos proveedores, períodos o empresas.
10. Mensajes en exportación ISLR
10.1 Sin registros

Mensaje sugerido:

No existen comprobantes ISLR emitidos para el período seleccionado.
10.2 Éxito

Mensaje sugerido:

Exportación ISLR generada correctamente.

Y mostrar:

período
cantidad de registros
monto total retenido
10.3 Error de consistencia

Mensaje sugerido:

No se pudo generar la exportación porque existen datos incompletos o inconsistentes en algunos comprobantes.
11. Presentación del resultado del cálculo en UI

En la tarjeta o panel de Retención ISLR mostrar:

concepto aplicado
tipo de cálculo:
porcentaje
Tarifa 2
fórmula especial
base de cálculo
porcentaje
monto retenido
motivo si no aplica
Recomendación visual

Usar etiquetas o badges como:

No aplica
Calculada
Confirmada
Tarifa 2
Cálculo especial
12. Estructura técnica sugerida

Crear una pequeña capa de mensajes centralizados, por ejemplo:

src/modules/retenciones/islr/ux/
  islr-messages.ts
  islr-errors.ts
Objetivo

Evitar hardcodear mensajes diferentes en:

services
server actions
formularios
componentes UI
13. Estrategia recomendada
13.1 Backend

Los services y actions deben devolver:

códigos internos
contexto suficiente
13.2 Frontend

La UI traduce esos códigos a mensajes amigables centralizados.

Ejemplo:

code: "NOAPL_NO_SUPERA_MINIMO"

se traduce en UI a:

No aplica retención porque el monto no supera el mínimo exigido para este concepto.
14. Reglas de implementación
No exponer mensajes SQL/Prisma al usuario
No repetir mensajes distintos para el mismo caso
Mantener tono claro, administrativo y profesional
Evitar textos excesivamente largos
Mostrar errores cerca del contexto cuando sea posible
15. Accesibilidad y consistencia

Los mensajes deben ser:

consistentes en todo el flujo ISLR
fáciles de leer
visibles en móvil y desktop
compatibles con toast + mensaje inline si hace falta
Recomendación

Usar:

mensaje inline para errores de formulario
toast para éxito o bloqueo global
tarjeta informativa para explicación del cálculo
16. Entregables requeridos

Cursor debe dejar implementado:

capa centralizada de mensajes ISLR
validaciones UX en formulario de pago
mensajes claros para selector de conceptos
mensajes claros en cálculo
mensajes claros en emisión
mensajes claros en exportación
integración con UI existente
resumen técnico corto indicando:
qué mensajes normalizó
qué códigos internos usa
qué partes del flujo quedaron cubiertas
17. Resultado esperado

Al finalizar este paso, el usuario debe poder completar el flujo ISLR con mucha mayor claridad, entendiendo:

qué debe seleccionar
por qué aplica o no aplica una retención
qué bloquea una emisión o exportación
qué hacer cuando el sistema rechaza una operación
18. Fuera de alcance

No implementar todavía:

centro de ayuda completo
tutorial guiado
chatbot tributario
documentación contextual avanzada