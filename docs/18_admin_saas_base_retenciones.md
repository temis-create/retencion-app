# 18_admin_saas_base_retenciones.md

# 1. Objetivo

Implementar la **base administrativa del SaaS** en RetenSaaS, separada del dashboard operativo del cliente, para que la plataforma pueda gestionar comercial y operativamente:

- organizaciones / tenants
- usuarios
- empresas por tenant
- planes
- asignación manual de plan o suscripción
- activación / suspensión
- límites básicos del producto

Este módulo debe ser la base del backoffice de la plataforma.

---

# 2. Alcance del paso

Este paso debe incluir:

1. área administrativa separada del dashboard operativo
2. protección por rol de admin SaaS
3. dashboard admin básico
4. listado y detalle de organizaciones
5. listado y detalle de usuarios
6. listado y detalle de empresas por organización
7. modelo y CRUD básico de planes
8. asignación manual de plan a organización
9. activación / suspensión de organizaciones
10. reglas iniciales de límites por plan

No implementar todavía:

- pagos online
- facturación automática
- onboarding automático comercial
- tickets de soporte
- métricas avanzadas
- permisos ultra granulares
- billing complejo

---

# 3. Separación de áreas

Definir claramente tres capas:

## 3.1 Sitio público
- landing
- acceso comercial
- rutas públicas

## 3.2 App operativa del cliente
- compras
- pagos
- retenciones
- comprobantes
- exportaciones

## 3.3 Admin del SaaS
- gestión de organizaciones
- planes
- usuarios
- límites
- estado de cuenta/operación

---

# 4. Arquitectura de rutas

Crear una zona separada para administración del SaaS.

Ruta sugerida:

```txt
/dashboard-admin

o una agrupación equivalente, por ejemplo:

src/app/(admin)/
Rutas mínimas sugeridas
/dashboard-admin
/dashboard-admin/organizaciones
/dashboard-admin/organizaciones/[id]
/dashboard-admin/usuarios
/dashboard-admin/planes
/dashboard-admin/planes/[id]

Si decides otra convención, mantener coherencia total en menú, rutas y breadcrumbs.

5. Regla de acceso

Solo debe poder entrar a esta zona un usuario con rol administrativo global del SaaS.

Requisito

No basta con ser admin de una organización/tenant.
Debe existir un rol tipo:

SUPERADMIN
o
ADMIN_SAAS

y debe validarse en middleware y server-side.

6. Modelos mínimos requeridos
6.1 Organización / Tenant

El modelo actual de organización debe soportar como mínimo:

id
nombre
slug (si aplica)
rif opcional
estado
planId
fechaInicioPlan
fechaFinPlan
limiteEmpresas
activo

Si ya existe Organizacion, ajustarla con mínimos cambios y sin rediseñar innecesariamente.

6.2 Plan

Crear o consolidar modelo Plan con:

id
nombre
codigo
descripcion
precioReferencial
limiteEmpresas
limiteUsuarios (opcional)
modulosHabilitados (JSON o equivalente simple)
activo
6.3 Usuario

El modelo usuario debe permitir identificar:

organización
rol
activo
email
nombre
6.4 Empresa

Ya existe, pero el admin SaaS debe poder ver:

cantidad por organización
estado
relación con tenant
7. Reglas de negocio mínimas
7.1 Organización activa

Una organización activa:

puede acceder al sistema
puede operar normalmente
7.2 Organización suspendida

Una organización suspendida:

no debe poder operar en dashboard del cliente
debe recibir mensaje claro de suspensión
7.3 Límite de empresas

Si el plan define limiteEmpresas, el sistema debe impedir crear nuevas empresas cuando se alcance ese límite.

7.4 Plan manual

Para esta fase, la asignación de plan será manual desde el admin SaaS.

8. Dashboard admin básico

La home del admin SaaS debe mostrar KPIs básicos.

KPIs mínimos
total organizaciones
organizaciones activas
organizaciones suspendidas
total usuarios
total empresas
total comprobantes IVA emitidos
total comprobantes ISLR emitidos
total exportaciones generadas

No hace falta analítica avanzada aún.

9. Módulo de Organizaciones
9.1 Listado

Mostrar:

nombre
estado
plan
cantidad de empresas
cantidad de usuarios
fecha inicio / fin plan si existe
acciones: ver detalle, activar, suspender
9.2 Detalle

Mostrar:

datos generales
plan actual
límites
empresas del tenant
usuarios del tenant
acciones de administración
9.3 Acciones mínimas
activar
suspender
cambiar plan
ajustar límite de empresas si hace falta
10. Módulo de Usuarios
10.1 Listado

Mostrar:

nombre
email
organización
rol
estado
10.2 Alcance

En esta fase no hace falta un CRUD completo complejo.
Basta con listado y visualización básica, y si es fácil:

activar / desactivar usuario
11. Módulo de Empresas por organización

Desde el detalle de una organización, mostrar tabla o cards con:

nombre fiscal
RIF
activa
fecha creación

Objetivo:
permitir al admin SaaS ver si la organización está dentro del límite de su plan.

12. Módulo de Planes
12.1 Listado de planes

Mostrar:

nombre
código
precio referencial
límite empresas
activo
12.2 CRUD básico

Permitir:

crear plan
editar plan
activar/desactivar plan
12.3 No complicar todavía

No meter facturación automática.
El plan es una configuración comercial interna por ahora.

13. Asignación manual de plan

En el detalle de organización o en un flujo simple, permitir:

seleccionar plan
asignarlo a organización
definir fecha inicio
definir fecha fin opcional
aplicar límite derivado o editable

Debe quedar documentado si limiteEmpresas se toma directamente del plan o si puede sobreescribirse por organización.

Recomendación MVP
tomar límite desde el plan
permitir override opcional solo para admin SaaS si hace falta
14. Enforzamiento de límites

Este paso debe dejar al menos una regla real funcionando:

Límite de empresas

Al crear empresa desde la app operativa:

revisar organización actual
revisar plan/límite
bloquear si excede

Mensaje sugerido:

Tu organización alcanzó el límite de empresas permitidas por su plan actual.
15. Suspensión de acceso

Si una organización está suspendida:

Recomendación

Bloquear acceso al dashboard operativo del cliente.

Opciones válidas:

redirigir a una pantalla de suspensión
mostrar mensaje de cuenta suspendida después de login

No dejar operar normalmente.

16. Arquitectura técnica sugerida
src/modules/admin-saas/
  dashboard/
  organizaciones/
  usuarios/
  planes/
  server/
    admin-saas.service.ts
    admin-saas.repository.ts
    admin-saas.schema.ts
  actions/

O una estructura por módulo equivalente.

Separar claramente:

UI
actions
service
repository
validación
17. Middleware y seguridad
17.1 Acceso admin SaaS

Agregar validación de rol global en middleware o layout protegido.

17.2 Seguridad server-side

No confiar solo en la UI.
Todas las acciones de admin SaaS deben validar rol global desde servidor.

17.3 Aislamiento

El admin SaaS sí puede ver múltiples tenants.
Eso no rompe multi-tenancy; es parte del rol especial.

18. UI y navegación

Crear menú o submenú para el admin SaaS.

Ejemplo:

Admin SaaS
  ├── Dashboard
  ├── Organizaciones
  ├── Usuarios
  └── Planes

No mezclar esto con la navegación fiscal del cliente.

19. Breadcrumbs

Ejemplos:

Admin SaaS / Organizaciones
Admin SaaS / Organizaciones / Detalle
Admin SaaS / Planes
20. Entregables requeridos

Cursor debe dejar implementado:

zona admin SaaS separada
control de acceso por rol global
dashboard admin básico
listado y detalle de organizaciones
listado básico de usuarios
listado/CRUD básico de planes
asignación manual de plan a organización
límite de empresas funcionando
suspensión de organizaciones funcionando
resumen técnico corto con:
qué modelos ajustó
cómo resolvió roles globales
cómo resolvió asignación de plan
cómo aplicó límites
21. Resultado esperado

Al finalizar este paso, el sistema debe permitir operar el SaaS desde una capa administrativa real, separada del dashboard del cliente, y el dueño de la plataforma debe poder:

ver tenants
ver usuarios
asignar planes
limitar empresas
suspender cuentas
controlar el producto comercialmente
22. Fuera de alcance

No implementar todavía:

Stripe
facturación automática
renovación automática
onboarding comercial automático
métricas de facturación avanzadas
soporte integrado