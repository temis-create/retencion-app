Analiza el archivo `docs/00_definicion_funcional_mvp_retenciones.md`.

Tu tarea es traducir ese documento funcional en un modelo de dominio técnico para una aplicación SaaS.

Crea un nuevo archivo llamado:

docs/01_modelo_dominio_retenciones.md

El documento debe definir claramente las entidades del sistema, sus relaciones, atributos y reglas principales, sirviendo como base para el diseño de la base de datos con Prisma.

Estructura obligatoria del documento:

# 1. Enfoque del modelo
- Explica que el sistema es multitenant (multiempresa).
- Define el uso de tenantId en todas las entidades de negocio.
- Define separación entre configuración, maestros y operaciones.

# 2. Entidades principales del sistema

Divide en grupos:

## 2.1 Núcleo SaaS
- Usuario
- Organización (tenant)
- Membresía
- Rol

## 2.2 Configuración fiscal
- ParametroFiscal
- UnidadTributaria
- AlicuotaIVA
- ConceptoISLR
- CalendarioFiscal

## 2.3 Maestros
- Empresa
- Proveedor
- TipoDocumento
- ConceptoFiscal

## 2.4 Operaciones IVA
- Compra
- RetencionIVA
- ComprobanteIVA

## 2.5 Operaciones ISLR
- Pago
- RetencionISLR
- ComprobanteISLR

## 2.6 Declaraciones
- ExportacionIVA
- ExportacionISLR

## 2.7 Auditoría
- LogAuditoria

# 3. Definición de cada entidad

Para cada entidad define:

- Descripción
- Campos principales
- Tipo de datos (conceptual, no Prisma aún)
- Relaciones
- Si lleva tenantId
- Campos de auditoría

# 4. Relaciones entre entidades

Describe relaciones clave:
- Usuario → Organización
- Empresa → Proveedores
- Compra → Retención IVA
- Pago → Retención ISLR
- Retención → Comprobante

# 5. Reglas de integridad

Define reglas como:

- Una retención pertenece a una operación
- No se puede modificar un período cerrado
- Comprobantes deben ser únicos por empresa
- Parámetros fiscales deben ser versionados

# 6. Modelo multitenant

Define claramente:

- tenantId obligatorio
- aislamiento lógico
- consultas filtradas por tenant

# 7. Estados de entidades

Ejemplo:

- Compra: BORRADOR / PROCESADA / ANULADA
- Retención: CALCULADA / CONFIRMADA
- Exportación: GENERADA / ENVIADA

# 8. Consideraciones para Prisma

- Uso de UUIDs
- Soft delete
- timestamps
- índices
- claves compuestas

Requisitos importantes:

- No escribas aún código Prisma
- No uses SQL
- No simplifiques entidades clave
- Mantén enfoque técnico profesional
- Debe ser base directa para schema.prisma

El resultado debe permitir pasar directamente al diseño del schema Prisma sin ambigüedad.