# 13b_modulo_retencion_islr_retenciones.md

# 1. Objetivo

Implementar el módulo de **Retención ISLR** de RetenSaaS para calcular, registrar y preparar la retención de impuesto sobre la renta aplicable a pagos o abonos en cuenta a terceros, conforme al marco operativo venezolano.

Este paso debe resolver:

- evaluación de si un pago o abono en cuenta genera retención ISLR
- determinación del concepto de retención aplicable
- cálculo del monto retenido
- creación o actualización de `RetencionISLR`
- relación entre `Pago`, `PagoCompra` y `RetencionISLR`
- base para comprobante y exportación futura

Este módulo debe apoyarse en el principio ya definido en el sistema:

```txt
La retención ISLR nace cuando ocurre el pago o el abono en cuenta, lo que ocurra primero.

2. Base normativa y criterio del sistema

Tomar como base operativa:

Reglamento de Retenciones de ISLR (Decreto 1.808)
lógica de declaración mensual SENIAT para retenciones ISLR
Ley de ISLR en su estructura vigente de hechos gravados y sujetos

La implementación debe separar:

norma
parametrización
decisiones del MVP

No mezclar reglas tributarias con UI.

3. Diferencia crítica con IVA
IVA
nace sobre la compra / factura
su flujo es: Compra → Retención IVA → Comprobante IVA
ISLR
nace sobre el pago o abono en cuenta
su flujo es: Compra → Pago/Abono → Retención ISLR → Comprobante ISLR

Esto debe quedar explícito en el dominio y en el código.

4. Alcance del paso

Este módulo debe incluir:

evaluación de elegibilidad de retención ISLR sobre un Pago
uso obligatorio de tipoEventoRetencion (PAGO o ABONO_EN_CUENTA)
selección del ConceptoISLR aplicable
cálculo del monto retenido según porcentaje/base imponible del concepto
creación o actualización de RetencionISLR
helper reusable para consultar retención ISLR por pago
integración visual básica con el detalle del pago

No implementar todavía:

comprobante ISLR
exportación XML/TXT ISLR
retenciones de nómina / AR-I
cálculo multi-tabla avanzado de dividendos y enriquecimientos especiales
regularización anual
5. Entidades involucradas

Usar estas entidades del dominio ya aprobado:

Pago
PagoCompra
Compra
Proveedor
ConceptoISLR
PeriodoFiscal
RetencionISLR

Campos relevantes esperados:

Pago
tenantId
empresaId
proveedorId
fechaPago
montoPago
tipoEventoRetencion
periodoFiscalId
PagoCompra
pagoId
compraId
montoAplicado
ConceptoISLR
código
descripción
porcentajeBaseImponible
tarifaPJ
tarifaPN
mínimoUT
aplicaSustraendo
RetencionISLR
pagoId
periodoFiscalId
conceptoISLRId
estado
baseCalculoSnapshot
porcentajeRetencionSnapshot
montoRetenido
6. Regla funcional principal

La retención ISLR debe evaluarse sobre el pago o abono en cuenta registrado, no sobre la compra aislada.

Regla obligatoria

Para calcular retención ISLR, el sistema debe validar primero:

que el Pago exista
que pertenezca al tenant
que tenga tipoEventoRetencion válido
que tenga período fiscal ISLR abierto
que tenga proveedor válido
que tenga compras asociadas coherentes
que exista concepto ISLR aplicable
7. Política de cálculo del MVP

Para el MVP, el cálculo debe orientarse a pagos a terceros típicos, como:

honorarios profesionales
servicios
arrendamientos
fletes
otros conceptos del catálogo mínimo sembrado en ConceptoISLR
Regla base del cálculo

El cálculo debe seguir este esquema:

Base de cálculo ISLR = monto sujeto * porcentajeBaseImponible
Retención ISLR = base de cálculo * tarifa aplicable

Donde:

monto sujeto parte del pago o del monto aplicado sobre las compras
porcentajeBaseImponible viene de ConceptoISLR
la tarifa aplicable depende del tipo de beneficiario (persona natural / jurídica, residente/no domiciliado, según el catálogo y reglas que ya soporte el sistema)
Decisión MVP

Para esta fase, usar el catálogo ConceptoISLR como fuente oficial de:

base imponible
porcentaje o tarifa
umbral mínimo si aplica

No hardcodear porcentajes directamente en el service.

8. Selección del concepto ISLR

Cada pago que genere retención debe estar asociado a un ConceptoISLR.

Requisito funcional

El sistema debe permitir:

seleccionar ConceptoISLR al registrar o editar el pago
o derivarlo de la compra/proveedor si ya existe esa lógica, pero solo si es totalmente confiable
Recomendación

En esta fase, hacerlo explícito:

el usuario selecciona el concepto ISLR al registrar el pago

Esto evita ambigüedades.

9. Elegibilidad de la retención ISLR

Crear una función tipo:

evaluarRetencionISLRParaPago(pagoId, tenantId)

Debe devolver una estructura tipo:

{
  aplica: boolean
  motivoNoAplica?: string
  conceptoId?: string
  baseCalculo: number
  porcentajeRetencion: number
  montoRetenido: number
}
Debe validar al menos:
pago existente
proveedor válido
evento de retención válido
período fiscal ISLR abierto
concepto ISLR seleccionado
monto retenible mayor a cero
umbral mínimo si el concepto lo exige
10. Reglas mínimas del MVP para no aplicar

El sistema debe devolver NO_APLICA o equivalente si:

no existe concepto ISLR
el pago no tiene monto sujeto válido
el concepto no genera retención en ese escenario
el pago pertenece a período cerrado
el proveedor o la empresa no son válidos
el monto no supera el mínimo si aplica según el concepto

Estas decisiones deben quedar documentadas en un helper o motor claro.

11. Servicio de cálculo y persistencia

Crear función tipo:

calcularYGuardarRetencionISLR(pagoId, tenantId)

Debe:

cargar pago con relaciones necesarias
validar pertenencia al tenant
evaluar si aplica
si no aplica:
no crear retención
devolver motivo claro
si aplica:
crear RetencionISLR si no existe
o actualizarla si aún no está comprometida en comprobante futuro
guardar snapshots
dejar estado CALCULADA
12. Reglas de persistencia
12.1 Relación con Pago

Mantener relación 1:1 práctica entre Pago y RetencionISLR para esta fase, salvo que tu modelo ya contemple una estrategia distinta.

12.2 Snapshot obligatorio

Persistir como mínimo:

conceptoISLRId
baseCalculoSnapshot
porcentajeRetencionSnapshot
montoRetenido
tipoEventoRetencionSnapshot
fechaPagoSnapshot si tu modelo lo permite o si conviene documentarlo
12.3 Estado inicial

La nueva retención debe quedar en:

CALCULADA
12.4 Actualización permitida

Si el pago cambia y la retención aún no tiene comprobante ISLR futuro, debe poder recalcularse.

13. Integración con Pagos

Este módulo debe conectarse con el módulo ya implementado de pagos.

Política recomendada

Usar cálculo explícito y controlado, igual que en IVA.

Agregar una acción server-side:

calcularRetencionISLRAction(pagoId)

No hacer cálculo mágico automático en segundo plano en esta fase.

14. UI mínima requerida
14.1 En detalle de pago

Mostrar una sección “Retención ISLR” con:

si aplica o no
motivo si no aplica
concepto ISLR
base de cálculo
porcentaje retenido
monto retenido
estado de la retención
14.2 Acción manual

Agregar botón:

Calcular retención ISLR

Solo mostrar si:

el pago existe
tiene período ISLR abierto
no tiene comprobante futuro asociado
no está anulado o invalidado
14.3 Si ya existe retención

Mostrar:

monto retenido
concepto aplicado
estado
señal visual si luego queda comprometida en comprobante
15. Bloqueos y validaciones
15.1 Tenant

No se puede calcular retención ISLR para pagos de otro tenant.

15.2 Período cerrado

Si el período fiscal ISLR del pago está cerrado, no debe permitirse calcular o recalcular.

15.3 Pago inválido

No calcular sobre:

pago inexistente
pago sin compras asociadas válidas si el flujo lo exige
pago sin concepto ISLR
pago con monto retenible cero
15.4 Comprobante futuro

Si la retención ISLR ya estuviera comprometida en comprobante ISLR, bloquear recálculo.

16. Arquitectura técnica requerida

Mantener patrón modular claro.

Estructura sugerida:

src/modules/retenciones/islr/
  ui/
    retencion-islr-card.tsx
    calcular-retencion-islr-button.tsx
  server/
    retencion-islr.service.ts
    retencion-islr.rules.ts
    retencion-islr.repository.ts
  actions/
    calcular-retencion-islr.ts

Separar claramente:

reglas
servicio
persistencia
UI
17. Reglas encapsuladas

Crear capa clara de reglas, por ejemplo:

esPagoRetenibleISLR(...)
resolverTarifaISLR(...)
calcularBaseRetencionISLR(...)
calcularMontoRetenidoISLR(...)

No meter toda la lógica en un solo archivo de servicio.

18. Precisión monetaria

Usar el mismo criterio monetario del sistema:

manejar montos con Decimal o conversión controlada
no usar floats ingenuos en reglas tributarias
redondear consistentemente donde corresponda
19. Entregables requeridos

Cursor debe dejar implementado:

reglas base de retención ISLR
servicio de evaluación
servicio de cálculo y persistencia
action manual para calcular retención
integración visual en detalle de pago
bloqueo por período cerrado y por comprobante futuro
resumen técnico corto con:
qué implementó
qué conceptos asumió
qué quedó pendiente para comprobante/exportación ISLR
20. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

evaluar si un pago genera retención ISLR
calcular el monto retenido
guardar o actualizar RetencionISLR
mostrar la información en el pago
dejar el sistema listo para comprobante ISLR y exportación futura
21. Fuera de alcance de este paso

No implementar todavía:

comprobante ISLR
exportación XML/TXT ISLR
nómina y AR-I
dividendos
retenciones especiales avanzadas fuera del catálogo MVP
conciliación fiscal anual