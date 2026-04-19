# 14e_selector_inteligente_conceptos_islr.md

# 1. Objetivo

Implementar un **selector inteligente de conceptos ISLR** en el módulo de Pagos de RetenSaaS, que permita al usuario elegir de forma clara y segura el tipo de retención, sin exponer directamente el catálogo técnico completo.

Este selector debe:

- simplificar la selección para el usuario
- reducir errores humanos
- mapear automáticamente al `ConceptoISLR` correcto
- usar el catálogo global ISLR como base
- mantener consistencia con el motor de cálculo

---

# 2. Problema actual

El catálogo ISLR contiene múltiples registros técnicos:

- códigos SENIAT
- numerales
- literales
- sujetos (PNR, PJD, etc.)
- tarifas
- sustraendos

Si el usuario ve esto directamente:

❌ se confunde  
❌ selecciona mal  
❌ genera retenciones incorrectas  

---

# 3. Principio de diseño

Separar:

## 🔴 Vista usuario
Conceptos amigables:

- Honorarios profesionales
- Servicios
- Arrendamiento de inmuebles
- Arrendamiento de muebles
- Fletes
- Publicidad
- Comisiones
- Seguros
- Tarjetas de crédito

## 🟢 Motor interno
Resolver automáticamente:

- sujeto (`PNR`, `PJD`, etc.)
- código SENIAT
- base imponible
- porcentaje
- sustraendo
- tipo tarifa

---

# 4. Arquitectura del selector

## 4.1 Nueva capa lógica

Crear una capa intermedia:

```txt
ConceptoISLR_UI

jemplo:

type ConceptoISLRUI = {
  id: string
  nombre: string
  categoria: string
  requiereSujeto?: boolean
}
5. Mapeo interno

El selector NO devuelve directamente un ConceptoISLR.

Debe:

recibir selección del usuario
determinar sujeto del proveedor
buscar el registro correcto en ConceptoISLR
6. Resolución automática del concepto

Crear helper:

resolverConceptoISLR({
  conceptoUIId,
  sujeto,
}): ConceptoISLR

Debe:

buscar en catálogo global
filtrar por:
concepto
sujeto
devolver el registro técnico correcto
7. Determinación automática del sujeto

El sistema debe derivar el sujeto desde el proveedor:

function getSujetoProveedor(proveedor) {
  if (proveedor.tipo === 'PN' && proveedor.residencia === 'VE') return 'PNR'
  if (proveedor.tipo === 'PN') return 'PNNR'
  if (proveedor.tipo === 'PJ' && proveedor.domicilio === 'VE') return 'PJD'
  return 'PJND'
}

Esto NO debe preguntarse al usuario.

8. UI del selector
Ubicación

En el formulario de pago:

Concepto de Retención ISLR
Tipo de componente

Recomendado:

select agrupado
o dropdown con categorías
Ejemplo visual
Servicios
  - Honorarios profesionales
  - Servicios técnicos
  - Comisiones

Arrendamientos
  - Arrendamiento de inmuebles
  - Arrendamiento de muebles

Operaciones especiales
  - Tarjetas de crédito
  - Seguros

Transporte
  - Fletes nacionales

Publicidad
  - Publicidad y propaganda
9. Flujo completo
Usuario selecciona concepto amigable
Sistema detecta sujeto del proveedor
Sistema resuelve ConceptoISLR
Motor calcula retención
10. Validaciones
10.1 Si no hay match

Si no existe combinación:

concepto + sujeto

Debe:

bloquear cálculo
mostrar error claro:
No existe configuración ISLR para este tipo de proveedor y concepto
10.2 Concepto inactivo

Si el concepto está inactivo:

no permitir selección
o mostrarlo deshabilitado
11. Persistencia

En RetencionISLR guardar:

conceptoISLRId (técnico)
opcional: conceptoUILabel (para UX futura)
12. Integración con motor ISLR

El motor NO debe cambiar.

Debe recibir:

conceptoISLRId

ya resuelto por el selector.

13. Reglas importantes
NO permitir:
selección manual de sujeto
selección directa del código SENIAT
selección directa de base imponible
SÍ permitir:
selección simple por tipo de operación
14. Casos especiales
Tarjeta de crédito

Debe mapear automáticamente al concepto correcto con:

cálculo especial
fórmula específica
Conceptos con Tarifa 2

El selector no debe mostrar “Tarifa 2”.

Eso lo resuelve el motor.

15. Arquitectura técnica
src/modules/pagos/islr-selector/
  ui/
    concepto-islr-selector.tsx
  server/
    concepto-islr-resolver.ts
    concepto-islr-ui.ts
16. Server logic

Crear:

getConceptosISLRUI()
resolverConceptoISLR()
17. Entregables requeridos

Cursor debe dejar implementado:

selector UI amigable
capa intermedia ConceptoISLR_UI
resolver automático
integración con pagos
validaciones
resumen técnico corto
18. Resultado esperado

El usuario debe poder:

registrar pago
seleccionar concepto fácilmente
calcular retención sin errores
no ver complejidad técnica
19. Fuera de alcance

No implementar:

personalización por empresa
edición del catálogo desde este selector
lógica tributaria en UI
20. Impacto

Este módulo:

reduce errores en producción
mejora UX drásticamente
protege el motor ISLR
hace usable el sistema para contadores reales