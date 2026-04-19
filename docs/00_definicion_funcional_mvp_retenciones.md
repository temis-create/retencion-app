# 00_definicion_funcional_mvp_retenciones.md

# 1. Nombre del producto
**RetenSaaS** (nombre tentativo)  
Plataforma SaaS para la gestión integral de retenciones de IVA e ISLR en Venezuela.

---

# 2. Resumen ejecutivo

RetenSaaS es una aplicación web bajo modelo SaaS diseñada para automatizar, controlar y gestionar el proceso completo de retenciones fiscales en Venezuela (IVA e ISLR), permitiendo a empresas cumplir con sus obligaciones tributarias de manera eficiente, precisa y auditable.

El sistema centraliza la parametrización fiscal, el registro de operaciones, el cálculo automático de retenciones, la emisión de comprobantes y la generación de archivos exigidos por el SENIAT, todo dentro de una arquitectura multiempresa, escalable y segura.

---

# 3. Problema que resuelve

Actualmente, muchas empresas en Venezuela:

- Calculan retenciones manualmente o en Excel.
- Cometen errores en tarifas, sustraendos o exclusiones.
- No tienen trazabilidad de cálculos fiscales.
- Tienen dificultades generando archivos TXT y XML para el SENIAT.
- Carecen de control sobre comprobantes y correlativos.
- Están expuestas a sanciones por incumplimiento fiscal.

El sistema resuelve estos problemas mediante automatización, parametrización y control estructurado.

---

# 4. Objetivos

## 4.1 Objetivo general
Desarrollar una plataforma SaaS que permita gestionar de forma integral las retenciones de IVA e ISLR en Venezuela, cumpliendo con normativa vigente y buenas prácticas fiscales.

## 4.2 Objetivos específicos

- Automatizar el cálculo de retenciones.
- Parametrizar variables fiscales sin necesidad de código.
- Garantizar trazabilidad completa de cada operación.
- Generar comprobantes fiscales válidos.
- Exportar archivos TXT y XML compatibles con SENIAT.
- Permitir operación multiempresa (multitenant).
- Facilitar auditoría y control fiscal.

---

# 5. Perfil de clientes objetivo

- Empresas contribuyentes ordinarios.
- Sujetos pasivos especiales.
- Firmas contables.
- Administradores financieros.
- PYMES con alto volumen de operaciones.
- Empresas con múltiples proveedores.

---

# 6. Tipos de usuarios

| Tipo de usuario        | Descripción |
|----------------------|------------|
| Administrador        | Configura parámetros, usuarios y empresa |
| Contador            | Gestiona retenciones y declaraciones |
| Operador            | Registra compras/pagos |
| Auditor             | Consulta reportes y trazabilidad |

---

# 7. Alcance del MVP

El MVP incluirá:

- Autenticación de usuarios
- Multiempresa (multitenant)
- Parámetros fiscales configurables
- Registro de proveedores
- Registro de compras/pagos
- Cálculo automático de retenciones IVA
- Cálculo automático de retenciones ISLR
- Emisión de comprobantes
- Exportación TXT (IVA)
- Exportación XML (ISLR)
- Reportes por período

---

# 8. Fuera de alcance del MVP

- Integración directa con SENIAT
- Contabilidad completa
- OCR de facturas
- Integración bancaria
- Inteligencia artificial fiscal
- Flujos complejos de aprobación

---

# 9. Módulos funcionales del sistema

## 9.1 Plataforma SaaS
- Registro
- Login
- Gestión de usuarios
- Gestión de empresas (tenant)

## 9.2 Configuración fiscal
- Unidad Tributaria
- Alícuotas IVA
- Tipos de contribuyente
- Conceptos ISLR
- Sustraendos
- Calendario fiscal

## 9.3 Maestros
- Empresas
- Proveedores
- Tipos de documento
- Conceptos fiscales

## 9.4 Operaciones IVA
- Registro de compras
- Validaciones
- Cálculo de retención
- Emisión de comprobante

## 9.5 Operaciones ISLR
- Registro de pagos
- Clasificación por concepto
- Aplicación de sustraendo
- Cálculo de retención

## 9.6 Exportaciones
- TXT IVA
- XML ISLR

## 9.7 Reportes
- Por período
- Por proveedor
- Por concepto

## 9.8 Auditoría
- Registro de eventos
- Historial de cambios

---

# 10. Flujos operativos principales

## Flujo IVA
1. Registrar compra
2. Validar exclusiones
3. Calcular IVA
4. Aplicar porcentaje de retención
5. Generar comprobante

## Flujo ISLR
1. Registrar pago
2. Identificar concepto
3. Determinar tarifa
4. Aplicar sustraendo
5. Calcular retención

## Flujo de declaración
1. Seleccionar período
2. Validar datos
3. Generar TXT/XML
4. Descargar archivo

---

# 11. Reglas de negocio IVA

- Retención estándar: 75%
- Retención especial: 100%
- No aplica si:
  - Exento o exonerado
  - Caja chica < 20 UT
  - Servicios básicos
- Fórmula:
  Retención = Base × IVA × % Retención

---

# 12. Reglas de negocio ISLR

- Honorarios:
  - PN residente: 3%
  - PJ domiciliada: 5%
- Servicios:
  - PN: 1%
  - PJ: 2%
- Sustraendo:
  Sustraendo = UT × % × 83.3334

- No aplica si monto < umbral

---

# 13. Reglas de parametrización fiscal

- UT editable
- Alícuotas configurables
- Conceptos ISLR configurables
- Porcentajes editables
- Versionado de parámetros
- Aplicación por fecha

---

# 14. Requisitos no funcionales

- Seguridad (RBAC)
- Multiempresa
- Escalabilidad
- Auditoría completa
- Performance adecuado
- Disponibilidad en la nube

---

# 15. Riesgos y supuestos

## Riesgos
- Cambios fiscales frecuentes
- Errores de parametrización
- Interpretación incorrecta de normativa

## Supuestos
- Usuario tiene conocimiento básico fiscal
- Sistema no sustituye asesoría tributaria

---

# 16. Decisiones técnicas

- Frontend: Next.js App Router
- Lenguaje: TypeScript
- ORM: Prisma
- Base de datos: PostgreSQL
- Deploy: Vercel
- Repo: GitHub

---

# 17. Backlog inicial por fases

## Fase 1: Fundación
- Auth
- Multiempresa
- Base técnica

## Fase 2: Núcleo fiscal
- Parámetros
- Proveedores
- Operaciones

## Fase 3: Exportaciones
- TXT IVA
- XML ISLR

## Fase 4: Reportes
- Dashboard
- Consultas

## Fase 5: SaaS
- Suscripciones
- Facturación

---

# 18. Criterios de aceptación del MVP

El sistema se considera funcional cuando:

- Permite registrar operaciones
- Calcula retenciones correctamente
- Genera comprobantes válidos
- Exporta TXT y XML correctamente
- Soporta múltiples empresas
- Mantiene trazabilidad completa
- Permite parametrización fiscal

---

# Consideraciones clave del sistema

- Multiempresa mediante tenantId
- Parámetros editables sin código
- Auditoría obligatoria
- Comprobantes correlativos únicos
- Cierre por período para evitar modificaciones
- Separación clara entre:
  - Registro
  - Cálculo
  - Exportación
  - Declaración

---