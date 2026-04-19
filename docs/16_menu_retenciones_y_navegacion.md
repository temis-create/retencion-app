# 16_menu_retenciones_y_navegacion.md

# 1. Objetivo

Organizar y consolidar la navegación funcional del sistema RetenSaaS para que el flujo ya implementado de IVA sea accesible, coherente y usable desde la aplicación, mediante un menú y estructura de rutas claras.

Este paso debe resolver:

- sección visible de Retenciones en el menú
- agrupación lógica de módulos de IVA
- acceso claro a comprobantes y exportaciones
- consistencia de nombres y rutas
- mejor navegación entre compras, retenciones y comprobantes
- base visual lista para incorporar ISLR después

No se busca agregar lógica fiscal nueva en este paso, sino ordenar correctamente la experiencia de navegación del sistema.

---

# 2. Problema actual

Ya existen varios módulos y flujos de IVA implementados, pero el usuario no tiene una navegación clara y unificada para encontrarlos.

Actualmente ya debería existir funcionalidad para:

- compras
- cálculo de retención IVA
- emisión de comprobante IVA
- impresión / PDF
- exportación TXT IVA

Sin embargo, si no existe una sección clara en el menú y rutas consistentes, el sistema queda funcionalmente incompleto desde la perspectiva del usuario.

---

# 3. Alcance del paso

Este paso debe incluir:

1. creación o consolidación de la sección de menú `Retenciones`
2. subnavegación para IVA
3. rutas privadas coherentes
4. acceso a comprobantes IVA
5. acceso a exportaciones IVA
6. integración de accesos contextuales desde compras
7. breadcrumbs coherentes
8. placeholders razonables para ISLR si se decide mostrarlo

No implementar todavía:

- lógica nueva de ISLR
- nuevas reglas tributarias
- dashboard analítico avanzado
- permisos granulares por pantalla si aún no están

---

# 4. Estructura funcional recomendada

## 4.1 Menú principal
Agregar o consolidar una sección principal:

```txt
Retenciones

Dentro de ella, crear al menos esta estructura:

Retenciones
  ├── IVA
  │   ├── Retenciones IVA
  │   ├── Comprobantes IVA
  │   └── Exportaciones IVA
4.2 ISLR

Como el flujo de ISLR aún no está implementado, elegir una de estas dos estrategias y documentarla:

Opción A (recomendada)

No mostrar todavía ISLR en el menú lateral principal.

Opción B

Mostrarlo como deshabilitado o “Próximamente”.

Si eliges esta opción, debe verse claramente como no disponible y no generar confusión.

5. Rutas objetivo

Revisar y consolidar las rutas privadas reales del sistema para IVA.

Como mínimo deben quedar accesibles y coherentes estas rutas o equivalentes:

/dashboard/compras
/dashboard/fiscal/retenciones-iva
/dashboard/fiscal/comprobantes-iva
/dashboard/fiscal/exportaciones-iva

Si el proyecto ya usa una convención distinta, mantenerla, pero unificarla en todo el sistema.

Regla importante

No debe haber mezcla inconsistente entre rutas como:

/compras/...
/dashboard/compras/...
/fiscal/...
/dashboard/fiscal/...

Cursor debe revisar y dejar una convención única.

6. Elementos del menú
6.1 Retenciones IVA

Debe llevar a una vista donde el usuario pueda ver retenciones IVA calculadas o administrables.

Si ya existe el flujo desde compras, pero no un listado dedicado, crear al menos una pantalla básica que sirva como entrada del módulo.

6.2 Comprobantes IVA

Debe llevar al listado de comprobantes emitidos.

Desde allí el usuario debe poder:

ver detalle
imprimir
descargar PDF
identificar el comprobante emitido
6.3 Exportaciones IVA

Debe llevar al listado o pantalla de generación/historial de exportaciones TXT.

7. Integración contextual desde Compras

La navegación no debe depender solo del menú lateral.

Desde el detalle de compra

Si la compra tiene:

Retención calculada pero no comprobantada

Mostrar acceso o acción clara para:

emitir comprobante IVA
Comprobante ya emitido

Mostrar:

número de comprobante
enlace al detalle del comprobante
acceso a impresión
acceso a PDF si ya existe

Esto debe sentirse como flujo natural, no como módulo aislado.

8. Breadcrumbs y títulos

Cada pantalla del flujo IVA debe tener breadcrumb coherente.

Ejemplos:

Compras
Dashboard / Compras / Detalle
Comprobantes
Dashboard / Retenciones / IVA / Comprobantes / Detalle
Exportaciones
Dashboard / Retenciones / IVA / Exportaciones

El nombre visual del módulo debe ser consistente en:

menú
headers
breadcrumbs
títulos de página

Evitar mezclar términos ambiguos como:

Fiscal
Retenciones
Comprobantes
sin jerarquía clara
9. Sidebar / menú lateral

Actualizar el componente del sidebar o navegación principal para reflejar la nueva estructura.

Requisitos
sección visible y clara para Retenciones
ítems colapsables si ya usas patrón expandible
estado activo correcto
íconos coherentes
no saturar el menú
Recomendación

Mantener el menú compacto y profesional.

10. Pantallas mínimas requeridas

Si algún módulo ya existe parcialmente pero no tiene landing clara, crearla.

Debe haber al menos:

10.1 Retenciones IVA

Pantalla base o listado

10.2 Comprobantes IVA

Listado funcional

10.3 Exportaciones IVA

Pantalla de generación/historial

No deben ser páginas vacías sin contexto.

11. Revisión de consistencia de nombres

Cursor debe revisar y unificar terminología en UI.

Ejemplos recomendados:

Retenciones IVA
Comprobantes IVA
Exportaciones IVA
Emitir comprobante IVA
Calcular retención IVA

Evitar mezclar textos como:

“comprobante”
“emitir”
“retención”
“documento”
sin contexto claro
12. Accesibilidad funcional

Al finalizar este paso, el usuario debe poder recorrer el flujo IVA sin hacks ni rutas ocultas:

ir a Compras
ver/cargar retención
emitir comprobante
entrar al comprobante
imprimir/PDF
exportar TXT

Todo debe ser descubrible desde la navegación normal de la app.

13. Requisitos técnicos
mantener server-first donde aplique
no romper multitenancy
revisar revalidatePath donde haga falta
unificar rutas y links
evitar duplicar vistas o menús con nombres distintos
no mover lógica fiscal a esta capa
14. Entregables requeridos

Cursor debe dejar implementado:

menú lateral actualizado
sección Retenciones
submenú de IVA
acceso a comprobantes IVA
acceso a exportaciones IVA
breadcrumbs coherentes
integración contextual desde compras
resumen técnico corto con:
qué rutas unificó
qué menú agregó
qué decidió hacer con ISLR por ahora
qué partes quedaron listas para el siguiente módulo
15. Resultado esperado

Al finalizar este paso, el sistema debe tener una navegación clara y profesional para todo el flujo ya implementado de IVA, de forma que el usuario pueda encontrar y usar:

retenciones
comprobantes
impresión/PDF
exportaciones

sin depender de rutas escondidas ni supuestos internos.

16. Fuera de alcance de este paso

No implementar todavía:

módulo funcional de ISLR
permisos granulares por submódulo
dashboard fiscal avanzado
notificaciones
filtros analíticos complejos