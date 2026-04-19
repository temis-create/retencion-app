# 13_modulo_pagos_islr_retenciones.md

# 1. Objetivo

Implementar el módulo de **Pagos ISLR** en RetenSaaS como base para el cálculo de retenciones de impuesto sobre la renta a terceros, siguiendo la normativa venezolana.

Este módulo debe permitir:

- registrar pagos a proveedores
- vincular pagos con compras (facturas)
- soportar pagos parciales y múltiples
- definir el evento generador de la retención ISLR
- preparar el sistema para cálculo posterior de retención ISLR

Este módulo NO calcula aún la retención, pero establece el evento base sobre el cual se calculará.

---

# 2. Principio clave de ISLR

## 🔴 Diferencia crítica con IVA

| IVA | ISLR |
|-----|------|
| Se basa en la factura (compra) | Se basa en el pago |
| Se calcula al registrar la compra | Se calcula al pagar o abonar |
| Documento base: factura | Documento base: pago |

## Regla fundamental

La retención ISLR se genera cuando ocurre:

```txt
Pago o Abono en Cuenta (lo que ocurra primero)

3. Alcance del módulo

Este paso debe incluir:

modelo de Pago
relación PagoCompra
registro de pagos
soporte de pagos parciales
soporte de pagos múltiples
base para disparar retención ISLR
validación contra período fiscal ISLR

No implementar todavía:

cálculo de retención ISLR
comprobante ISLR
exportación TXT ISLR
retenciones de nómina (AR-I)
4. Modelo de datos
4.1 Entidad Pago

Debe incluir como mínimo:

id
tenantId
empresaId
proveedorId
fechaPago
montoPago
referenciaPago (opcional)
observacion (opcional)
tipoEventoRetencion (CRÍTICO)
createdAt
tipoEventoRetencion

Enum:

PAGO
ABONO_EN_CUENTA

Este campo es obligatorio porque define cuándo se genera la retención.

4.2 Relación PagoCompra

Resolver relación muchos a muchos:

un pago puede cubrir varias compras
una compra puede ser pagada en varios pagos

Campos:

id
pagoId
compraId
montoAplicado
5. Reglas funcionales
5.1 Pagos parciales

Una compra puede:

pagarse en varios pagos
generar retención proporcional
5.2 Pago múltiple

Un pago puede:

cubrir varias compras
incluso de distintas fechas
5.3 Evento de retención

El sistema debe permitir registrar si el evento es:

pago real
abono en cuenta

Esto es obligatorio para ISLR.

6. Flujo funcional esperado
Compra → Pago → (futuro) Retención ISLR → (futuro) Comprobante ISLR
7. Validaciones
7.1 Multitenancy
pago debe pertenecer al tenant
7.2 Integridad
proveedor debe existir
compras deben existir
compras deben pertenecer a la empresa
7.3 Montos

Validar:

montoAplicado ≤ saldo de la compra
suma de montosAplicados ≤ montoPago
7.4 Período fiscal

Antes de registrar pago:

debe existir período fiscal ISLR abierto

Usar helper:

requirePeriodoAbierto(empresaId, 'ISLR', fechaPago)
8. UI requerida
8.1 Listado de pagos

Ruta sugerida:

/dashboard/pagos

Mostrar:

fecha
proveedor
monto
tipo evento
cantidad de compras asociadas
8.2 Formulario de pago

Debe permitir:

seleccionar empresa
seleccionar proveedor
seleccionar compras pendientes
ingresar monto total
distribuir montos por compra
seleccionar tipo de evento (PAGO / ABONO)
8.3 Detalle de pago

Mostrar:

información del pago
compras asociadas
montos aplicados
total
estado futuro (cuando exista retención)
9. Integración con Compras

En el detalle de compra mostrar:

pagos asociados
saldo pendiente
historial de pagos

Esto es clave para control financiero y base de retención ISLR.

10. Arquitectura técnica

Estructura sugerida:

src/modules/pagos/
  server/
    pago.schema.ts
    pago.service.ts
    pago.repository.ts
  actions/
    pago-actions.ts
  ui/
    pago-form.tsx
    pago-table.tsx
    pago-detail.tsx
11. Lógica de negocio clave
11.1 Cálculo de saldo de compra

Cada compra debe tener:

saldo = totalFactura - suma(pagos aplicados)
11.2 Validación de aplicación

No permitir:

aplicar más monto del saldo
aplicar pagos a compras de otro proveedor
12. Preparación para retención ISLR

Este módulo debe dejar listo:

contexto completo de pago
vínculo pago → compra
base para cálculo proporcional

El cálculo ISLR se hará en el siguiente paso.

13. Server actions

Crear:

createPago
updatePago
getPagosByTenant
getPagoDetail
14. Entregables requeridos

Cursor debe dejar implementado:

modelo Pago
modelo PagoCompra
CRUD de pagos
formulario funcional
listado
detalle
validaciones de montos
validación de período fiscal ISLR
integración con compras
resumen técnico corto
15. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

registrar pagos reales
vincular pagos con compras
manejar pagos parciales
manejar pagos múltiples
preparar base real para retención ISLR
16. Fuera de alcance

No implementar aún:

cálculo ISLR
comprobante ISLR
exportación TXT ISLR
retención de empleados (AR-I)