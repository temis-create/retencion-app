# 07_modulo_proveedores_retenciones.md

# 1. Objetivo

Implementar el módulo de **Proveedores** de RetenSaaS, permitiendo gestionar los terceros sujetos a retención dentro del tenant y asociados a una empresa operativa.

Este módulo debe dejar resuelto:

- listado de proveedores
- creación de proveedor
- edición de proveedor
- vista detalle
- relación con empresa
- validaciones fiscales básicas
- aislamiento por tenant
- preparación para cálculos futuros de IVA e ISLR

Este módulo depende directamente de la existencia del módulo Empresas y debe seguir el mismo patrón técnico y arquitectónico ya validado allí.

---

# 2. Alcance del paso

Debe incluir:

1. listado de proveedores
2. creación de proveedor
3. edición de proveedor
4. detalle de proveedor
5. asociación obligatoria a empresa
6. validaciones con Zod
7. reglas fiscales básicas del proveedor
8. filtrado por tenant y empresa

No implementar todavía:

- importación masiva
- sincronización con SENIAT
- historial de cambios
- soft delete desde UI
- clasificación avanzada por categorías internas
- carga de documentos adjuntos

---

# 3. Rutas requeridas

Implementar como mínimo:

```txt
/dashboard/proveedores
/dashboard/proveedores/nuevo
/dashboard/proveedores/[id]
/dashboard/proveedores/[id]/editar

Mantener consistencia con el patrón usado en Empresas.

4. Relación con Empresa

Cada proveedor debe pertenecer a una empresa del tenant.

Requisitos:

no se puede crear proveedor sin empresa asociada
solo se pueden asociar proveedores a empresas del tenant autenticado
en el MVP se puede usar la empresa activa por defecto
si el usuario tiene varias empresas y aún no existe selector avanzado, permitir:
usar getEmpresaActiva()
o permitir elegir empresa en el formulario, pero solo entre empresas del tenant

Cursor debe aplicar la alternativa que mejor encaje con la UX actual del proyecto y documentarla.

5. Campos mínimos del proveedor

El formulario debe soportar como mínimo:

empresaId
nombre
rif
tipoPersona
tipoResidencia
tipoContribuyente
porcentajeRetencionIVA

Campos esperados según el schema actual y dominio aprobado.

6. Significado funcional de los campos fiscales
6.1 tipoPersona

Debe permitir al menos:

NATURAL
JURIDICA
6.2 tipoResidencia

Debe soportar los valores definidos en el schema actual.

6.3 tipoContribuyente

Debe soportar los valores definidos en el schema actual, por ejemplo:

ORDINARIO
ESPECIAL
FORMAL
6.4 porcentajeRetencionIVA

Campo importante para la futura lógica de IVA.

Debe permitir al menos:

75
100

Puede implementarse como:

select con opciones cerradas
o input validado estrictamente

Para el MVP se recomienda select controlado para evitar errores.

7. Validaciones de negocio
7.1 RIF

Validar formato razonable compatible con Venezuela:

J-12345678-9
V-12345678-9
G-12345678-9
E-12345678-9
P-12345678-9

No consultar SENIAT todavía.

7.2 Unicidad

No permitir duplicar proveedores con el mismo RIF dentro de la misma empresa.

Si el schema ya tiene unique por (empresaId, rif), manejar el error de forma amigable en UI y server action.

7.3 Consistencia fiscal

Validar que:

si tipoPersona = NATURAL, la UI y backend acepten configuración coherente para futuras reglas de ISLR
si tipoContribuyente = FORMAL, quede documentado que eso afectará futuras exclusiones de IVA
porcentajeRetencionIVA sea uno de los valores permitidos por el MVP
7.4 Campos obligatorios

Como mínimo obligatorios:

empresaId
nombre
rif
tipoPersona
tipoResidencia
tipoContribuyente
porcentajeRetencionIVA
8. Arquitectura técnica requerida

Mantener el mismo patrón usado en Empresas.

Estructura sugerida:

src/modules/proveedores/
  ui/
    proveedor-form.tsx
    proveedor-table.tsx
    proveedor-detail.tsx
  server/
    proveedor.service.ts
    proveedor.repository.ts
    proveedor.schema.ts
  actions/
    create-proveedor.ts
    update-proveedor.ts

Mantener separación entre:

UI
validación
actions
repository
service
9. Validación con Zod

Crear esquema Zod para proveedor.

Debe validar:

empresaId
nombre
rif
tipoPersona
tipoResidencia
tipoContribuyente
porcentajeRetencionIVA

Y opcionalmente agregar normalización básica, por ejemplo:

trim de nombre
uppercase en RIF si aplica
10. Estrategia de implementación
10.1 Listado

Crear función tipo:

getProveedoresByTenant(tenantId, empresaId?)

Permitir filtrar por empresa activa si aplica.

10.2 Detalle

Crear función tipo:

getProveedorById(id, tenantId)
10.3 Creación

Crear función tipo:

createProveedor(data, tenantId)

Debe validar que la empresa destino pertenezca al tenant.

10.4 Edición

Crear función tipo:

updateProveedor(id, data, tenantId)

Debe impedir editar proveedores fuera del tenant.

11. UI mínima requerida
11.1 Página listado

Debe incluir:

título del módulo
botón “Nuevo proveedor”
tabla o cards
filtro simple por empresa si ya encaja con tu layout actual
estado vacío
11.2 Página nuevo proveedor

Debe incluir:

referencia de navegación
formulario limpio
guardar / cancelar
mensajes de error
11.3 Página editar

Mismo formulario, precargado.

11.4 Página detalle

Mostrar al menos:

nombre
RIF
empresa asociada
tipoPersona
tipoResidencia
tipoContribuyente
porcentajeRetencionIVA
timestamps
enlace a editar
12. Experiencia de usuario

Requisitos:

formulario claro
selects amigables para enums
mensajes comprensibles
submit con feedback
redirección consistente al guardar

Mantener coherencia visual con el dashboard y el módulo Empresas.

13. Seguridad y multitenancy

Asegurar que:

no se vean proveedores de otro tenant
no se puedan editar proveedores de otro tenant
no se puedan asociar proveedores a empresas de otro tenant
rutas inválidas respondan con notFound() o manejo controlado consistente
14. Integración futura con retenciones

Aunque este paso no calcula impuestos todavía, el módulo debe dejar bien preparada la data para lógica futura.

Documentar o implementar de forma coherente que:

tipoPersona
tipoResidencia
tipoContribuyente
porcentajeRetencionIVA

serán usados luego por:

exclusiones de IVA
determinación de 75% o 100%
reglas de ISLR
exportaciones
15. Entregables requeridos

Cursor debe dejar implementado:

listado de proveedores
creación de proveedor
edición de proveedor
detalle de proveedor
validación Zod
filtro por tenant
validación de empresa perteneciente al tenant
resumen técnico corto con:
qué implementó
decisiones tomadas
qué quedó pendiente
16. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

navegar al módulo Proveedores
registrar proveedores correctamente
asociarlos a una empresa válida
editar y consultar detalle
mantener aislamiento multitenant
dejar la data lista para futura lógica fiscal real
17. Fuera de alcance de este paso

No implementar todavía:

importación desde Excel
consulta al SENIAT
historial de cambios
scoring fiscal
documentos adjuntos
baja/restauración desde UI