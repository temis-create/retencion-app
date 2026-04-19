# Especificación Técnica: Schema Prisma - RetenSaaS

Este documento traduce el modelo de dominio técnico en una estructura de datos lista para ser implementada en `schema.prisma`. Define tipos, relaciones, índices y restricciones necesarias para el correcto funcionamiento del sistema multitenant.

# 1. Enums Globales

```prisma
enum PlanMembresia {
  FREE
  PRO
  ENTERPRISE
}

enum TipoPersona {
  NATURAL
  JURIDICA
}

enum TipoResidencia {
  RESIDENTE
  NO_RESIDENTE
  DOMICILIADO
  NO_DOMICILIADO
}

enum TipoContribuyente {
  ORDINARIO
  ESPECIAL
  FORMAL
}

enum EstadoPeriodo {
  ABIERTO
  CERRADO
}

enum FrecuenciaPeriodo {
  MENSUAL
  QUINCENAL
}

enum TipoImpuesto {
  IVA
  ISLR
}

enum EstadoCompra {
  REGISTRADA
  ANULADA
}

enum EstadoPago {
  PROCESADO
  ANULADA
}

enum EstadoRetencion {
  CALCULADA
  CONFIRMADA
  ANULADA
}

enum TipoEventoRetencion {
  PAGO_EFECTIVO
  ABONO_EN_CUENTA
}

enum TipoExportacion {
  TXT_IVA
  XML_ISLR
}

enum TipoAjuste {
  ANULACION
  DESCUENTO
  DEVOLUCION
  ERROR_PRECIO
}
```

# 2. Modelos: Núcleo SaaS

### Organizacion
- **Propósito**: Raíz del multitenancy (Tenant).
- **Campos**: `id` (UUID), `nombre`, `rif` (Unique), `logoUrl`, `emailContacto`, `telefono`.
- **Auditoría**: `createdAt`, `updatedAt`, `deletedAt` (Soft Delete).
- **Relaciones**: 1:N con `Usuario`, `Empresa`, `Membresia`.

### Usuario
- **Propósito**: Identidad de acceso al sistema.
- **Campos**: `id` (UUID), `tenantId` (FK), `nombre`, `email` (Unique), `passwordHash`, `activo` (Boolean).
- **Auditoría**: `createdAt`, `updatedAt`, `deletedAt`.
- **Relaciones**: N:1 con `Organizacion`, 1:N con `AsignacionRol`, `LogAuditoria`.

### Rol
- **Propósito**: Definición de permisos RBAC.
- **Campos**: `id` (UUID), `nombre`, `descripcion`, `permisos` (Json).
- **Relaciones**: 1:N con `AsignacionRol`.

### AsignacionRol
- **Propósito**: Vincula usuarios con roles y empresas específicas.
- **Campos**: `id` (UUID), `usuarioId` (FK), `rolId` (FK), `empresaId` (FK, Nullable).
- **Observaciones**: Si `empresaId` es nulo, el rol aplica a todo el tenant.
- **Índices**: Unique (`usuarioId`, `rolId`, `empresaId`).

### Membresia
- **Propósito**: Control de suscripción y límites.
- **Campos**: `id` (UUID), `tenantId` (FK), `plan` (Enum), `maxEmpresas`, `maxUsuarios`, `maxDocumentos`, `fechaVencimiento`.
- **Relaciones**: N:1 con `Organizacion`.

# 3. Modelos: Configuración y Maestros

### Empresa
- **Propósito**: Entidad legal que emite retenciones.
- **Campos**: `id` (UUID), `tenantId` (FK), `nombreFiscal`, `rif` (Unique), `direccion`, `telefono`, `agenteRetencionIVA` (Bool), `agenteRetencionISLR` (Bool).
- **Auditoría**: `createdAt`, `updatedAt`, `deletedAt`.
- **Relaciones**: N:1 con `Organizacion`, 1:N con `Proveedor`, `Compra`, `Pago`, `PeriodoFiscal`, `ParametroFiscal`.

### Proveedor
- **Propósito**: Terceros sujetos a retención.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `nombre`, `rif`, `tipoPersona` (Enum), `tipoResidencia` (Enum), `tipoContribuyente` (Enum), `porcentajeRetencionIVA` (Decimal).
- **Índices**: Unique (`empresaId`, `rif`).
- **Auditoría**: `createdAt`, `updatedAt`, `deletedAt`.

### PeriodoFiscal
- **Propósito**: Control de tramos fiscales y cierres.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `anio`, `mes`, `tipoImpuesto` (Enum), `frecuencia` (Enum), `subperiodo` (Int), `codigoPeriodo` (String), `estado` (Enum), `fechaCierre` (DateTime).
- **Índices**: Unique (`empresaId`, `tipoImpuesto`, `codigoPeriodo`).
- **Relaciones**: 1:N con `Compra`, `Pago`, `ExportacionFiscal`.

### UnidadTributaria (Global)
- **Propósito**: Valor referencial legal.
- **Campos**: `id` (UUID), `valor` (Decimal), `fechaDesde`, `fechaHasta`, `gaceta`.

### AlicuotaIVA (Global)
- **Propósito**: Porcentajes de IVA vigentes nacionalmente.
- **Campos**: `id` (UUID), `nombre`, `porcentaje` (Decimal), `fechaDesde`, `fechaHasta`, `activa`.

### ConceptoISLR (Global)
- **Propósito**: Clasificación oficial SENIAT.
- **Campos**: `id` (UUID), `codigoSENIAT`, `descripcion`, `porcentajeBaseImponible` (Decimal), `tarifaPJ` (Decimal), `tarifaPN` (Decimal), `minimoUT` (Decimal), `aplicaSustraendo` (Bool).

### TipoDocumento
- **Propósito**: Catálogo de tipos (Factura, NC, ND).
- **Campos**: `id` (UUID), `codigo` (String), `descripcion`.

### CalendarioFiscal (Global)
- **Propósito**: Fechas de vencimiento.
- **Campos**: `id` (UUID), `anio`, `ultimoDigitoRif`, `fechaVencimiento`.

### ParametroFiscal
- **Propósito**: Configuración operativa de la empresa.
- **Campos**: `id` (UUID), `empresaId` (FK - Unique), `proximoCorrelativoIVA` (Int), `proximoCorrelativoISLR` (Int), `reinicioCorrelativoMensual` (Bool).

### SaldoCompensacionIVA
- **Propósito**: Arrastre anual/mensual de saldos de IVA.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `periodoFiscalId` (FK), `saldoAnterior` (Decimal), `montoOriginado` (Decimal), `montoAplicado` (Decimal), `saldoSiguiente` (Decimal).
- **Relaciones**: N:1 con `Empresa`, `PeriodoFiscal`.

# 4. Modelos: Operaciones

### Compra
- **Propósito**: Entidad unificada para transacciones de gasto y ajustes.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `proveedorId` (FK), `tipoDocumentoId` (FK), `periodoFiscalId` (FK), `documentoAfectadoId` (UUID - Self Relation), `numeroFactura`, `numeroControl`, `fechaFactura`, `montoExento` (Decimal), `montoBase` (Decimal), `impuestoIVA` (Decimal), `totalFactura` (Decimal), `estado` (Enum), `tipoAjuste` (Enum, Nullable), `motivoAjuste` (String).
- **Relaciones**: Self-relation (`Compra` -> `Compra`), 1:1 con `RetencionIVA`.
- **Auditoría**: `createdAt`, `updatedAt`.

### Pago
- **Propósito**: Evento disparador de ISLR.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `proveedorId` (FK), `periodoFiscalId` (FK), `fechaPago`, `montoTotal` (Decimal), `moneda`, `tasaCambio` (Decimal), `referencia`, `tipoEventoRetencion` (Enum), `estado` (Enum).
- **Relaciones**: 1:N con `PagoCompra`, 1:N con `RetencionISLR`.

### PagoCompra
- **Propósito**: Entidad asociativa Pago <-> Compra.
- **Campos**: `id` (UUID), `pagoId` (FK), `compraId` (FK), `montoAplicado` (Decimal).

### RetencionIVA
- **Propósito**: Registro fiscal del cálculo de IVA.
- **Campos**: `id` (UUID), `tenantId` (FK), `compraId` (FK), `comprobanteIVAId` (FK, Nullable), `porcentajeRetencionSnapshot` (Decimal), `montoBaseSnapshot` (Decimal), `impuestoIVASnapshot` (Decimal), `montoRetenido` (Decimal), `periodoFiscalId` (FK).
- **Relaciones**: 1:1 con `Compra`, N:1 con `ComprobanteIVA`.

### ComprobanteIVA
- **Propósito**: Documento legal de retención de IVA.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `proveedorId` (FK), `numeroComprobante` (String - Unique per Empresa/Anio), `fechaEmision`.
- **Índices**: Unique (`empresaId`, `numeroComprobante`).

### RetencionISLR
- **Propósito**: Registro fiscal del cálculo de ISLR.
- **Campos**: `id` (UUID), `tenantId` (FK), `pagoId` (FK), `comprobanteISLRId` (FK, Nullable), `periodoFiscalId` (FK), `valorUTSnapshot` (Decimal), `codigoConceptoSnapshot` (String), `descripcionConceptoSnapshot` (String), `porcentajeBaseSnapshot` (Decimal), `tarifaAplicadaSnapshot` (Decimal), `sustraendoSnapshot` (Decimal), `montoRetenido` (Decimal).

### ComprobanteISLR
- **Propósito**: Documento legal de retención de ISLR.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `numeroComprobante` (String), `fechaEmision`.

# 5. Modelos: Cumplimiento y Auditoría

### ExportacionFiscal
- **Propósito**: Registro de generación de archivos para SENIAT.
- **Campos**: `id` (UUID), `tenantId` (FK), `empresaId` (FK), `periodoFiscalId` (FK), `tipo` (Enum - TXT/XML), `urlStorage`, `hashArchivo`, `usuarioId` (FK), `fechaGeneracion`, `cantidadRegistros`, `montoTotal`.

### LogAuditoria
- **Propósito**: Rastro de acciones.
- **Campos**: `id` (UUID), `tenantId` (FK), `usuarioId` (FK), `accion`, `entidadNombre`, `entidadId`, `datosPrevios` (Json), `datosNuevos` (Json), `ip`, `timestamp` (DateTime).

---

# Decisiones de modelado confirmadas

1.  **Aislamiento**: Se incluyó `tenantId` de forma redundante en tablas operativas para facilitar consultas filtradas sin joins profundos.
2.  **Snapshots**: Todas las retenciones guardan el estado de los parámetros en el momento del cálculo para evitar efectos de cambios retroactivos.
3.  **Compra Unificada**: Se utiliza una sola tabla para facturas y notas de crédito/débito, diferenciándolas por `TipoDocumento` y la auto-relación `documentoAfectadoId`.
4.  **Pagos y Aplicación**: Se separó el `Pago` (disparador de ISLR) de la `Compra` mediante `PagoCompra` para manejar pagos parciales o masivos correctamente.
5.  **Compensation**: `SaldoCompensacionIVA` permite el arrastre financiero necesario para las declaraciones de IVA.

# Riesgos o puntos sensibles al implementar el schema

- **Concurrencia en Correlativos**: Al emitir comprobantes masivos, el incremento de `proximoCorrelativo` en `ParametroFiscal` debe manejarse mediante transacciones atómicas para evitar duplicados.
- **Precisión de Decimales**: Se debe configurar en Prisma (`Decimal`) con precisión adecuada para moneda venezolana (Ves) y los cálculos técnicos de retención.
- **Bloqueo por Cierre**: La lógica de negocio debe garantizar que al cambiar el estado de `PeriodoFiscal` a `CERRADO`, no se permitan mutaciones en el schema para registros con ese `periodoFiscalId`.

# Orden recomendado para construir el schema.prisma

1.  **Core SaaS**: Organizacion, Usuario, Rol, AsignacionRol.
2.  **Globales**: UnidadTributaria, AlicuotaIVA, ConceptoISLR, TipoDocumento, CalendarioFiscal.
3.  **Maestros Tenant**: Empresa, Proveedor, ParametroFiscal.
4.  **Control Fiscal**: PeriodoFiscal, SaldoCompensacionIVA.
5.  **Transacciones**: Compra, Pago, PagoCompra.
6.  **Efectos Fiscales**: RetencionIVA, ComprobanteIVA, RetencionISLR, ComprobanteISLR.
7.  **Finalización**: ExportacionFiscal, LogAuditoria.

# Modelos que podrían dejarse para fase posterior si hiciera falta

- **LogAuditoria**: Puede simplificarse o postergarse si el tiempo es crítico.
- **Membresia**: Si el sistema inicia con un solo plan o gestión manual de suscripciones.
- **SaldoCompensacionIVA**: Si la primera versión del MVP no requiere arrastre automático de saldos (aunque es altamente recomendado).
- **ConceptoFiscal**: (Opcional del dominio) Se ha dejado fuera de esta especificación para enfocarse en el core operativo.
