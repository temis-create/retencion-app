# 10_modulo_retencion_iva_retenciones.md

# 1. Objetivo

Implementar el módulo de **Retención IVA** de RetenSaaS, permitiendo calcular y registrar la retención de IVA asociada a una compra válida, conforme a reglas básicas del MVP y al modelo de dominio ya aprobado.

Este paso debe resolver:

- validaciones de elegibilidad de retención IVA
- determinación del porcentaje retenible
- creación o actualización de `RetencionIVA`
- relación 1:1 con `Compra`
- soporte para futuras agrupaciones en `ComprobanteIVA`
- base técnica para exportación TXT

Este módulo es la primera materialización de la lógica fiscal del sistema.

---

# 2. Alcance del paso

Este módulo debe incluir:

1. servicio de cálculo de retención IVA
2. reglas de exclusión básicas del MVP
3. creación de `RetencionIVA` vinculada a `Compra`
4. recálculo controlado de retención si la compra cambia
5. helper reusable para obtener retención por compra
6. integración con el flujo de compras
7. visualización básica de la retención en el detalle de compra o vista relacionada

No implementar todavía:

- emisión de `ComprobanteIVA`
- agrupación de múltiples retenciones bajo comprobante
- exportación TXT SENIAT
- reglas avanzadas de exclusión por caja chica, servicios públicos, viáticos u otros casos especiales finos
- retenciones sufridas / compensación en este flujo
- recalculo masivo por lote

---

# 3. Entidades involucradas

Usar estas entidades ya existentes del modelo:

- `Compra`
- `Proveedor`
- `PeriodoFiscal`
- `RetencionIVA`

Y sus campos relevantes:

## Compra
- empresaId
- proveedorId
- tipoDocumentoId
- periodoFiscalId
- montoExento
- montoBase
- impuestoIVA
- totalFactura
- estado

## Proveedor
- porcentajeRetencionIVA
- tipoContribuyente

## RetencionIVA
- compraId
- comprobanteIVAId
- periodoFiscalId
- estado
- porcentajeRetencionSnapshot
- montoBaseSnapshot
- impuestoIVASnapshot
- montoRetenido

---

# 4. Regla funcional principal

Para el MVP:

## Fórmula base
La retención IVA debe calcularse como:

```txt
Monto retenido = impuestoIVA * (porcentajeRetencionIVA / 100)

Donde:

impuestoIVA viene de la compra
porcentajeRetencionIVA viene del proveedor
el resultado debe guardarse como snapshot en RetencionIVA
5. Reglas del MVP para determinar si aplica retención
5.1 Sí aplica si
la compra está en estado válido (REGISTRADA)
existe período fiscal asociado
el proveedor está configurado con porcentaje de retención IVA válido
la compra tiene IVA > 0
5.2 No aplica si
impuestoIVA <= 0
la compra no tiene base imponible o IVA causado
el proveedor está configurado de forma incompatible para el MVP
el documento no corresponde a una operación retenible según las reglas básicas del MVP
5.3 Exclusión mínima del MVP

Para no inflar la complejidad aún, el MVP debe excluir explícitamente al menos:

proveedores con tipoContribuyente = FORMAL
compras con impuestoIVA = 0

Estas reglas deben quedar documentadas y encapsuladas en una función clara.

No implementar todavía todas las exclusiones del documento fiscal completo; solo dejar una estructura preparada para crecer.

6. Casos documentales a contemplar
6.1 Factura

Caso estándar. Puede generar retención IVA si cumple reglas.

6.2 Nota de crédito / débito

En esta fase:

la compra puede existir como documento
la retención puede calcularse solo si la lógica del documento sigue siendo válida
no hace falta todavía implementar ajuste automático sobre una retención anterior
Decisión del MVP

Cursor debe implementar una política clara y documentada. Recomendación:

permitir registrar RetencionIVA para compras tipo factura
y para NC/ND, dejar el cálculo deshabilitado por ahora o condicionado explícitamente

Esto es preferible a una automatización incompleta que rompa consistencia fiscal.

Si eliges restringir el cálculo a facturas en el MVP, documenta la decisión.

7. Estrategia de implementación recomendada
7.1 Servicio de evaluación

Crear función tipo:

evaluarRetencionIVAParaCompra(compraId, tenantId)

Debe devolver una estructura tipo:

{
  aplica: boolean
  motivoNoAplica?: string
  porcentaje: number
  impuestoIVA: number
  montoRetenido: number
}
7.2 Servicio de cálculo/persistencia

Crear función tipo:

calcularYGuardarRetencionIVA(compraId, tenantId)

Debe:

cargar compra con joins necesarios
validar pertenencia al tenant
evaluar si aplica
si no aplica:
no crear retención
devolver resultado con motivo
si aplica:
crear RetencionIVA si no existe
o actualizarla si existe y aún no está comprometida con comprobante
guardar snapshots
dejar estado CALCULADA
7.3 Servicio de consulta

Crear función tipo:

getRetencionIVAByCompraId(compraId, tenantId)
8. Reglas de persistencia
8.1 Relación con Compra

Debe mantenerse relación 1:1 práctica entre Compra y RetencionIVA.

No permitir múltiples RetencionIVA para una misma compra.

8.2 Snapshot obligatorio

Al guardar RetencionIVA, copiar al menos:

porcentajeRetencionSnapshot
montoBaseSnapshot
impuestoIVASnapshot
montoRetenido
8.3 Estado inicial

La retención nueva debe nacer como:

CALCULADA
8.4 Actualización permitida

Si la compra cambia y la retención aún no tiene comprobanteIVAId, debe poder recalcularse y actualizarse.

8.5 Actualización prohibida

Si la retención ya está asociada a ComprobanteIVA, no debe recalcularse automáticamente.

Debe lanzar error claro o devolver resultado controlado.

9. Integración con Compras

Este paso debe conectar con el módulo de Compras ya existente.

Regla recomendada para el MVP

Después de crear una compra válida:

se puede disparar el cálculo automáticamente
o dejar un botón/acción explícita de “Calcular retención IVA”
Recomendación

Para esta fase, implementar cálculo explícito y controlado, no totalmente automático.

Motivo:

facilita depuración
evita comportamientos mágicos
deja más claro el flujo fiscal

Por lo tanto, agregar una acción server-side específica para calcular la retención de una compra.

Ejemplo:

calcularRetencionIVAAction(compraId)
10. UI mínima requerida
10.1 En detalle de compra

Mostrar una sección de “Retención IVA” que indique:

si aplica o no
motivo si no aplica
porcentaje retenible
impuesto IVA base
monto retenido
estado de la retención si existe
10.2 Acción manual

En la vista de detalle de compra, incluir botón:

Calcular retención IVA

Solo mostrarlo si:

la compra está registrada
el período no está cerrado
la retención no está comprometida en comprobante
10.3 Si ya existe retención

Mostrar:

monto retenido
porcentaje snapshot
estado
si está libre o comprometida

No hace falta una página CRUD separada todavía para retenciones IVA.

11. Bloqueos y validaciones
11.1 Tenant

No se puede calcular retención para compras de otro tenant.

11.2 Período cerrado

Si el período fiscal de la compra está cerrado, no debe permitirse recalcular ni crear retención nueva.

11.3 Compra inválida

No se puede calcular sobre:

compra inexistente
compra anulada
compra sin IVA
compra sin proveedor válido
11.4 Comprobante asociado

Si la RetencionIVA ya tiene comprobanteIVAId, bloquear recálculo.

12. Arquitectura técnica requerida

Mantener el patrón actual del sistema.

Estructura sugerida:

src/modules/retenciones/iva/
  ui/
    retencion-iva-card.tsx
    calcular-retencion-iva-button.tsx
  server/
    retencion-iva.service.ts
    retencion-iva.repository.ts
    retencion-iva.rules.ts
  actions/
    calcular-retencion-iva.ts

Puedes adaptar nombres, pero mantener separación clara entre:

reglas
servicio
acciones
UI
13. Reglas encapsuladas

Crear una capa clara de reglas, por ejemplo en:

retencion-iva.rules.ts

Debe contener funciones tipo:

esProveedorExcluidoDeRetencionIVA(...)
esCompraRetenibleIVA(...)
calcularMontoRetenidoIVA(...)

Esto es importante para que luego el módulo pueda crecer sin ensuciar el service.

14. Validación de montos y precisión

Usar la misma convención monetaria del sistema.

Requisitos:

no usar floats de forma ingenua en reglas críticas
respetar Decimal/manejo numérico coherente con Prisma
documentar o implementar redondeo consistente si hace falta

Para el MVP, si conviertes a Number en la capa de cálculo, hazlo de forma explícita y controlada.

15. Entregables requeridos

Cursor debe dejar implementado:

reglas base de retención IVA
servicio de evaluación
servicio de cálculo y persistencia
action manual para calcular retención
integración visual en detalle de compra
bloqueo por período cerrado y por comprobante asociado
resumen técnico corto con:
qué implementó
qué reglas asumió
qué quedó pendiente para comprobante IVA
16. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

evaluar si una compra genera retención IVA
calcular el monto retenido
guardar o actualizar RetencionIVA
mostrar la información en la compra
bloquear recálculo cuando ya exista comprobante o el período esté cerrado
17. Fuera de alcance de este paso

No implementar todavía:

ComprobanteIVA
agrupación de retenciones
emisión correlativa
exportación TXT SENIAT
compensación de IVA retenido
cálculo avanzado para NC/ND
motor completo de exclusiones tributarias