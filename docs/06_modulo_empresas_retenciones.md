# 06_modulo_empresas_retenciones.md

# 1. Objetivo

Implementar el módulo de **Empresas** de RetenSaaS como primer módulo funcional real del sistema, permitiendo gestionar las entidades legales del tenant que operan como agentes de retención.

Este módulo debe servir para:

- registrar empresas
- listar empresas del tenant autenticado
- visualizar detalle de empresa
- editar datos básicos
- aplicar validaciones de negocio
- dejar base lista para futura selección de empresa activa

Este paso debe consolidar el patrón técnico que luego se repetirá en módulos como Proveedores, Compras y Pagos.

---

# 2. Alcance del paso

Este módulo debe incluir:

1. listado de empresas del tenant
2. creación de empresa
3. edición de empresa
4. vista detalle básica
5. validaciones del formulario
6. reglas de aislamiento por tenant
7. integración con el dashboard privado
8. arquitectura reusable tipo SaaS

No implementar todavía:

- eliminación física
- selector multiempresa avanzado
- cambio de empresa activa persistido por usuario
- importación masiva
- auditoría detallada del módulo
- historial de cambios

---

# 3. Rutas requeridas

Implementar como mínimo estas rutas:

```txt
/dashboard/empresas
/dashboard/empresas/nueva
/dashboard/empresas/[id]
/dashboard/empresas/[id]/editar

Si tu estructura usa el grupo (dashboard), mantén coherencia con la arquitectura actual.

4. Funcionalidades requeridas
4.1 Listado de empresas

La vista principal del módulo debe mostrar todas las empresas del tenant autenticado.

Cada fila o tarjeta debe mostrar al menos:

nombre fiscal
RIF
teléfono
condición de agente de retención IVA
condición de agente de retención ISLR
fecha de creación
acción para ver detalle
acción para editar

Requisitos:

filtrar obligatoriamente por tenantId
no mostrar empresas eliminadas lógicamente (deletedAt)
ordenar por fecha de creación descendente o por nombre fiscal, de forma consistente
4.2 Crear empresa

Debe existir un formulario para registrar nueva empresa.

Campos mínimos:

nombreFiscal
rif
direccion
telefono
agenteRetencionIVA
agenteRetencionISLR

Al crear una empresa, también debe generarse automáticamente su registro asociado en ParametroFiscal, con valores iniciales por defecto.

4.3 Editar empresa

Debe permitir actualizar los campos básicos de la empresa.

Requisitos:

solo permitir editar empresas del tenant autenticado
no permitir modificar el tenantId
mantener integridad del registro asociado en ParametroFiscal
4.4 Vista detalle

Debe existir una página de detalle con información clara de la empresa.

Mostrar:

datos generales
flags fiscales
timestamps importantes
información de parámetros fiscales asociados si ya existe
enlace a editar
5. Validaciones de negocio
5.1 RIF

Validar que el RIF tenga formato razonable compatible con Venezuela.

Acepta formatos tipo:

J-12345678-9
V-12345678-9
G-12345678-9
E-12345678-9
P-12345678-9

No hace falta validar contra SENIAT todavía, solo formato estructural.

5.2 Unicidad

No permitir duplicar empresas con el mismo RIF dentro del mismo tenant.

Si el schema ya garantiza unicidad por (tenantId, rif), la UI y server action deben manejar el error de forma amigable.

5.3 Campos obligatorios

Como mínimo obligatorios:

nombreFiscal
rif

Los demás pueden ser opcionales si así quedó en el schema.

5.4 Parámetros fiscales iniciales

Al crear una empresa, crear también ParametroFiscal con:

proximoCorrelativoIVA = 1
proximoCorrelativoISLR = 1
reinicioCorrelativoMensual = true

Si tu schema incluye otros defaults válidos, aplícalos también.

6. Arquitectura técnica requerida

Implementar el módulo usando una separación clara entre:

UI
validación
acciones servidor
acceso a datos

Estructura sugerida:

src/modules/empresa/
  ui/
    empresa-form.tsx
    empresa-table.tsx
    empresa-detail.tsx
  server/
    empresa.service.ts
    empresa.repository.ts
    empresa.schema.ts
  actions/
    create-empresa.ts
    update-empresa.ts

Puedes adaptar los nombres, pero mantén separación técnica limpia.

7. Validación con Zod

Crear esquema de validación para formularios de empresa usando Zod.

Debe validar:

nombreFiscal
rif
direccion
telefono
agenteRetencionIVA
agenteRetencionISLR

Usar este esquema tanto para creación como para edición, adaptándolo si hace falta.

8. Server-side data access

Toda lectura y escritura debe ocurrir del lado del servidor.

Requisitos:

usar Prisma solo en server-side
filtrar por tenantId en todos los queries
validar que la empresa consultada pertenezca al tenant actual
centralizar lógica en service/repository si ya estás usando esa separación

No hacer consultas Prisma desde client components.

9. Estrategia de implementación
9.1 Listado

Crear función tipo:

getEmpresasByTenant(tenantId)
9.2 Detalle

Crear función tipo:

getEmpresaById(id, tenantId)
9.3 Creación

Crear función tipo:

createEmpresa(data, tenantId)

Debe usar transacción para:

crear empresa
crear ParametroFiscal
9.4 Edición

Crear función tipo:

updateEmpresa(id, data, tenantId)
10. UI mínima requerida
10.1 Página listado

Debe incluir:

título del módulo
botón “Nueva empresa”
tabla o cards con resultados
estado vacío si no hay empresas
10.2 Página nueva empresa

Debe incluir:

breadcrumb o referencia de navegación
formulario limpio
botones guardar / cancelar
mensajes de validación
10.3 Página editar

Misma base del formulario, precargado con datos existentes.

10.4 Página detalle

Vista simple, clara y administrativa.

11. UX y comportamiento

Requisitos mínimos:

feedback de carga o submit
mensajes de error comprensibles
redirección al listado o detalle tras guardar con éxito
mantener estilo consistente con el dashboard

No hace falta un diseño extremadamente pulido todavía, pero sí profesional y usable.

12. Seguridad y multitenancy

Asegurar que:

un usuario no pueda ver empresas de otro tenant
un usuario no pueda editar empresas de otro tenant
rutas con id inválido o ajeno respondan con:
notFound()
redirect
o error controlado
según tu criterio técnico, pero de forma consistente
13. Integración con empresa activa

Aunque todavía no se implemente selector avanzado, este módulo debe dejar el terreno listo para eso.

Por ahora:

si el helper getEmpresaActiva() usa la primera empresa del tenant, mantenerlo
documentar que en futuras fases la empresa activa se elegirá explícitamente

No implementar todavía persistencia de empresa activa por usuario.

14. Entregables requeridos

Cursor debe dejar implementado:

listado de empresas
formulario de creación
formulario de edición
detalle de empresa
validación con Zod
acciones server-side
creación automática de ParametroFiscal
resumen técnico corto indicando:
qué implementó
decisiones tomadas
qué quedó pendiente
15. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

entrar al módulo Empresas
ver empresas del tenant
crear una nueva empresa
editar una empresa existente
ver detalle
mantener aislamiento multitenant
dejar la base lista para selector de empresa activa en el futuro
16. Fuera de alcance de este paso

No implementar todavía:

borrar empresa desde UI
restaurar empresa eliminada
cambio de empresa activa
exportación de empresas
auditoría del módulo
carga masiva por Excel