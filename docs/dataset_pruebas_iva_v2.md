# Dataset de Pruebas Automatizable - Motor IVA v2

# 1. Objetivo

Definir un conjunto de datos de prueba reproducibles para validar el motor de Retención IVA v2 y su integración con:

- Compras
- Retención IVA
- Comprobante IVA
- Exportación TXT

Este dataset debe poder convertirse en:
- seed de testing
- fixtures
- factories
- tests de integración
- pruebas manuales repetibles

---

# 2. Estrategia general

Crear un entorno QA aislado con:

- 1 organización de pruebas
- 1 o 2 empresas
- varios proveedores con clasificaciones fiscales distintas
- períodos fiscales abiertos y cerrados
- tipos de documento ya sembrados
- compras diseñadas explícitamente para disparar cada regla del motor

---

# 3. Entidades base del dataset

## 3.1 Organización de prueba
- nombre: `QA Retenciones IVA`
- rif: `J-99999999-1`

## 3.2 Empresa operativa principal
- nombreFiscal: `Empresa QA IVA, C.A.`
- rif: `J-11111111-1`
- agenteRetencionIVA: `true`
- agenteRetencionISLR: `false`

## 3.3 Empresa secundaria (opcional)
- nombreFiscal: `Empresa QA Secundaria, C.A.`
- rif: `J-22222222-2`
- agenteRetencionIVA: `true`

## 3.4 Parámetro fiscal
Para la empresa principal:
- proximoCorrelativoIVA = 1
- proximoCorrelativoISLR = 1
- reinicioCorrelativoMensual = true

## 3.5 Períodos fiscales
Crear al menos:

### Período IVA abierto
- empresa principal
- tipoImpuesto: IVA
- frecuencia: MENSUAL
- anio: 2026
- mes: 4
- codigoPeriodo: `2026-04-IVA-M`
- estado: ABIERTO

### Período IVA cerrado
- empresa principal
- tipoImpuesto: IVA
- frecuencia: MENSUAL
- anio: 2026
- mes: 3
- codigoPeriodo: `2026-03-IVA-M`
- estado: CERRADO

---

# 4. Proveedores base del dataset

Crear estos proveedores en la empresa principal.

## 4.1 PROV_ORD_75
Proveedor ordinario estándar
- nombre: `Proveedor Ordinario 75`
- rif: `J-30000000-1`
- tipoPersona: JURIDICA
- tipoResidencia: DOMICILIADO
- tipoContribuyente: ORDINARIO
- porcentajeRetencionIVA: 75
- esAgentePercepcionIVA: false
- proveedorMarcadoRetencion100: false
- rifRegistrado: true

## 4.2 PROV_ORD_100
Proveedor ordinario marcado al 100
- nombre: `Proveedor Ordinario 100`
- rif: `J-30000000-2`
- tipoContribuyente: ORDINARIO
- porcentajeRetencionIVA: 100
- proveedorMarcadoRetencion100: true
- rifRegistrado: true

## 4.3 PROV_FORMAL
Proveedor formal
- nombre: `Proveedor Formal`
- rif: `J-30000000-3`
- tipoContribuyente: FORMAL
- porcentajeRetencionIVA: 0
- rifRegistrado: true

## 4.4 PROV_SIN_RIF
Proveedor sin RIF válido
- nombre: `Proveedor Sin RIF Registrado`
- rif: `J-30000000-4`
- tipoContribuyente: ORDINARIO
- porcentajeRetencionIVA: 75
- proveedorMarcadoRetencion100: false
- rifRegistrado: false

## 4.5 PROV_PERCEPCION_TABACO
Proveedor agente de percepción en rubro excluido
- nombre: `Proveedor Percepción Tabaco`
- rif: `J-30000000-5`
- tipoContribuyente: ORDINARIO
- porcentajeRetencionIVA: 75
- esAgentePercepcionIVA: true
- rubroPercepcionIVA: `TABACO`
- rifRegistrado: true

---

# 5. Compras de prueba

Cada compra debe estar diseñada para una regla específica.

## 5.1 COMP_RET_75
Caso estándar de retención general
- proveedor: PROV_ORD_75
- naturalezaIVA: GRAVADA
- esViatico: false
- esGastoReembolsable: false
- esServicioPublicoDomiciliario: false
- tienePercepcionAnticipadaIVA: false
- ivaDiscriminado: true
- cumpleRequisitosFormales: true
- esOperacionArticulo2RetencionTotal: false
- fechaFactura: dentro del período abierto
- montoExento: 0
- montoBase: 1000
- impuestoIVA: 160
- totalFactura: 1160

### Esperado
- RETENCION_75
- monto retenido = 120

---

## 5.2 COMP_FORMAL
Exclusión por proveedor formal
- proveedor: PROV_FORMAL
- naturalezaIVA: GRAVADA
- impuestoIVA: 160
- totalFactura: 1160

### Esperado
- NO_APLICA
- motivo = EXC_PROVEEDOR_FORMAL

---

## 5.3 COMP_EXENTA
Exclusión por operación exenta
- proveedor: PROV_ORD_75
- naturalezaIVA: EXENTA
- montoBase: 0
- impuestoIVA: 0
- totalFactura: 1000

### Esperado
- NO_APLICA
- motivo = EXC_EXENTA

---

## 5.4 COMP_NO_SUJETA
Exclusión por operación no sujeta
- proveedor: PROV_ORD_75
- naturalezaIVA: NO_SUJETA
- impuestoIVA: 0

### Esperado
- NO_APLICA
- motivo = EXC_NO_SUJETA

---

## 5.5 COMP_EXONERADA
Exclusión por operación exonerada
- proveedor: PROV_ORD_75
- naturalezaIVA: EXONERADA
- impuestoIVA: 0

### Esperado
- NO_APLICA
- motivo = EXC_EXONERADA

---

## 5.6 COMP_VIATICO
Exclusión por viáticos
- proveedor: PROV_ORD_75
- naturalezaIVA: GRAVADA
- esViatico: true
- impuestoIVA: 160

### Esperado
- NO_APLICA
- motivo = EXC_VIATICO

---

## 5.7 COMP_REEMBOLSABLE
Exclusión por gasto reembolsable
- proveedor: PROV_ORD_75
- esGastoReembolsable: true

### Esperado
- NO_APLICA
- motivo = EXC_GASTO_REEMBOLSABLE

---

## 5.8 COMP_SERV_PUBLICO
Exclusión por servicio público
- proveedor: PROV_ORD_75
- esServicioPublicoDomiciliario: true

### Esperado
- NO_APLICA
- motivo = EXC_SERVICIO_PUBLICO_DOMICILIARIO

---

## 5.9 COMP_PERCEPCION_IMPORT
Exclusión por percepción anticipada
- proveedor: PROV_ORD_75
- tienePercepcionAnticipadaIVA: true

### Esperado
- NO_APLICA
- motivo = EXC_PERCEPCION_ANTICIPADA_IMPORTACION

---

## 5.10 COMP_PERCEPCION_TABACO
Exclusión por agente de percepción
- proveedor: PROV_PERCEPCION_TABACO
- naturalezaIVA: GRAVADA

### Esperado
- NO_APLICA
- motivo = EXC_AGENTE_PERCEPCION_TABACO_ALCOHOL

---

## 5.11 COMP_100_DOC_SIN_IVA
Retención 100 por IVA no discriminado
- proveedor: PROV_ORD_75
- naturalezaIVA: GRAVADA
- ivaDiscriminado: false
- cumpleRequisitosFormales: true
- impuestoIVA: 160

### Esperado
- RETENCION_100
- monto retenido = 160

---

## 5.12 COMP_100_DOC_INVALIDO
Retención 100 por documento inválido
- proveedor: PROV_ORD_75
- ivaDiscriminado: true
- cumpleRequisitosFormales: false
- impuestoIVA: 160

### Esperado
- RETENCION_100
- motivo = RET100_DOC_SIN_REQUISITOS

---

## 5.13 COMP_100_PROV_MARCADO
Retención 100 por proveedor marcado
- proveedor: PROV_ORD_100
- impuestoIVA: 160

### Esperado
- RETENCION_100
- motivo = RET100_PROVEEDOR_MARCADO_100

---

## 5.14 COMP_100_SIN_RIF
Retención 100 por proveedor sin RIF registrado
- proveedor: PROV_SIN_RIF
- impuestoIVA: 160

### Esperado
- RETENCION_100
- motivo = RET100_SIN_RIF

---

## 5.15 COMP_100_ART2
Retención 100 por operación artículo 2
- proveedor: PROV_ORD_75
- esOperacionArticulo2RetencionTotal: true
- impuestoIVA: 160

### Esperado
- RETENCION_100
- motivo = RET100_OPERACION_ART2_METALES_PIEDRAS

---

## 5.16 COMP_PERIODO_CERRADO
Bloqueo por período cerrado
- misma lógica que compra estándar
- fechaFactura dentro del período cerrado

### Esperado
- el sistema no debe permitir recalcular o modificar correctamente en flujo bloqueado
- si pruebas cálculo forzado, debe devolver error o no aplicar por período cerrado según implementación

---

## 5.17 COMP_MONTO_20UT
Exclusión por monto inferior a 20 UT
- proveedor: PROV_ORD_75
- montoOperacionUTSnapshot: 10
- valorUTSnapshot: valor vigente
- impuestoIVA > 0

### Esperado
- NO_APLICA
- motivo = EXC_MONTO_MINIMO_20UT

---

# 6. Casos para Comprobante IVA

Usar estas compras con retención válida:
- COMP_RET_75
- COMP_100_DOC_SIN_IVA
- COMP_100_PROV_MARCADO

## Validar
- comprobante individual
- comprobante agrupado si cumplen homogeneidad
- bloqueo de recálculo posterior

---

# 7. Casos para Exportación TXT

Generar comprobantes sobre:
- COMP_RET_75
- COMP_100_DOC_SIN_IVA

## Validar
- líneas exportadas correctas
- montos retenidos correctos
- número de comprobante correcto
- período correcto

---

# 8. Estructura sugerida del seed de testing

```txt
prisma/
  seeds/
    qa/
      seed-qa-organizacion.ts
      seed-qa-empresas.ts
      seed-qa-proveedores-iva.ts
      seed-qa-periodos.ts
      seed-qa-compras-iva.ts

O bien un solo archivo:

prisma/seed-qa-iva-v2.ts
9. Reglas de implementación del dataset
9.1 Idempotente

El dataset debe poder reinsertarse sin duplicados, usando:

upsert
lookup previo
claves funcionales
9.2 Nombres estables

Usar nombres y códigos fijos para poder identificar fácilmente cada caso.

9.3 Comentarios claros

Cada fixture debe indicar:

qué regla prueba
cuál es el resultado esperado
10. Resultado esperado

Al terminar este dataset, el equipo debe tener un conjunto estable de casos que permita validar:

exclusiones
75%
100%
prioridad de reglas
integración con comprobante
integración con exportación

sin necesidad de crear datos manualmente cada vez.      