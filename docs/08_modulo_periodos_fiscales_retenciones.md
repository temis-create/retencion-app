# 08_modulo_periodos_fiscales_retenciones.md

# 1. Objetivo

Implementar el módulo de **Períodos Fiscales** de RetenSaaS para controlar los tramos temporales de operación fiscal por empresa, tipo de impuesto y frecuencia, dejando lista la base para:

- apertura de períodos
- consulta de períodos existentes
- cierre de períodos
- validaciones de bloqueo operativo
- soporte futuro para declaraciones y exportaciones

Este módulo es clave porque Compras, Pagos, Retenciones, Compensaciones y Exportaciones dependerán de él.

---

# 2. Alcance del paso

Este módulo debe incluir:

1. listado de períodos fiscales
2. creación manual de período fiscal
3. vista detalle básica
4. acción de cierre de período
5. validaciones de unicidad y consistencia
6. aislamiento por tenant y empresa
7. helper reutilizable para obtener período abierto
8. reglas preparadas para bloquear operaciones en períodos cerrados

No implementar todavía:

- reapertura de período
- generación masiva automática de calendario completo anual
- dashboard avanzado de períodos
- integración con declaraciones
- automatización por calendario SENIAT
- cierres encadenados complejos
- validación de saldos o exportaciones antes del cierre

---

# 3. Rutas requeridas

Implementar como mínimo:

```txt
/dashboard/fiscal/periodos
/dashboard/fiscal/periodos/nuevo
/dashboard/fiscal/periodos/[id]

Si tu estructura actual ya tiene una jerarquía distinta para fiscal, mantén consistencia, pero deja este módulo claramente dentro del área privada.

4. Entidad a utilizar

Usar el modelo PeriodoFiscal ya definido en Prisma.

Debe trabajar al menos con estos campos conceptuales/ya existentes:

tenantId
empresaId
anio
mes
tipoImpuesto
frecuencia
subperiodo
codigoPeriodo
fechaInicio
fechaFin
estado
fechaCierre
5. Funcionalidades requeridas
5.1 Listado

La página principal debe mostrar períodos fiscales del tenant autenticado.

Debe permitir al menos visualizar:

empresa
año
mes
tipo de impuesto
frecuencia
subperíodo si aplica
código del período
estado
fecha de cierre
enlace al detalle

Idealmente permitir filtro por empresa si ya encaja con el patrón actual.

5.2 Crear período

Debe existir un formulario para crear un período fiscal manualmente.

Campos mínimos del formulario:

empresaId
anio
mes
tipoImpuesto
frecuencia
subperiodo (opcional o requerido según frecuencia)
fechaInicio
fechaFin

El sistema debe generar automáticamente codigoPeriodo de forma consistente.

Regla de generación de código

Definir una convención clara para el MVP, por ejemplo:

Mensual IVA: 2026-03-IVA-M
Quincenal IVA 1: 2026-03-IVA-Q1
Quincenal IVA 2: 2026-03-IVA-Q2
Mensual ISLR: 2026-03-ISLR-M

Cursor puede ajustar el formato si propone uno más limpio, pero debe ser:

legible
consistente
determinista
único dentro de (empresaId, tipoImpuesto, codigoPeriodo)
5.3 Detalle de período

La vista detalle debe mostrar:

empresa
año / mes
tipo de impuesto
frecuencia
subperíodo
fechaInicio
fechaFin
estado
fechaCierre
timestamps

Y debe incluir acción de cerrar período si aún está abierto.

5.4 Cerrar período

Debe existir una acción server-side para marcar un período como CERRADO.

Reglas:

solo se puede cerrar si actualmente está ABIERTO
al cerrar, registrar fechaCierre
no debe permitir volver a cerrar un período ya cerrado
no implementar reapertura todavía
6. Validaciones de negocio
6.1 Unicidad

No permitir duplicar períodos con la misma combinación:

empresaId
tipoImpuesto
codigoPeriodo

Si el schema ya tiene unique para esto, capturar el error de forma amigable en la UI y en la action.

6.2 Mes válido

mes debe estar entre 1 y 12.

6.3 Año válido

Validar que anio sea razonable, por ejemplo:

mayor o igual a 2020
menor o igual a 2100
6.4 Frecuencia y subperíodo

Definir reglas mínimas:

si frecuencia = MENSUAL, subperiodo puede ser null
si frecuencia = QUINCENAL, subperiodo debe ser obligatorio y limitado a valores válidos del MVP (por ejemplo 1 o 2)
6.5 Empresa válida

Solo se pueden crear períodos sobre empresas del tenant autenticado.

6.6 Cierre coherente

No permitir cierre si el período no pertenece al tenant o no existe.

7. Arquitectura técnica requerida

Mantener el mismo patrón usado en Empresas y Proveedores.

Estructura sugerida:

src/modules/fiscal/periodos/
  ui/
    periodo-form.tsx
    periodo-table.tsx
    periodo-detail.tsx
  server/
    periodo-fiscal.service.ts
    periodo-fiscal.repository.ts
    periodo-fiscal.schema.ts
  actions/
    create-periodo-fiscal.ts
    close-periodo-fiscal.ts

Puedes adaptar nombres, pero mantén separación clara entre:

UI
validación
acciones
acceso a datos
lógica de negocio
8. Validación con Zod

Crear esquema Zod para el formulario de creación del período.

Debe validar al menos:

empresaId
anio
mes
tipoImpuesto
frecuencia
subperiodo
fechaInicio
fechaFin

Además, incluir refinements útiles como:

fechaInicio <= fechaFin
subperiodo requerido si frecuencia es quincenal
9. Estrategia de implementación
9.1 Listado

Crear función tipo:

getPeriodosByTenant(tenantId, empresaId?)
9.2 Detalle

Crear función tipo:

getPeriodoById(id, tenantId)
9.3 Creación

Crear función tipo:

createPeriodoFiscal(data, tenantId)

Debe:

validar empresa del tenant
generar codigoPeriodo
crear período con estado ABIERTO
9.4 Cierre

Crear función tipo:

closePeriodoFiscal(id, tenantId)

Debe:

validar pertenencia al tenant
validar estado actual
actualizar a CERRADO
asignar fechaCierre
9.5 Helper importante

Crear helper reutilizable tipo:

getPeriodoFiscalAbierto(empresaId, tipoImpuesto, fecha?)

Este helper será muy importante para Compras y Pagos.

Puede funcionar inicialmente así:

buscar período ABIERTO de esa empresa y tipo de impuesto
si se pasa fecha, permitir que luego se refine con rango de fechas

No resolver todavía toda la complejidad futura, pero dejar base limpia.

10. UI mínima requerida
10.1 Página listado

Debe incluir:

título del módulo
botón “Nuevo período”
tabla con resultados
estado vacío si no hay períodos
10.2 Página nuevo período

Debe incluir:

formulario claro
selección de empresa
selección de tipo impuesto
selección de frecuencia
subperíodo condicional si aplica
fechas
guardar / cancelar
10.3 Página detalle

Debe mostrar claramente:

estructura temporal
estado
acción de cierre si corresponde
11. UX y comportamiento

Requisitos mínimos:

mensajes claros de error
feedback al guardar
feedback al cerrar
redirección coherente
estados visuales claros (ABIERTO / CERRADO)

Mantener consistencia visual con Empresas y Proveedores.

12. Seguridad y multitenancy

Asegurar que:

no se puedan ver períodos de otro tenant
no se puedan cerrar períodos de otro tenant
no se puedan crear períodos sobre empresas de otro tenant
rutas inválidas respondan con manejo consistente (notFound, redirect o error controlado)
13. Preparación para módulos futuros

Este módulo debe dejar sentada la base para que luego:

Compras solo se registren en períodos válidos
Pagos solo se registren en períodos válidos
cierres bloqueen mutaciones posteriores
exportaciones se agrupen por período
compensaciones se relacionen por período

Documentar esta intención si hace falta en un breve resumen técnico.

14. Entregables requeridos

Cursor debe dejar implementado:

listado de períodos fiscales
formulario de creación
vista detalle
acción de cierre
validación con Zod
helper getPeriodoFiscalAbierto
filtro por tenant y empresa
resumen técnico corto con:
qué implementó
decisiones tomadas
qué quedó pendiente
15. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

crear períodos fiscales válidos
listarlos
consultar su detalle
cerrarlos
dejar una base sólida para Compras, Pagos y Retenciones
16. Fuera de alcance de este paso

No implementar todavía:

edición libre de períodos ya creados
reapertura
generación automática anual
calendario fiscal visual
validación de declaraciones previas al cierre
automatización de bloqueo total en todos los módulos (se preparará ahora y se aplicará progresivamente)