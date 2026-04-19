# 13c_modulo_comprobante_islr_retenciones.md

# 1. Objetivo

Implementar el módulo de **Comprobante de Retención ISLR** en RetenSaaS para formalizar las retenciones de impuesto sobre la renta ya calculadas sobre pagos o abonos en cuenta.

Este paso debe permitir:

- emitir comprobante legal ISLR
- agrupar una o varias retenciones elegibles
- asignar numeración correlativa interna
- bloquear recálculos posteriores
- generar base para impresión, PDF y exportación futura

Este módulo convierte una `RetencionISLR` calculada en un documento fiscal formal emitido por la empresa agente de retención.

---

# 2. Flujo funcional

El flujo completo debe quedar:

```txt
Compra → Pago / Abono → Retención ISLR → Comprobante ISLR

Regla clave

El comprobante ISLR siempre nace de una retención ya calculada sobre un pago.

No emitir comprobante directamente desde compra.

3. Alcance del paso

Este módulo debe incluir:

emisión de comprobante ISLR
creación de entidad ComprobanteISLR
asociación de una o varias RetencionISLR
correlativo interno
detalle del comprobante
listado de comprobantes emitidos
integración con pagos

No implementar todavía:

PDF
impresión avanzada
exportación XML/TXT SENIAT
anulación/reverso complejo
firma digital
4. Entidades involucradas

Usar:

Pago
RetencionISLR
ComprobanteISLR
Proveedor
Empresa
PeriodoFiscal
ConceptoISLR
5. Regla de agrupación
Sí se puede agrupar si comparten:
mismo tenant
misma empresa
mismo proveedor
mismo período fiscal ISLR
estado CALCULADA
sin comprobante previo
No agrupar:
distintos proveedores
distintos períodos
distintas empresas
6. Emisión individual (MVP obligatorio)

Debe poder emitirse comprobante desde:

detalle del pago
detalle de retención ISLR

Botón:

Emitir comprobante ISLR
7. Emisión múltiple (MVP opcional)

Si ya existe listado de retenciones ISLR:

seleccionar varias elegibles
emitir un solo comprobante

Solo si cumplen reglas de agrupación.

8. Numeración del comprobante
Recomendación MVP

Formato interno:

ISLR-202604-000001

o equivalente.

Requisitos
único por empresa
incremental
transaccional
no duplicable
Fuente

Usar:

ParametroFiscal.proximoCorrelativoISLR
9. Creación de ComprobanteISLR

Campos mínimos:

id
tenantId
empresaId
proveedorId
periodoFiscalId
numeroComprobante
fechaEmision
montoTotalRetenido
createdAt
10. Actualización de RetencionISLR

Al emitir comprobante:

Cada retención debe:

recibir comprobanteISLRId
cambiar estado a CONFIRMADA
bloquear recálculo
11. Validaciones de emisión

Antes de emitir validar:

retención existe
pertenece al tenant
estado = CALCULADA
no tiene comprobante previo
proveedor válido
período abierto o permitido según política
Bloquear si:
ya emitida
otro tenant
proveedor inconsistente
monto cero
12. Arquitectura técnica
src/modules/retenciones/islr/comprobantes/
  server/
    comprobante-islr.service.ts
    comprobante-islr.repository.ts
    comprobante-islr.rules.ts
  actions/
    emitir-comprobante-islr.ts
  ui/
    emitir-comprobante-islr-button.tsx
    comprobante-islr-table.tsx
    comprobante-islr-detail.tsx
13. Servicio principal

Crear:

emitirComprobanteISLR(retencionIds, tenantId)

Debe:

validar elegibilidad
agrupar
generar correlativo
crear comprobante
actualizar retenciones
devolver resultado
14. UI requerida
14.1 Listado

Ruta sugerida:

/dashboard/retenciones/islr/comprobantes

Mostrar:

número
fecha
proveedor
período
total retenido
14.2 Detalle

Mostrar:

empresa
proveedor
período
retenciones incluidas
pagos origen
conceptos ISLR
total retenido
14.3 Acciones
Ver detalle
Próximamente PDF
Próximamente imprimir
15. Integración con Pagos

En detalle de pago:

Si existe retención calculada

Mostrar botón:

Emitir comprobante ISLR
Si ya emitido

Mostrar:

número comprobante
enlace al detalle
16. Estados recomendados
RetencionISLR
CALCULADA
CONFIRMADA
ANULADA (futuro)
ComprobanteISLR
EMITIDO
ANULADO (futuro)
17. Seguridad
Multitenancy

No emitir comprobantes de otro tenant.

Transacción

Crear comprobante + actualizar retenciones en una sola transacción DB.

18. Entregables requeridos

Cursor debe dejar implementado:

entidad comprobante ISLR funcional
servicio de emisión
correlativo
listado
detalle
integración con pagos
resumen técnico corto
19. Resultado esperado

El sistema debe permitir:

calcular retención ISLR
emitir comprobante legal
consultar comprobantes emitidos
preparar base para PDF y exportación futura
20. Fuera de alcance

No implementar aún:

PDF
impresión
XML/TXT
anulación avanzada