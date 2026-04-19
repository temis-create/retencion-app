# Modelo de Dominio Técnico - RetenSaaS (v1.3)

Este documento define la arquitectura lógica y el modelo de dominio final para la plataforma RetenSaaS, incorporando todas las decisiones de producto necesarias para proceder al diseño del `schema.prisma`.

# 1. Enfoque del modelo y Multitenancy

- **SaaS Multitenant**: Aislamiento de datos mediante `tenantId` en entidades operativas y maestras de la organización.
- **Entidades Globales**: Las tablas de referencia normativa general (ej: `AlicuotaIVA`, `ConceptoISLR`, `UnidadTributaria`) son globales y no contienen `tenantId`.
- **Alcance de Permisos**: Mixto (Organización/Empresa).
- **Separación de Capas**: Transaccional, Fiscal, Cumplimiento y Auditoría.

# 2. Entidades Principales

## 2.1 Núcleo SaaS y Seguridad
- **Organización (Tenant)**: Suscriptor principal.
- **Usuario**: Cuenta de acceso.
- **Rol**: Permisos (JSON).
- **Membresía**: Límites y suscripción.

## 2.2 Configuración y Maestros
- **Empresa**: Agente de retención (pertenece al tenant).
- **Proveedor**: Terceros sujetos a retención.
- **PeriodoFiscal**: Control temporal para IVA e ISLR.
- **UnidadTributaria**: Global.
- **AlicuotaIVA**: Global. Catálogo único para todo el sistema según normativa.
- **ConceptoISLR**: Global. Clasificación tributaria oficial (Tarifas, sustraendos, códigos SENIAT).
- **ConceptoFiscal**: (Opcional/Interno) Clasificación gerencial del tenant para reportes operativos.
- **TipoDocumento**: Catálogo (Factura, Nota de Crédito, Nota de Débito, etc).
- **CalendarioFiscal**: Global.
- **ParametroFiscal**: Configuración por empresa (correlativos y comportamiento).

## 2.3 Operaciones e IVA
- **Compra**: Entidad unificada para Facturas, Notas de Crédito y Notas de Débito.
- **RetencionIVA**: Registro técnico del cálculo.
- **ComprobanteIVA**: Documento legal con formato fijo e inalterable.
- **SaldoCompensacionIVA**: Persistencia del arrastre de saldos de IVA entre períodos.

## 2.4 Operaciones e ISLR
- **Pago**: Registro de desembolso o abono en cuenta que dispara la retención.
- **PagoCompra**: Relación N:M para trazabilidad de facturas pagadas.
- **RetencionISLR**: Registro técnico con snapshots de UT y Conceptos.
- **ComprobanteISLR**: Certificación legal de retención de ISLR.

## 2.5 Cumplimiento y Auditoría
- **ExportacionIVA / ExportacionISLR**: Archivos SENIAT (TXT/XML).
- **LogAuditoria**: Trazabilidad completa.

# 3. Definición Detallada de Entidades

### PeriodoFiscal
- **Campos**: UUID, Anio, Mes, TipoImpuesto (IVA, ISLR), Frecuencia (Mensual, Quincenal), Subperiodo, CodigoPeriodo, Estado (ABIERTO, CERRADO).
- **Relaciones**: Vinculado a `SaldoCompensacionIVA`.

### Compra (Unificada: Factura / NC / ND)
- **Descripción**: Representa cualquier documento de compra o ajuste recibido.
- **Campos**: UUID, NumeroFactura, NumeroControl, FechaFactura, MontoExento, MontoBase, ImpuestoIVA, TotalFactura, Estado.
- **TipoDocumento**: Define si es Factura (01), Nota de Débito (02) o Nota de Crédito (03).
- **Lógica de Ajuste**: 
    - `documentoAfectadoId`: Relación opcional a la `Compra` original que está siendo ajustada por una nota de crédito/débito.
    - `motivoAjuste`: Texto descriptivo.
    - `tipoAjuste`: (ANULACION, DESCUENTO, DEVOLUCION, ERROR_PRECIO).
- **Impacto**: Las Notas de Crédito generan una retención negativa o reversión que se netea en el período fiscal abierto actual.

### Pago (Retención ISLR)
- **Descripción**: La retención de ISLR se dispara por el evento de pago efectivo o abono en cuenta.
- **Campos**: UUID, FechaPago, MontoTotalPago, Moneda, TasaCambio, Referencia, Estado.
- **TipoEventoRetencion**: (PAGO_EFECTIVO, ABONO_EN_CUENTA). Define el criterio legal que originó la obligación tributaria.

### SaldoCompensacionIVA
- **Descripción**: Persiste el saldo acumulado de IVA retenido por descontar. Permite el arrastre de saldos a favor entre períodos fiscales.
- **Campos**: UUID, EmpresaId, PeriodoFiscalId, SaldoAnterior (arrastrado), MontoOriginado (en este período), MontoAplicado (utilizado), SaldoSiguiente (resultante para el próximo período).
- **Regla**: El `SaldoSiguiente` de un período cerrado es el `SaldoAnterior` automático del siguiente período abierto.

### RetencionISLR (Snapshots)
- **Campos**: UUID, MontoOperacion, PeriodoFiscalId.
- **Campos Snapshot**: valorUTUsado, idConceptoISLR, codigoConceptoISLR, descripcionConceptoISLR, porcentajeBaseImponible, tarifaAplicada, aplicoSustraendo, montoSustraendoUsado.

### ParametroFiscal (Lógica cerrada)
- **Campos**: UUID, EmpresaId, ProximoCorrelativoIVA, ProximoCorrelativoISLR, ReinicioCorrelativoMensual (bool), EsAgenteEspecial (bool), PorcentajeRetencionDefecto (75/100).
- **Nota**: El formato del comprobante es fijo (`AAAAMMSSSSSSSS`). No existen máscaras libres de formato para asegurar cumplimiento legal.

### AlicuotaIVA (Global)
- **Campos**: UUID, Nombre, Porcentaje (Decimal), FechaDesde, FechaHasta, Activa.
- **Nota**: Al ser global, no posee `tenantId`. Los cambios en alícuotas aplican a todas las organizaciones simultáneamente.

### ConceptoISLR (Global)
- **Campos**: UUID, CodigoSENIAT, Descripcion, TarifaPN, TarifaPJ, BaseImponible, MinimoUT, AplicaSustraendo.

### ConceptoFiscal (Tenant-level)
- **Descripción**: Clasificación gerencial interna. Es un campo opcional para facilitar reportes gerenciales no estrictamente fiscales.

# 4. Reglas de Integridad y Trazabilidad

1.  **Notas de Crédito**: Solo pueden emitirse vinculadas a un período ABIERTO. Si afectan una factura de un período CERRADO, la nota de crédito reside en el período actual y el impacto fiscal se refleja en la declaración presente.
2.  **Arrastre IVA**: El sistema calcula automáticamente la compensación basándose en el historial de `SaldoCompensacionIVA`.
3.  **Snapshot Inmutable**: Una vez generada la retención, los valores de cálculo no cambian aunque la tabla maestra (UT/Conceptos) se actualice.

# 5. Fuera de Alcance (MVP)

- **Retenciones de Nómina e ISLR de Empleados**: El manejo de de empleados y sus retenciones queda fuera del MVP.
- **Formulario AR-I**: El flujo de estimación y variaciones de AR-I se considera una expansión futura.
- **Alcance Actual ISLR**: Limitado exclusivamente a operaciones con proveedores/terceros y conceptos equivalentes definidos en este modelo.

# 6. Consideraciones para Prisma

- **Enums**: Usar para estados (`ABIERTO`, `CERRADO`, `PAGO_EFECTIVO`, `ABONO_EN_CUENTA`).
- **Indices**: Únicos para `NumeroComprobante` por `Empresa` y `Anio`.
- **Relaciones Recurrentes**: `Compra` tiene una relación `@relation("AjusteDocumento")` consigo misma para vincular NC/ND a sus originales.

## Cierre final del modelo antes de Prisma

En esta versión (v1.3), se han ratificado las siguientes decisiones arquitectónicas:

- **Compensación IVA**: Se incorporó el manejo de arrastre de saldos mediante la nueva entidad `SaldoCompensacionIVA`, permitiendo trazabilidad entre períodos.
- **Documentos Unificados**: Se adoptó el uso de la entidad `Compra` para facturas y notas (NC/ND), centralizando la lógica operativa bajo una misma estructura con indicadores de tipo.
- **Catálogos Globales**: Se definió que las alícuotas y conceptos de ISLR son globales del sistema, eliminando redundancia entre tenants.
- **Lógica de Comprobantes**: Se estandarizó el formato inalterable de comprobantes y se eliminaron las máscaras de configuración libre.
- **Definición de Disparador ISLR**: Se cerró el trigger de ISLR basado en Pago/Abono en cuenta para cumplir estrictamente con la normativa.

Con estas definiciones, el modelo de dominio está **cerrado y blindado**, listo para ser traducido directamente a definiciones de tablas y relaciones en `schema.prisma`.
