# 10b_motor_reglas_iva_seniat_nivel_real_actualizado.md

# 1. Objetivo

Diseñar e implementar la versión actualizada del motor de reglas de Retención IVA de RetenSaaS, alineado con la providencia SNAT/2025/000054 y preparado para operar de forma:

- auditable
- parametrizable
- priorizada por reglas
- extensible
- separada de la UI

Este motor debe decidir, para cada compra, si:

- no aplica retención
- aplica retención general
- aplica retención del 100%

Y debe devolver siempre una explicación fiscal estructurada.

---

# 2. Base normativa obligatoria

Tomar como base principal la providencia SNAT/2025/000054.

Del texto vigente deben modelarse como mínimo:

## Exclusiones
- operación no sujeta a IVA
- operación exenta
- operación exonerada
- proveedor contribuyente formal
- proveedor agente de percepción en operaciones de venta de bebidas alcohólicas, fósforos, cigarrillos, tabacos y otros derivados del tabaco
- proveedor con percepción anticipada del IVA por importación debidamente acreditada
- operaciones pagadas por empleados por concepto de viáticos
- gastos reembolsables por cuenta del agente de retención
- operaciones cuyo monto no exceda 20 U.T. en los supuestos aplicables
- pagos de servicios públicos domiciliarios y conceptos afines, según la política normativa/operativa que se defina con precisión

## Retención general
- 75% del impuesto causado

## Retención del 100%
- cuando el IVA no esté discriminado en factura o nota de débito
- cuando la factura o nota de débito no cumpla requisitos o formalidades
- cuando del Portal Fiscal se desprenda que el proveedor está sujeto a 100% o no esté inscrito en RIF
- en las operaciones señaladas en el artículo 2 de la providencia

---

# 3. Resultado funcional esperado

El motor debe devolver una estructura tipo:

```ts
type ResultadoMotorRetencionIVA = {
  aplica: boolean
  tipoResultado: "NO_APLICA" | "RETENCION_75" | "RETENCION_100"
  porcentajeRetencion: number
  montoRetenido: number
  impuestoIVA: number
  motivoCodigo: string
  motivoDescripcion: string
  categoriaRegla:
    | "EXCLUSION_ABSOLUTA"
    | "EXCLUSION_CONDICIONAL"
    | "RETENCION_TOTAL"
    | "RETENCION_GENERAL"
  baseLegal: {
    norma: string
    articulo: string
    descripcion: string
  }
  snapshotNormativo: {
    porcentajeAplicado: number
    unidadTributariaValor?: number | null
    montoOperacionUT?: number | null
    versionMotor: string
  }
}

Este resultado debe poder:

mostrarse en UI
persistirse parcial o totalmente
auditarse
reutilizarse en comprobante y exportación
4. Principio de diseño del motor

Este motor NO debe implementarse como una cadena desordenada de if sueltos.

Debe tener una estructura por prioridad:

validaciones de contexto
exclusiones absolutas
exclusiones condicionales
reglas de retención total
regla general
salida estructurada
5. Orden obligatorio de evaluación
Paso 1. Validar contexto mínimo

Validar:

compra existe
compra pertenece al tenant
empresa existe
proveedor existe
período fiscal existe
compra está en estado válido
empresa actúa como agente de retención IVA
período fiscal no está cerrado

Si falla aquí, devolver NO_APLICA o error semántico según corresponda.

Paso 2. Evaluar exclusiones absolutas

Estas bloquean cualquier retención:

operación no sujeta
exenta
exonerada
proveedor formal
Paso 3. Evaluar exclusiones condicionales

Estas requieren flags o metadata adicional:

agente de percepción en rubros específicos
percepción anticipada de IVA por importación
viáticos
gastos reembolsables
monto no excede 20 U.T. cuando aplique
servicios públicos domiciliarios o categorías excluidas operativamente
Paso 4. Evaluar retención del 100%

Si no hubo exclusión:

IVA no discriminado
documento con incumplimiento formal
proveedor marcado 100% o sin RIF
operaciones del artículo 2 de la providencia
Paso 5. Evaluar retención general

Si no aplica nada anterior:

75% del impuesto causado
6. Códigos internos obligatorios

Definir códigos estables para el motor.

6.1 Exclusiones absolutas
EXC_NO_SUJETA
EXC_EXENTA
EXC_EXONERADA
EXC_PROVEEDOR_FORMAL
6.2 Exclusiones condicionales
EXC_AGENTE_PERCEPCION_TABACO_ALCOHOL
EXC_PERCEPCION_ANTICIPADA_IMPORTACION
EXC_VIATICO
EXC_GASTO_REEMBOLSABLE
EXC_MONTO_MINIMO_20UT
EXC_SERVICIO_PUBLICO_DOMICILIARIO
6.3 Retención total
RET100_SIN_DESGLOSE_IVA
RET100_DOC_SIN_REQUISITOS
RET100_PROVEEDOR_MARCADO_100
RET100_SIN_RIF
RET100_OPERACION_ART2_METALES_PIEDRAS
6.4 Retención general
RETGEN_75_ORDINARIA
7. Exclusiones que deben modelarse explícitamente
7.1 Operación no sujeta / exenta / exonerada

No depender solo de impuestoIVA = 0.

El sistema debe poder diferenciar:

no sujeta
exenta
exonerada
7.2 Proveedor formal

Si tipoContribuyente = FORMAL, no aplica retención.

7.3 Agente de percepción en rubros específicos

Debe poder modelarse:

esAgentePercepcionIVA
categoría/rubro de la operación

Y solo excluir si además el rubro corresponde a:

bebidas alcohólicas
fósforos
cigarrillos
tabacos
derivados del tabaco
7.4 Percepción anticipada por importación

Agregar soporte a:

tienePercepcionAnticipadaIVA
soportePercepcionAnticipada
7.5 Viáticos

Agregar soporte a:

esViatico
7.6 Gastos reembolsables

Agregar soporte a:

esGastoReembolsable
7.7 Umbral de 20 U.T.

El motor debe poder evaluar:

valor UT vigente
monto de operación en UT
si la regla aplica o no según tipo de operación

No hardcodear el monto en bolívares.

7.8 Servicios públicos y categorías excluidas

Modelar soporte para clasificar operaciones como:

electricidad
agua
aseo
telefonía
u otras categorías excluidas por la norma/interpretación operativa definida por producto
8. Reglas de retención del 100%
8.1 IVA no discriminado

Si el IVA no aparece discriminado en factura o nota de débito:

aplicar 100%
8.2 Documento sin requisitos

Si el documento no cumple formalidades o requisitos fiscales:

aplicar 100%

Esto no debe depender de OCR.
Debe soportarse por flags o checklist capturados por el usuario o reglas del sistema.

8.3 Proveedor marcado 100% o sin RIF

Si el proveedor:

está marcado en Portal Fiscal al 100%
o no está inscrito / no tiene RIF válido

→ aplicar 100%

8.4 Operaciones del artículo 2

Modelar operaciones especiales del artículo 2:

metales preciosos
piedras preciosas
y los casos específicos comprendidos por la providencia

Agregar un flag o clasificación de operación:

esOperacionArticulo2RetencionTotal
9. Regla general de retención

Si no hay exclusión ni 100%:

aplicar 75% del impuesto causado

Fórmula base:

Monto retenido = impuestoIVA * 0.75
10. Datos mínimos que el motor necesita

El motor no debe recibir solo Compra.
Debe recibir un contexto enriquecido:

type ContextoMotorRetencionIVA = {
  compra: Compra
  empresa: Empresa
  proveedor: Proveedor
  periodoFiscal: PeriodoFiscal
  tipoDocumento: TipoDocumento
  metadataFiscal: {
    operacionNoSujeta: boolean
    operacionExenta: boolean
    operacionExonerada: boolean
    esViatico: boolean
    esGastoReembolsable: boolean
    esAgentePercepcionIVA: boolean
    rubroPercepcion?: string | null
    tienePercepcionAnticipadaIVA: boolean
    esServicioPublicoDomiciliario: boolean
    esOperacionArticulo2RetencionTotal: boolean
    cumpleRequisitosFormales: boolean
    ivaDiscriminado: boolean
    rifRegistrado: boolean
    proveedorMarcadoRetencion100: boolean
    unidadTributariaValor?: number | null
    montoOperacionUT?: number | null
  }
}
11. Arquitectura técnica sugerida
src/modules/retenciones/iva/engine/
  iva-retencion.engine.ts
  iva-retencion.types.ts
  iva-retencion.codes.ts
  iva-retencion.exclusiones-absolutas.ts
  iva-retencion.exclusiones-condicionales.ts
  iva-retencion.total.ts
  iva-retencion.general.ts
  iva-retencion.legal-map.ts
Responsabilidades
types: tipos del motor
codes: códigos de motivos
legal-map: vínculo código ↔ base legal
exclusiones-absolutas: reglas que bloquean siempre
exclusiones-condicionales: reglas que dependen de flags/contexto
total: reglas del 100%
general: regla del 75%
engine: orquestación completa
12. Base legal trazable

Cada resultado debe incorporar base legal estructurada.

Ejemplo:

baseLegal: {
  norma: "SNAT/2025/000054",
  articulo: "Artículo 3, numeral 2",
  descripcion: "No se practicará retención cuando el proveedor sea contribuyente formal del impuesto"
}

No dejar solo mensajes libres.

13. Persistencia y snapshots

El motor debe dejar preparada la persistencia de:

porcentaje aplicado
impuesto base
monto retenido
motivo código
motivo descripción
categoría de regla
base legal
valor de UT si fue relevante
monto operación en UT si fue relevante
versión del motor

Si el modelo actual de RetencionIVA no tiene todos estos campos, documentar el gap y no improvisar persistencia parcial sin indicarlo.

14. Compatibilidad con el sistema actual

Revisar la implementación actual de retencion-iva.rules.ts, que hoy solo contempla:

proveedor formal
porcentaje <= 0
compra registrada
IVA > 0
período abierto
cálculo simple por porcentaje

El nuevo motor debe considerarse una evolución de esa lógica, no un parche incremental desordenado.

15. Gaps esperados del modelo actual

Documentar explícitamente qué todavía no existe en el schema/UI actual y es necesario para cubrir el motor completo:

flags de no sujeta / exenta / exonerada
viático
gasto reembolsable
agente de percepción IVA
rubro de percepción
percepción anticipada importación
documento con requisitos formales
IVA discriminado
proveedor marcado 100%
RIF registrado / verificado
operación artículo 2
valor UT aplicado a la compra
monto de operación expresado en UT
16. Entregables requeridos

Cursor debe dejar:

diseño actualizado del motor
lista completa de reglas
códigos internos
base legal mapeada
orden de evaluación
estructura técnica propuesta
lista de gaps del modelo actual
resumen final indicando:
qué reglas ya están cubiertas hoy
qué reglas requieren ampliar schema/UI
qué reglas deben quedar como futura integración con Portal Fiscal
17. Resultado esperado

Al finalizar este paso, debe existir un diseño completo y actualizado del motor de reglas IVA tipo SENIAT, alineado con la providencia vigente, trazable y listo para convertirse en implementación real sin mezclar lógica fiscal con UI.