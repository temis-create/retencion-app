# 14c_motor_calculo_islr.md

# 1. Objetivo

Diseñar e implementar el **motor de cálculo ISLR** de RetenSaaS para evaluar, calcular y persistir retenciones de impuesto sobre la renta sobre pagos o abonos en cuenta, utilizando como fuente normativa y paramétrica el catálogo global ISLR 2025 ya definido e implementado.

Este motor debe:

- trabajar sobre `Pago`, no sobre `Compra` aislada
- usar `ConceptoISLR` como fuente maestra de reglas
- determinar si aplica o no la retención
- calcular base retenible
- aplicar porcentaje o Tarifa N° 2 según corresponda
- considerar monto mínimo y sustraendo
- persistir snapshots auditables en `RetencionISLR`

---

# 2. Base normativa y lógica de dominio

Tomar como base operativa:

- Reglamento Parcial de la Ley de ISLR en materia de retenciones (Decreto 1.808), que establece que la retención nace al pago o abono en cuenta
- catálogo global ISLR 2025 ya definido por el proyecto
- lógica mensual de enteramiento/declaración ISLR

## Regla cardinal
La retención debe evaluarse **en el momento del pago o del abono en cuenta, lo que ocurra primero**. :contentReference[oaicite:2]{index=2}

---

# 3. Principio del motor

El motor no debe depender de porcentajes hardcodeados en el service.

Debe resolver la retención a partir de:

- contexto del pago
- clasificación del proveedor
- concepto ISLR seleccionado
- sujeto normalizado (`PNR`, `PNNR`, `PJD`, `PJND`)
- reglas del catálogo (`baseImponiblePorcentaje`, `tipoTarifa`, `porcentajeRetencion`, `montoMinimoBs`, `sustraendoBs`, `requiereCalculoEspecial`) :contentReference[oaicite:3]{index=3}

---

# 4. Resultado funcional esperado

El motor debe devolver una estructura tipo:

```ts
type ResultadoMotorISLR = {
  aplica: boolean
  tipoResultado: "NO_APLICA" | "RETENCION_PORCENTAJE" | "RETENCION_TARIFA_2"
  conceptoId?: string
  sujetoAplicado?: "PNR" | "PNNR" | "PJD" | "PJND"
  basePago: number
  baseCalculo: number
  porcentajeBaseImponible?: number | null
  porcentajeRetencion?: number | null
  montoMinimoBs?: number | null
  sustraendoBs?: number | null
  montoRetenido: number
  motivoCodigo: string
  motivoDescripcion: string
  categoriaRegla:
    | "NO_APLICA"
    | "RETENCION_SIMPLE"
    | "RETENCION_TARIFA_2"
    | "CALCULO_ESPECIAL"
  baseLegal: {
    norma: string
    articulo: string
    descripcion: string
  }
  snapshotNormativo: {
    valorUT: number
    versionCatalogo: string
    versionMotor: string
  }
}

El resultado debe ser:

legible en UI
persistible en RetencionISLR
auditable
reusable en comprobante y exportación
5. Entradas del motor

El motor debe recibir un contexto enriquecido, no solo el pago crudo.

Ejemplo conceptual:

type ContextoMotorISLR = {
  pago: Pago
  proveedor: Proveedor
  empresa: Empresa
  periodoFiscal: PeriodoFiscal
  conceptoISLR: ConceptoISLR
  comprasAsociadas: PagoCompra[]
  valorUTVigente: number
  metadata: {
    tipoEventoRetencion: "PAGO" | "ABONO_EN_CUENTA"
    sujetoNormalizado: "PNR" | "PNNR" | "PJD" | "PJND"
    montoPagoBase: number
    requiereFormulaEspecial: boolean
    formulaEspecial?: string | null
  }
}
6. Determinación del sujeto aplicable

El motor debe resolver internamente el sujeto normalizado a partir de la información del proveedor.

Mapeo esperado
PNR = Persona Natural Residente
PNNR = Persona Natural No Residente
PJD = Persona Jurídica Domiciliada
PJND = Persona Jurídica No Domiciliada
Requisitos

No dejar esto abierto a texto libre en el cálculo.

El service debe construir ese valor antes de invocar el motor.

7. Orden obligatorio de evaluación

El motor debe evaluar en este orden:

Paso 1. Validar contexto mínimo

Validar:

pago existe
pago pertenece al tenant
proveedor existe
empresa existe
período fiscal ISLR existe y está abierto
concepto ISLR seleccionado existe y está activo
monto pago > 0
Paso 2. Resolver sujeto y concepto técnico aplicable

A partir del proveedor y el concepto seleccionado por el usuario o sistema, resolver el registro exacto del catálogo.

Paso 3. Determinar base de pago

Definir cuál es el monto base del evento:

monto total del pago
o suma de montos aplicados en PagoCompra
según la política operativa del sistema
Paso 4. Aplicar base imponible

Calcular:

baseCalculo = basePago * (baseImponiblePorcentaje / 100)

salvo que el concepto use fórmula especial.

Paso 5. Evaluar monto mínimo

Si usaMontoMinimo = true:

comparar monto retenible o base según política definida
si no supera el mínimo, devolver NO_APLICA
Paso 6. Aplicar cálculo según tipo de tarifa
si tipoTarifa = PORCENTAJE, aplicar porcentaje simple
si tipoTarifa = TARIFA_2, usar cálculo progresivo con sustraendo
si requiereCalculoEspecial = true, aplicar fórmula especial documentada
Paso 7. Aplicar sustraendo

Si usaSustraendo = true, aplicar sustraendo al monto calculado según la regla del concepto

Paso 8. Redondeo y salida

Redondear de forma consistente y devolver resultado estructurado

8. Reglas de cálculo por tipo de tarifa
8.1 PORCENTAJE

Caso estándar:

baseCalculo = basePago * (baseImponiblePorcentaje / 100)
retencionBruta = baseCalculo * (porcentajeRetencion / 100)
retencionNeta = max(retencionBruta - sustraendoBs, 0)

Aplicar monto mínimo cuando corresponda.

8.2 TARIFA_2

Para conceptos del catálogo con tipoTarifa = TARIFA_2, el motor debe calcular usando tramos y sustraendos según la tabla acumulativa definida para 2025. El catálogo maestro ya documenta los tramos 0–2000 U.T., 2001–3000 U.T. y 3001+ U.T., junto con sus sustraendos equivalentes en bolívares.

Recomendación técnica

Crear helper separado:

calcularConTarifa2(baseCalculoBs, valorUT)

Este helper debe:

convertir a U.T. si la lógica lo requiere
identificar tramo
aplicar porcentaje del tramo
restar sustraendo del tramo
devolver monto retenido
8.3 Cálculo especial

Para conceptos con requiereCalculoEspecial = true, el motor debe soportar una fórmula separada.

Caso relevante del catálogo:

pagos de tarjetas de crédito o consumo, donde la base no se toma directamente del monto bruto, sino de una fórmula legal específica documentada en el catálogo maestro.
Recomendación técnica

Crear helper:

calcularBaseEspecialISLR(formulaEspecial, contexto)

No resolver fórmulas especiales con strings ejecutables.
Usar identificadores internos y funciones controladas.

9. Motivos y códigos internos

Definir códigos estables para resultados del motor.

9.1 No aplica
NOAPL_SIN_CONCEPTO
NOAPL_CONCEPTO_INACTIVO
NOAPL_MONTO_CERO
NOAPL_NO_SUPERA_MINIMO
NOAPL_PERIODO_CERRADO
NOAPL_DATOS_INCOMPLETOS
9.2 Cálculo simple
RET_SIMPLE_PORCENTAJE
9.3 Tarifa 2
RET_TARIFA_2
9.4 Fórmula especial
RET_FORMULA_ESPECIAL
10. Persistencia en RetencionISLR

Al guardar RetencionISLR, persistir como mínimo:

conceptoISLRId
baseCalculoSnapshot
porcentajeRetencionSnapshot
montoRetenido
tipoEventoRetencionSnapshot
sujetoSnapshot
motivoCodigo
motivoDescripcion
categoriaRegla
baseLegalNorma
baseLegalArticulo
baseLegalDescripcion
versionMotor
valorUTSnapshot

Si el modelo actual no tiene todos estos campos, documentar el gap y proponer ajuste mínimo.

11. Servicio y helpers requeridos

Crear capa clara de reglas y helpers, por ejemplo:

src/modules/retenciones/islr/engine/
  islr-retencion.engine.ts
  islr-retencion.types.ts
  islr-retencion.codes.ts
  islr-retencion.simple.ts
  islr-retencion.tarifa2.ts
  islr-retencion.especial.ts
  islr-retencion.subject.ts

Y en el módulo de servicio:

evaluarRetencionISLRParaPago(pagoId, tenantId)
calcularYGuardarRetencionISLR(pagoId, tenantId)
getRetencionISLRByPagoId(pagoId, tenantId)
12. Integración con Pagos
Política recomendada

Mantener cálculo explícito y controlado.

Agregar acción:

calcularRetencionISLRAction(pagoId)

No hacer cálculo mágico automático en background en esta fase.

UI mínima

En detalle del pago mostrar:

concepto ISLR
si aplica o no
base de cálculo
porcentaje
monto retenido
botón Calcular retención ISLR
13. Validaciones importantes
13.1 PeriodoFiscal

Usar obligatoriamente período fiscal ISLR abierto para la fecha del pago.

13.2 Compras asociadas

Si el pago usa PagoCompra, validar consistencia:

compras del mismo proveedor
montos aplicados coherentes
no aplicar más de lo pagado
13.3 Concepto activo

No calcular con conceptos inactivos.

13.4 Recalculo

Si la retención ya está comprometida en ComprobanteISLR, bloquear recálculo.

14. Precisión monetaria

Usar Decimal o conversión controlada.
No usar floats ingenuos.

Definir criterio consistente para:

cálculo intermedio
aplicación de sustraendo
redondeo final
15. Entregables requeridos

Cursor debe dejar implementado:

diseño e implementación del motor ISLR
resolución de sujeto normalizado
cálculo simple por porcentaje
helper de Tarifa 2
soporte base para fórmulas especiales
integración con RetencionISLR
action manual de cálculo
integración visual en detalle del pago
resumen técnico corto con:
qué reglas implementó
qué parte del catálogo ya cubre
qué conceptos especiales quedan pendientes si aplica
16. Resultado esperado

Al finalizar este paso, el sistema debe poder:

tomar un pago válido
resolver su concepto ISLR
calcular la retención correctamente
guardar snapshots auditables
mostrar el resultado en la UI
dejar listo el flujo para comprobante y exportación
17. Fuera de alcance

No implementar todavía:

nómina / AR-I
comprobante PDF ISLR
exportación oficial definitiva por formato SENIAT específico si requiere ajustes
auditoría avanzada histórica
conciliación anual