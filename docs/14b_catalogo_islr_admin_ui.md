# 14b_catalogo_islr_admin_ui.md

# 1. Objetivo

Implementar una interfaz administrativa para gestionar el **catálogo global de conceptos de retención ISLR** dentro de RetenSaaS, tomando como base la tabla maestra definida en `14_catalogo_islr_global_2025.md`.

Este módulo debe permitir:

- visualizar el catálogo global ISLR
- filtrar y buscar conceptos
- activar / desactivar conceptos
- editar campos controlados
- mantener trazabilidad administrativa
- preparar una UX amigable para que luego el módulo de Pagos/Retención ISLR no exponga al usuario final los 70+ registros técnicos crudos

Este módulo es **administrativo/global**, no por tenant.

---

# 2. Contexto funcional

El catálogo ISLR ya fue definido con estructura técnica robusta, incluyendo:

- código SENIAT
- numeral
- literal
- concepto
- sujeto
- base imponible
- tipo de tarifa
- porcentaje de retención
- monto mínimo
- sustraendo
- cálculo especial
- notas
- activo

Ese catálogo debe ser fuente maestra del sistema para:
- cálculo de retenciones ISLR
- selección asistida en pagos
- futuras exportaciones y comprobantes

No debe quedar escondido únicamente en seed o SQL.

---

# 3. Decisión de diseño

## 3.1 Nivel de administración
Este catálogo debe administrarse a nivel **global del sistema**, no por empresa ni por tenant.

## 3.2 Quién puede administrarlo
Solo usuarios administrativos del sistema o rol equivalente de alto nivel.

No exponer esta pantalla al usuario operativo normal de empresa/contador si no corresponde.

## 3.3 Qué NO debe hacer este módulo
No debe permitir que cada empresa invente sus propias tasas ISLR libremente.
La idea es:
- centralización normativa
- control administrativo
- cambios auditables

---

# 4. Alcance del paso

Este módulo debe incluir:

1. listado de conceptos ISLR
2. búsqueda y filtros
3. edición controlada de conceptos
4. activación / desactivación
5. vista detalle si hace falta
6. separación visual entre información técnica y funcional
7. base para futuras versiones por año o vigencia

No implementar todavía:

- importación masiva desde Excel
- edición masiva
- versionado histórico complejo por año
- flujos de aprobación
- auditoría avanzada visible en UI
- permisos super granulares por campo

---

# 5. Fuente de datos

Usar el modelo global de conceptos ISLR ya definido o adaptado desde el catálogo maestro.

Campos relevantes esperados:

- `codigoSeniat`
- `numeral`
- `literal`
- `concepto`
- `sujeto`
- `baseImponiblePorcentaje`
- `tipoTarifa`
- `porcentajeRetencion`
- `montoMinimoBs`
- `sustraendoBs`
- `usaMontoMinimo`
- `usaSustraendo`
- `requiereCalculoEspecial`
- `formulaEspecial`
- `notas`
- `activo`

Si el modelo definitivo tiene otro nombre (por ejemplo `ConceptoISLR` o `ConceptoRetencionISLR`), mantener consistencia con el schema real.

---

# 6. Objetivo UX principal

La UI administrativa debe resolver dos necesidades distintas:

## 6.1 Vista técnica / interna
Permitir ver el catálogo completo con todos sus campos normativos.

## 6.2 Vista funcional / amigable
Permitir identificar fácilmente los conceptos “humanos” que luego usará el negocio:

- Honorarios profesionales
- Comisiones
- Servicios
- Arrendamiento de inmuebles
- Arrendamiento de muebles
- Fletes
- Publicidad
- Seguros
- Tarjetas de crédito
- etc.

La UI debe ayudar a entender el catálogo, no solo mostrar una tabla cruda.

---

# 7. Pantallas requeridas

## 7.1 Listado principal
Ruta sugerida:

```txt
/dashboard/admin/catalogos/islr

o la ruta equivalente coherente con tu módulo admin.

Debe mostrar:

código SENIAT
concepto
sujeto
tipo de tarifa
porcentaje
monto mínimo
sustraendo
activo
acción editar
acción ver detalle (opcional)
acción activar/desactivar
7.2 Edición

Pantalla o modal de edición controlada.

7.3 Detalle (opcional)

Vista más cómoda para revisar todos los campos largos o notas.

8. Filtros y búsqueda

El listado debe permitir como mínimo:

8.1 Búsqueda por texto

Buscar por:

concepto
código SENIAT
numeral
notas
8.2 Filtro por sujeto

Valores típicos:

PNR
PNNR
PJD
PJND
8.3 Filtro por tipo de tarifa
PORCENTAJE
TARIFA_2
8.4 Filtro por estado
Activos
Inactivos
8.5 Filtro por cálculo especial
Requiere cálculo especial
No requiere cálculo especial
9. Campos editables y no editables

Para evitar errores, este módulo debe distinguir entre:

9.1 Campos normalmente editables
notas
activo
formulaEspecial
montoMinimoBs
sustraendoBs
porcentajeRetencion
baseImponiblePorcentaje
requiereCalculoEspecial
9.2 Campos sensibles (editable solo si decides permitirlo)
codigoSeniat
numeral
literal
concepto
sujeto
tipoTarifa
Recomendación

Estos campos sensibles deberían:

poder verse siempre
pero editarse con más restricción
o dejarse solo para superadmin

Cursor debe documentar la decisión que tome.

10. Activación / desactivación

Debe existir una acción clara para marcar un concepto como:

activo
inactivo
Regla importante

Desactivar un concepto no debe romper históricos:

pagos anteriores
retenciones anteriores
comprobantes anteriores

Solo debe impedir o desalentar su uso futuro.

11. Presentación amigable del catálogo

La tabla principal no debe ser un muro indescifrable.

Recomendación visual

Mostrar columnas resumidas:

Código
Concepto
Sujeto
Tarifa
Base %
Mínimo
Sustraendo
Estado

Y dejar:

notas
fórmula especial
detalles extensos

para un drawer, modal o página detalle.

12. Formulario de edición

El formulario de edición debe ser claro y ordenado.

Agrupar por secciones:

12.1 Identificación
código SENIAT
numeral
literal
concepto
sujeto
12.2 Cálculo
base imponible %
tipo tarifa
porcentaje retención
monto mínimo
sustraendo
requiere cálculo especial
fórmula especial
12.3 Estado y notas
activo
notas
13. Reglas de validación

Aplicar validaciones con Zod o equivalente.

Validaciones mínimas
porcentajeRetencion >= 0 cuando aplica
baseImponiblePorcentaje >= 0 cuando aplica
montoMinimoBs >= 0
sustraendoBs >= 0
tipoTarifa debe ser valor permitido
sujeto debe ser uno de los códigos internos válidos
si tipoTarifa = TARIFA_2, permitir porcentajeRetencion = null
si requiereCalculoEspecial = true, formulaEspecial debe poder capturarse
14. Integración futura con Pagos

Este módulo debe dejar lista la base para que el selector de conceptos ISLR en pagos no muestre todos los registros técnicos indiscriminadamente.

Recomendación

Más adelante, construir un selector inteligente que:

agrupe por concepto visible
derive sujeto según proveedor
resuelva internamente el registro técnico correcto

Pero este paso no tiene que resolver todavía esa UX final del flujo de pago.

Solo debe dejar el catálogo bien administrable.

15. Arquitectura técnica requerida

Estructura sugerida:

src/modules/admin/catalogos/islr/
  ui/
    concepto-islr-table.tsx
    concepto-islr-form.tsx
    concepto-islr-filters.tsx
    concepto-islr-detail.tsx
  server/
    concepto-islr.service.ts
    concepto-islr.repository.ts
    concepto-islr.schema.ts
  actions/
    concepto-islr-actions.ts

Si tu estructura admin usa otra convención, mantener coherencia, pero separando:

UI
actions
service
repository
schema
16. Server actions requeridas

Crear al menos:

getConceptosISLR(filters)
getConceptoISLRById(id)
updateConceptoISLR(id, data)
toggleConceptoISLRActivo(id)

No hace falta CRUD totalmente libre en esta fase si el catálogo viene de seed controlado, pero sí debe haber edición y activación/desactivación.

17. Seguridad
17.1 Acceso restringido

Solo roles administrativos autorizados deben entrar aquí.

17.2 No modificar por tenant

El catálogo es global.
No duplicarlo por empresa ni por tenant.

17.3 Auditoría mínima

Si el sistema ya tiene logs o auditoría, registrar:

quién editó
cuándo editó

Si aún no existe esa capa, documentarlo como pendiente.

18. UI y diseño

Requisitos:

limpia
administrativa
profesional
fácil de filtrar
fácil de escanear visualmente

No sobrecargar la pantalla con todos los detalles a la vez.

19. Entregables requeridos

Cursor debe dejar implementado:

listado del catálogo ISLR
filtros y búsqueda
edición controlada
activación / desactivación
validación con schema
restricción de acceso administrativa
resumen técnico corto con:
qué implementó
qué campos dejó editables
qué campos dejó sensibles/restringidos
qué queda pendiente para el selector inteligente en pagos
20. Resultado esperado

Al finalizar este paso, el sistema debe permitir administrar de forma centralizada y segura el catálogo global de conceptos ISLR, sin depender exclusivamente del seed SQL y dejando una base sólida para el flujo operativo de pagos y retenciones ISLR.

21. Fuera de alcance

No implementar todavía:

importación masiva
historial completo de versiones
selector inteligente en pagos
vigencias anuales avanzadas
sincronización automática con fuentes externas