# 05_dashboard_base_retenciones.md

# 1. Objetivo

Construir el dashboard base privado de RetenSaaS, dejando lista la estructura visual y funcional inicial del sistema para usuarios autenticados.

Este paso debe establecer:

- layout privado
- navegación lateral
- header superior
- contexto visible de organización y empresa
- página inicial interna del sistema
- KPIs base
- accesos rápidos a módulos
- base reutilizable para el resto de pantallas

No se busca todavía construir todos los módulos funcionales, sino la columna vertebral visual y operativa del área privada.

---

# 2. Alcance del paso

Este paso debe incluir:

1. Layout privado para rutas autenticadas
2. Sidebar navegable
3. Header superior
4. Dashboard home
5. Visualización del tenant actual
6. Visualización de empresa activa o estado temporal equivalente
7. KPIs iniciales
8. Tarjetas de accesos rápidos
9. Estructura de navegación lista para crecer

No implementar todavía:

- gráficos complejos
- selector multiempresa avanzado completo
- permisos granulares por vista
- estadísticas fiscales definitivas
- preferencias de usuario
- notificaciones en tiempo real

---

# 3. Estructura de rutas sugerida

Implementar un grupo privado tipo:

```txt
src/app/(dashboard)/
  layout.tsx
  dashboard/page.tsx
  empresas/page.tsx
  proveedores/page.tsx
  compras/page.tsx
  pagos/page.tsx
  retenciones/page.tsx
  fiscal/page.tsx

  Si ya existe otra estructura similar, mantener la más coherente con el proyecto, pero separar claramente el layout público del privado.

4. Requisitos funcionales
4.1 Layout privado

Debe existir un layout autenticado que:

exija sesión activa
obtenga el usuario actual
obtenga tenantId
muestre navegación lateral persistente
muestre header persistente
renderice el contenido interno
4.2 Sidebar

El sidebar debe incluir al menos:

Dashboard
Empresas
Proveedores
Compras
Pagos
Retenciones
Fiscal

Cada item debe navegar correctamente aunque algunas pantallas sean placeholders iniciales.

Debe incluir:

nombre del sistema o logo textual
organización actual
usuario autenticado
botón de cerrar sesión
4.3 Header

El header superior debe mostrar:

nombre o saludo al usuario
tenant/organización actual
empresa activa o mensaje temporal si aún no hay selector
espacio reservado para acciones futuras
4.4 Dashboard Home

La página /dashboard debe ser una landing interna útil, no solo una página vacía.

Debe incluir:

bienvenida
resumen de contexto
tarjetas KPI
accesos rápidos
estado del sistema
5. Empresa activa

Como todavía no se implementa selector visual completo de empresa activa, usar esta estrategia temporal:

obtener la primera empresa disponible del tenant autenticado
usarla como empresa activa por defecto
mostrar claramente que es una selección temporal/base del MVP

Crear helper server-side para esto, por ejemplo:

getEmpresaActiva()

Este helper debe ser reutilizable en módulos futuros.

6. KPIs iniciales

Mostrar KPIs básicos, aunque algunos sean provisionales o simplificados.

Mínimos requeridos:

cantidad de empresas del tenant
cantidad de proveedores activos
cantidad de compras registradas
cantidad de pagos registrados
cantidad de retenciones IVA
cantidad de retenciones ISLR

Estos KPIs deben obtenerse desde Prisma filtrando por tenantId y, donde aplique, por empresa activa.

No inventar datos mock si ya se puede consultar la base real.

7. Accesos rápidos

Incluir tarjetas o botones rápidos hacia:

Registrar proveedor
Registrar compra
Registrar pago
Ver retenciones
Configuración fiscal

Si las pantallas destino aún están vacías, al menos deben existir como placeholders funcionales.

8. Placeholders mínimos para módulos

Crear páginas base para:

/empresas
/proveedores
/compras
/pagos
/retenciones
/fiscal

Cada página debe mostrar al menos:

título del módulo
breve descripción
referencia a tenant actual
referencia a empresa activa si aplica
mensaje de "módulo en construcción" si aún no tiene funcionalidad

Esto permite navegar y validar la arquitectura real del sistema.

9. Componentes sugeridos

Crear componentes reutilizables, por ejemplo:

src/modules/dashboard/ui/
  dashboard-shell.tsx
  dashboard-sidebar.tsx
  dashboard-header.tsx
  stat-card.tsx
  quick-actions.tsx

Puedes ajustar nombres, pero mantén separación limpia entre layout y componentes.

10. Helpers server-side requeridos

Implementar o ajustar helpers para:

getCurrentUser()
getTenantId()
getEmpresaActiva()
requireAuth()

Y si ayuda a ordenar:

getDashboardMetrics()

La lógica de acceso a datos del dashboard debe estar en server-side, no en client components.

11. Diseño y UX

Requisitos de diseño:

interfaz limpia y profesional
pensada para SaaS administrativo/fiscal
responsive básica
buena jerarquía visual
sin exceso de estilos innecesarios

Usar Tailwind CSS.
Si ya tienes shadcn/ui instalado, puedes usarlo.
Si no lo tienes todavía, puedes resolver este paso con Tailwind puro.

No perder tiempo aún en pulido visual extremo. Lo importante es dejar una base sólida y agradable.

12. Protección y consistencia

Asegurar que:

todas las rutas privadas usen el layout autenticado
ninguna query del dashboard salga sin tenantId
la empresa activa temporal pertenezca al tenant actual
no se hagan consultas Prisma desde client components
13. Entregables requeridos

Cursor debe dejar implementado:

layout privado operativo
sidebar y header
dashboard home con KPIs
helper de empresa activa
placeholders de módulos
navegación funcional entre módulos
resumen técnico corto con:
qué se implementó
decisiones tomadas
limitaciones temporales del MVP
14. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

iniciar sesión
entrar a un dashboard privado
navegar por módulos principales
ver contexto de organización
ver empresa activa base
consultar métricas iniciales reales
tener estructura lista para construir los módulos funcionales
15. Fuera de alcance de este paso

No implementar todavía:

CRUD de empresas
CRUD de proveedores
formularios de compras/pagos
gráficos financieros avanzados
selector multiempresa completo
permisos por módulo
temas/dark mode
notificaciones