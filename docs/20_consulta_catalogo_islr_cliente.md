# 20_consulta_catalogo_islr_cliente.md

# 1. Objetivo

Implementar una vista de **consulta del catálogo de conceptos ISLR** dentro del dashboard del cliente en RetenSaaS, permitiendo a los usuarios entender cómo funcionan las retenciones, sin posibilidad de modificar la configuración normativa.

Este módulo debe:

- mostrar el catálogo ISLR de forma clara
- ayudar a entender el cálculo de retenciones
- aumentar la confianza del usuario en el sistema
- reducir errores operativos
- mantener el control de configuración en el admin SaaS

---

# 2. Alcance del paso

Este módulo debe incluir:

1. vista de listado del catálogo ISLR para el cliente
2. búsqueda y filtros básicos
3. visualización clara de conceptos
4. vista de detalle de cada concepto
5. diferenciación entre información funcional y técnica
6. integración dentro del módulo de retenciones

No debe permitir:

- crear conceptos
- editar conceptos
- eliminar conceptos
- modificar porcentajes o reglas

---

# 3. Ubicación en el sistema

Ruta sugerida:

```txt
/dashboard/retenciones/islr/catalogo

Ubicación en menú:

Retenciones
  └── ISLR
      └── Catálogo de conceptos
4. Principio de diseño UX

El catálogo debe ser:

entendible por contadores y operadores
no intimidante
útil como referencia
coherente con el selector inteligente
5. Vista de listado
Columnas recomendadas

Mostrar:

Concepto (nombre amigable)
Tipo de beneficiario (PNR, PJD, etc.)
Tipo de tarifa:
Porcentaje
Tarifa 2
Cálculo especial
% Retención (si aplica)
Base imponible (%)
Monto mínimo
Sustraendo
Estado (activo)
Ejemplo de fila
Honorarios profesionales | PNR | 3% | Base: 100% | Mínimo: 3583,34 | Sustraendo: 107,50 | Activo
6. Filtros y búsqueda
6.1 Búsqueda

Buscar por:

nombre del concepto
palabra clave
6.2 Filtro por tipo de beneficiario
PNR
PNNR
PJD
PJND
6.3 Filtro por tipo de tarifa
Porcentaje
Tarifa 2
Cálculo especial
6.4 Filtro por estado
Activos
Inactivos (opcional)
7. Vista de detalle

Al hacer clic en un concepto, mostrar:

7.1 Información básica
Nombre del concepto
Código SENIAT
Numeral / literal (si aplica)
Tipo de beneficiario
7.2 Reglas de cálculo
Base imponible
Tipo de tarifa
Porcentaje de retención
Monto mínimo
Sustraendo
7.3 Explicación

Agregar texto explicativo breve:

Este concepto aplica cuando se realizan pagos por servicios profesionales. La retención se calcula sobre la base imponible indicada, aplicando el porcentaje correspondiente y considerando el monto mínimo y sustraendo si aplica.
7.4 Indicadores visuales

Mostrar badges como:

Tarifa 2
Cálculo especial
Requiere condiciones específicas
8. Información explicativa global

En la parte superior del módulo mostrar una ayuda breve:

Este catálogo muestra los conceptos de retención ISLR utilizados por el sistema. Los valores están definidos según normativa vigente y son utilizados automáticamente en los cálculos.
9. Diferenciación funcional vs técnica
Mostrar claramente:
nombre del concepto
qué hace
cómo afecta la retención
Mostrar de forma secundaria (menos prominente):
código SENIAT
numeral
literal
10. Integración con el selector ISLR

Este módulo debe ser coherente con el selector de conceptos:

los nombres deben coincidir
el usuario debe poder identificar el concepto que selecciona en pagos
11. Relación con el motor de cálculo

El catálogo es solo informativo para el usuario.

El cálculo sigue siendo responsabilidad del motor ISLR.

No duplicar lógica de cálculo en la UI.

12. Datos a mostrar

Los datos deben venir del catálogo global (ConceptoISLR).

Filtrar por:

activos por defecto
todos si el usuario decide ver más
13. Seguridad
Reglas
solo lectura
no permitir modificaciones
no exponer endpoints de escritura
14. UX adicional recomendada
Tooltips

Para campos como:

base imponible
sustraendo
tarifa 2

Ejemplo:

Sustraendo: monto que se resta al cálculo de retención según normativa.
Formato numérico

Mostrar valores en formato:

Bs. 3.583,34
15. Arquitectura técnica sugerida
src/modules/retenciones/islr/catalogo/
  ui/
    catalogo-islr-table.tsx
    catalogo-islr-detail.tsx
    catalogo-islr-filters.tsx
  server/
    catalogo-islr.service.ts
16. Server logic

Crear:

getConceptosISLRForClient(filters)
getConceptoISLRDetail(id)

Ambos deben:

respetar tenant (solo lectura)
no permitir modificaciones
17. Rendimiento

El catálogo puede crecer, pero no es masivo.

paginación opcional
carga rápida
evitar consultas pesadas innecesarias
18. Entregables requeridos

Cursor debe dejar implementado:

vista de listado del catálogo ISLR
filtros y búsqueda
vista de detalle
textos explicativos
formato adecuado de datos
integración en menú de retenciones
solo lectura
resumen técnico corto indicando:
endpoints usados
cómo se protege la edición
cómo se conecta con el catálogo global
19. Resultado esperado

El usuario debe poder:

consultar el catálogo ISLR
entender cómo se calculan las retenciones
identificar conceptos usados en pagos
ganar confianza en el sistema
20. Fuera de alcance

No implementar:

edición desde cliente
personalización por empresa
duplicación de catálogo
lógica de cálculo en frontend