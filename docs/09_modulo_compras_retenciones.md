# 09_modulo_compras_retenciones.md

# 1. Objetivo

Implementar el módulo de **Compras** de RetenSaaS como primer flujo operativo real del sistema para IVA, permitiendo registrar documentos de compra y dejar lista la base para calcular y emitir retenciones de IVA.

Este módulo debe integrar:

- empresa
- proveedor
- período fiscal
- tipo de documento
- montos base
- IVA
- total
- soporte para facturas y ajustes documentales
- validaciones fiscales básicas
- vínculo futuro con `RetencionIVA`

Este paso debe dejar listo el flujo de registro documental y la preparación para cálculo de retención IVA en la siguiente fase.

---

# 2. Alcance del paso

Este módulo debe incluir:

1. listado de compras
2. creación de compra
3. edición básica de compra
4. detalle de compra
5. soporte para factura / nota de crédito / nota de débito
6. validaciones fiscales básicas
7. integración obligatoria con período fiscal abierto
8. aislamiento por tenant
9. asociación a empresa y proveedor válidos

No implementar todavía:

- cálculo automático completo de retención IVA
- generación de comprobante IVA
- exportación TXT
- libro de compras completo
- carga masiva
- OCR de facturas
- anulación avanzada con efectos fiscales encadenados

---

# 3. Rutas requeridas

Implementar como mínimo:

```txt
/dashboard/compras
/dashboard/compras/nueva
/dashboard/compras/[id]
/dashboard/compras/[id]/editar

Mantener consistencia con Empresas, Proveedores y Períodos.

4. Entidad a utilizar

Usar el modelo Compra ya definido en Prisma.

Debe contemplar al menos:

tenantId
empresaId
proveedorId
tipoDocumentoId
periodoFiscalId
documentoAfectadoId
numeroFactura
numeroControl
fechaFactura
montoExento
montoBase
impuestoIVA
totalFactura
estado
tipoAjuste
motivoAjuste
5. Regla central del módulo
Ninguna compra puede registrarse sin período fiscal abierto de IVA

Esto es obligatorio.

Al iniciar la creación, el sistema debe usar:

requirePeriodoAbierto(empresaId, "IVA", fechaFactura)

Si no existe período abierto válido, debe bloquear el registro con error claro.

Esta regla es la columna vertebral del módulo.

6. Tipos documentales soportados

Este módulo debe soportar al menos:

Factura
Nota de Crédito
Nota de Débito

La implementación debe usar la misma entidad Compra, diferenciando por tipoDocumentoId.

7. Reglas para ajustes documentales
7.1 Factura

Caso base. No requiere documento afectado.

7.2 Nota de Crédito / Débito

Si el tipo documental corresponde a nota de crédito o débito:

debe existir documentoAfectadoId
ese documento afectado debe pertenecer al mismo tenant
debe pertenecer a la misma empresa
idealmente debe ser del mismo proveedor
debe existir validación server-side
debe poder registrar motivoAjuste
tipoAjuste debe ser coherente si aplica

No resolver todavía toda la lógica tributaria del ajuste sobre retención. En esta fase basta con dejar bien modelado el documento y su trazabilidad.

8. Campos mínimos del formulario

El formulario debe soportar como mínimo:

empresaId
proveedorId
tipoDocumentoId
documentoAfectadoId (condicional)
numeroFactura
numeroControl
fechaFactura
montoExento
montoBase
impuestoIVA
totalFactura
tipoAjuste (opcional)
motivoAjuste (opcional)
9. Validaciones de negocio
9.1 Empresa válida

La empresa debe pertenecer al tenant autenticado.

9.2 Proveedor válido

El proveedor debe pertenecer al tenant autenticado y a la empresa seleccionada.

9.3 Tipo de documento válido

El tipoDocumentoId debe existir y corresponder a un tipo permitido para el módulo.

9.4 Período abierto obligatorio

Debe existir período abierto de IVA para la empresa y fecha correspondiente.

9.5 Montos válidos

Validar al menos:

montoExento >= 0
montoBase >= 0
impuestoIVA >= 0
totalFactura >= 0

Y además:

totalFactura debe ser coherente con la suma de base + exento + impuesto, con tolerancia mínima si consideras redondeo
no aceptar compras con todos los montos en cero
9.6 Documento afectado

Si el documento es nota de crédito o débito:

documentoAfectadoId obligatorio
debe existir
debe pertenecer al tenant
debe corresponder a una compra válida
debe ser coherente con la empresa actual
9.7 Fecha válida

fechaFactura debe ser una fecha válida.

9.8 Estado inicial

Toda compra nueva debe crearse con estado inicial consistente con el MVP, por ejemplo:

REGISTRADA
10. Arquitectura técnica requerida

Mantener el patrón ya consolidado.

Estructura sugerida:

src/modules/compras/
  ui/
    compra-form.tsx
    compra-table.tsx
    compra-detail.tsx
  server/
    compra.service.ts
    compra.repository.ts
    compra.schema.ts
  actions/
    create-compra.ts
    update-compra.ts

Separación obligatoria entre:

UI
validación
actions
repository
lógica de negocio
11. Validación con Zod

Crear esquema Zod para compra.

Debe validar al menos:

empresaId
proveedorId
tipoDocumentoId
documentoAfectadoId
numeroFactura
numeroControl
fechaFactura
montoExento
montoBase
impuestoIVA
totalFactura
tipoAjuste
motivoAjuste

Y debe incluir refinements para:

notas de crédito/débito requieren documento afectado
fecha válida
total coherente
montos no negativos
12. Estrategia de implementación
12.1 Listado

Crear función tipo:

getComprasByTenant(tenantId, filters?)

Permitir más adelante filtros por:

empresa
proveedor
período
estado

Para este paso basta con soportar los filtros básicos si resulta simple.

12.2 Detalle

Crear función tipo:

getCompraById(id, tenantId)

Debe incluir joins útiles como:

empresa
proveedor
tipoDocumento
periodoFiscal
documentoAfectado
12.3 Creación

Crear función tipo:

createCompra(data, tenantId)

Debe hacer, en este orden:

validar empresa del tenant
validar proveedor del tenant y empresa
validar tipo de documento
validar documento afectado si aplica
resolver y exigir requirePeriodoAbierto(empresaId, "IVA", fechaFactura)
crear compra con periodoFiscalId del período abierto encontrado
guardar estado inicial REGISTRADA
12.4 Edición

Crear función tipo:

updateCompra(id, data, tenantId)

Debe validar:

compra pertenece al tenant
compra no está en un período cerrado
documento afectado coherente
nueva fecha siga cayendo en período abierto válido si se cambia de forma relevante

Para el MVP, si editar en períodos cerrados complica mucho, debe bloquearse explícitamente.

13. Regla de bloqueo por período cerrado

Este módulo debe empezar a aplicar la política del sistema:

si el período fiscal asociado está CERRADO, la compra no debe poder editarse

No hace falta todavía implementar todas las variantes del bloqueo global del sistema, pero este módulo sí debe respetar esa regla al menos en edición.

14. UI mínima requerida
14.1 Página listado

Debe incluir:

título del módulo
botón “Nueva compra”
tabla o cards con resultados
empresa
proveedor
número de factura
fecha
total
estado
tipo de documento
acción de ver detalle
acción de editar
14.2 Página nueva compra

Debe incluir:

formulario claro
selección de empresa
selección de proveedor
selección de tipo documento
documento afectado condicional
montos
guardar / cancelar
mensajes de error
14.3 Página editar

Debe cargar valores existentes y respetar bloqueo por período cerrado.

14.4 Página detalle

Debe mostrar:

empresa
proveedor
tipo documental
período fiscal asociado
montos
estado
documento afectado si existe
timestamps
enlace a editar si aplica
15. Experiencia de usuario

Requisitos:

selects claros
mensajes comprensibles
feedback al guardar
redirección consistente
mostrar claramente cuando una nota de crédito/débito depende de otro documento
mostrar claramente si una compra quedó asociada a un período fiscal

Mantener coherencia visual con módulos anteriores.

16. Seguridad y multitenancy

Asegurar que:

no se vean compras de otro tenant
no se creen compras para empresas ajenas
no se asignen proveedores de otra empresa/tenant
no se usen documentos afectados fuera del tenant
rutas inválidas respondan con manejo consistente
17. Preparación para siguiente fase fiscal

Este módulo debe dejar preparado el terreno para el próximo paso:

cálculo de RetencionIVA
reglas de exclusión
retención 75% o 100%
emisión de comprobante

Por eso, al guardar una compra deben quedar bien establecidos:

empresa
proveedor
período fiscal
tipo documental
montos

No calcular aún la retención, pero sí dejar la compra completamente utilizable por el siguiente módulo.

18. Entregables requeridos

Cursor debe dejar implementado:

listado de compras
creación de compra
edición básica
detalle
validación Zod
uso obligatorio de requirePeriodoAbierto
validación de empresa, proveedor y documento afectado
bloqueo de edición si el período está cerrado
resumen técnico corto con:
qué implementó
decisiones tomadas
qué quedó pendiente para retención IVA
19. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

registrar compras correctamente
asociarlas a empresa y proveedor válidos
vincularlas a un período fiscal abierto de IVA
registrar facturas y ajustes documentales
consultar detalle
bloquear edición cuando el período esté cerrado
dejar la base lista para cálculo de retención IVA
20. Fuera de alcance de este paso

No implementar todavía:

cálculo automático de RetencionIVA
comprobante IVA
exportación TXT
libro de compras formal
anulaciones masivas
notas de crédito con impacto automático en retención
control de números duplicados por proveedor
aprobación de documentos