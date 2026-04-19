
---

# MD 2: `10c_schema_fiscal_iva_extendido.md`

```md
# 10c_schema_fiscal_iva_extendido.md

# 1. Objetivo

Extender el modelo de datos y la captura operativa del sistema para soportar correctamente el motor completo de reglas de Retención IVA tipo SENIAT.

Este paso no implementa todavía todo el motor, sino que define qué campos, flags y relaciones adicionales necesita el sistema para poder evaluar las exclusiones y supuestos de retención total de forma realista.

---

# 2. Problema actual

El sistema ya calcula retención IVA básica, pero el modelo actual no captura suficiente contexto fiscal para resolver todas las reglas reales.

Hoy el sistema ya tiene:
- empresa con `agenteRetencionIVA`
- proveedor con `tipoContribuyente` y `porcentajeRetencionIVA`
- compra con montos, documento y período
- retención IVA básica calculada :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5}

Pero no captura aún varios flags necesarios para el motor real.

---

# 3. Estrategia

Separar la ampliación en tres niveles:

1. campos en `Proveedor`
2. campos en `Compra`
3. snapshots o metadatos en `RetencionIVA`

Además, definir qué debe capturarse en UI y qué puede venir como configuración futura o integración externa.

---

# 4. Extensión propuesta para Proveedor

Agregar los siguientes campos al modelo `Proveedor`:

## 4.1 Campos recomendados
- `esAgentePercepcionIVA` (Boolean, default false)
- `rubroPercepcionIVA` (String? o enum?)
- `proveedorMarcadoRetencion100` (Boolean, default false)
- `rifRegistrado` (Boolean, default true)
- `rifValidadoPortalFiscalAt` (DateTime?)

## 4.2 Justificación
Estos campos permiten resolver:
- agente de percepción en rubros específicos
- proveedor sujeto a 100%
- proveedor sin RIF registrado
- trazabilidad de validación fiscal

## 4.3 Decisión importante
`tipoContribuyente` actual se mantiene y sigue siendo clave para:
- FORMAL
- ORDINARIO
- ESPECIAL

No sustituirlo; complementarlo.

---

# 5. Extensión propuesta para Compra

Agregar al modelo `Compra` campos fiscales operativos.

## 5.1 Naturaleza IVA de la operación
Agregar:
- `naturalezaIVA` (enum sugerido)
  - `GRAVADA`
  - `EXENTA`
  - `EXONERADA`
  - `NO_SUJETA`

Esto evita depender solo de `impuestoIVA = 0`.

## 5.2 Clasificadores de exclusión
Agregar:
- `esViatico` (Boolean, default false)
- `esGastoReembolsable` (Boolean, default false)
- `esServicioPublicoDomiciliario` (Boolean, default false)
- `esOperacionArticulo2RetencionTotal` (Boolean, default false)
- `tienePercepcionAnticipadaIVA` (Boolean, default false)

## 5.3 Formalidad documental
Agregar:
- `ivaDiscriminado` (Boolean, default true)
- `cumpleRequisitosFormales` (Boolean, default true)

## 5.4 UT y umbrales
Agregar:
- `valorUTSnapshot` (Decimal?)
- `montoOperacionUTSnapshot` (Decimal?)

## 5.5 Justificación
Estos campos permiten resolver:
- exclusiones por naturaleza de la operación
- exclusiones por contexto operativo
- umbrales por 20 U.T.
- retención 100% por documento
- trazabilidad histórica

---

# 6. Extensión propuesta para RetencionIVA

Ampliar `RetencionIVA` para persistir el resultado del motor de forma auditable.

## 6.1 Campos recomendados
- `motivoCodigo` (String?)
- `motivoDescripcion` (String?)
- `categoriaRegla` (Enum o String?)
- `baseLegalNorma` (String?)
- `baseLegalArticulo` (String?)
- `baseLegalDescripcion` (String?)
- `versionMotor` (String?)
- `valorUTSnapshot` (Decimal?)
- `montoOperacionUTSnapshot` (Decimal?)
- `aplicaRetencion` (Boolean?) si decides persistir evaluaciones negativas en una tabla o estructura futura

## 6.2 Justificación
El sistema necesita poder explicar:
- por qué sí retuvo
- por qué no retuvo
- bajo qué artículo
- con qué versión del motor

## 6.3 Decisión de diseño
Si no quieres inflar demasiado `RetencionIVA`, documentar qué campos irán ahí y cuáles podrían ir a una futura tabla de auditoría de decisión.

---

# 7. Enums nuevos sugeridos

## 7.1 NaturalezaIVA
```txt
GRAVADA
EXENTA
EXONERADA
NO_SUJETA

7.2 CategoriaReglaRetencionIVA
EXCLUSION_ABSOLUTA
EXCLUSION_CONDICIONAL
RETENCION_TOTAL
RETENCION_GENERAL

Opcionalmente, si prefieres no tocar enums ahora, puedes comenzar con strings controlados, pero deja documentado si esa es una decisión temporal.

8. Ajustes de UI requeridos
8.1 En formulario de Proveedor

Agregar, si entra en este paso o en uno posterior cercano:

checkbox esAgentePercepcionIVA
selector/enum rubroPercepcionIVA
checkbox proveedorMarcadoRetencion100
checkbox rifRegistrado
8.2 En formulario de Compra

Agregar:

selector naturalezaIVA
checkbox esViatico
checkbox esGastoReembolsable
checkbox esServicioPublicoDomiciliario
checkbox tienePercepcionAnticipadaIVA
checkbox ivaDiscriminado
checkbox cumpleRequisitosFormales
checkbox esOperacionArticulo2RetencionTotal
8.3 Regla de UX

No sobrecargar la pantalla principal.
Si hace falta, agrupar estos campos en un bloque colapsable tipo:

“Clasificación fiscal avanzada IVA”
9. Integración con UnidadTributaria

La compra debe poder asociarse al valor de UT vigente en el momento de la operación para resolver:

umbral de 20 U.T.
trazabilidad histórica
Recomendación

Al registrar o recalcular compra:

resolver UT vigente por fecha
copiar a snapshot en compra o retención

No depender de leer la UT global en tiempo real al auditar una operación pasada.

10. Relación con modelo actual

El modelo actual ya contempla:

Proveedor.tipoContribuyente
Proveedor.porcentajeRetencionIVA
UnidadTributaria
Compra con datos monetarios
RetencionIVA con snapshots base

La extensión debe respetar eso y no rediseñar el dominio desde cero.

11. Estrategia de implementación sugerida

Implementar en dos fases:

Fase A

Ampliación mínima para cubrir motor real:

naturalezaIVA
esViatico
esGastoReembolsable
ivaDiscriminado
cumpleRequisitosFormales
proveedorMarcadoRetencion100
rifRegistrado
esOperacionArticulo2RetencionTotal
Fase B

Ampliación avanzada:

esAgentePercepcionIVA
rubroPercepcionIVA
tienePercepcionAnticipadaIVA
trazabilidad de validación de Portal Fiscal
snapshots UT más completos
12. Entregables requeridos

Cursor debe dejar:

propuesta concreta de cambios al schema
lista de campos nuevos por entidad
enums nuevos sugeridos
recomendación de qué campos van en UI y cuáles no
estrategia por fases
resumen técnico corto con:
qué gaps del motor cubre cada campo nuevo
qué puede implementarse ya
qué depende de integración o captura operativa futura
13. Resultado esperado

Al finalizar este paso, debe quedar definido con precisión cómo extender el schema y la captura operativa del sistema para soportar el motor completo de reglas IVA tipo SENIAT sin improvisaciones posteriores.