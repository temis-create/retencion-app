# Análisis: skill-taste-diseno → Aplicabilidad en saas-temis

## Estado actual del proyecto

| Elemento | Actual |
|----------|--------|
| Fuentes | Inter + Geist Mono |
| Tailwind | v4 (@tailwindcss/postcss) |
| Iconos | lucide-react |
| Animaciones | CSS básico (scale, translateY en hover) |
| Design system | Variables CSS (primary verde, zinc/slate) |
| Componentes | shadcn/ui (Card, Table, Button, etc.) |

---

## ✅ APLICABLES SIN RIESGO (sin nuevas dependencias)

### 1. Viewport y layout
- **`min-h-[100dvh]` en lugar de `h-screen`** para secciones full-height → evita saltos en iOS Safari.
- **Contenedores de página**: `max-w-7xl mx-auto` o `max-w-[1400px]` para evitar contenido demasiado ancho.
- **Grid en lugar de flex con cálculos**: preferir `grid grid-cols-1 md:grid-cols-3 gap-6` frente a `w-[calc(33%-1rem)]`.

### 2. Colores y contraste
- **Evitar negro puro**: usar `zinc-950` o `slate-900` en lugar de `#000`.
- **Un solo acento**: ya se cumple (verde primary).
- **Sin púrpura/neón**: ya se cumple.

### 3. Formularios
- **Label encima del input** (no inline).
- **`gap-2`** en bloques de input.
- **Texto de error debajo del input**.

### 4. Estados de UI
- **Loading**: skeletons en lugar de spinners genéricos.
- **Empty states**: mensajes claros cuando no hay datos.
- **Error states**: mensajes inline en formularios.
- **Feedback táctil**: `active:scale-[0.98]` o `active:-translate-y-[1px]` en botones.

### 5. Rendimiento
- **Animaciones solo con `transform` y `opacity`** (no `top`, `left`, `width`, `height`).
- **Uso moderado de z-index**: solo para capas definidas (nav, modales, overlays).

### 6. Contenido
- **Anti-emoji**: no usar emojis en código ni contenido.
- **Nombres realistas**: evitar "John Doe", "Acme", etc. en datos de ejemplo.

---

## ⚠️ APLICABLES CON PRECAUCIÓN

### 1. Tipografía
- **Skill**: prohibir Inter, usar Geist/Outfit/Satoshi.
- **Proyecto**: usa Inter + Geist Mono.
- **Recomendación**: mantener Inter por consistencia. Si se quiere cambiar, usar Geist Sans (ya se usa Geist Mono) para mantener coherencia.

### 2. Cards y densidad
- **Skill**: evitar cards cuando la densidad es alta; usar `border-t`, `divide-y`.
- **Proyecto**: usa Card en muchas vistas.
- **Recomendación**: aplicar solo en vistas muy densas (tablas grandes, dashboards con muchas métricas). No cambiar todas las Cards de golpe.

### 3. Sombras
- **Skill**: sombras con tinte al color de fondo.
- **Proyecto**: ya usa `shadow-primary-30` en botones.
- **Recomendación**: extender este patrón a otros elementos que necesiten elevación.

---

## ❌ NO APLICAR (requieren cambios grandes o nuevas deps)

| Elemento | Motivo |
|-----------|--------|
| Phosphor/Radix icons | Proyecto usa lucide-react; migrar implicaría cambiar muchos archivos. |
| Framer Motion | No está instalado; añadirlo y usarlo en toda la UI sería un cambio grande. |
| Magnetic buttons, Liquid Glass | Dependen de Framer Motion. |
| Bento grid, Masonry, etc. | Requieren Framer Motion o GSAP. |
| Cambio de Inter a Geist | Cambio visual notable; solo si se busca un rediseño. |

---

## Resumen de acciones recomendadas

### Prioridad alta (impacto bajo, beneficio claro)
1. Reemplazar `h-screen` por `min-h-[100dvh]` donde exista.
2. Añadir `max-w-7xl mx-auto` a layouts de página donde falte.
3. Añadir `active:scale-[0.98]` a botones principales.
4. Revisar que formularios tengan label encima, `gap-2` y mensajes de error debajo.

### Prioridad media
5. Revisar empty states en listados (plantillas, turnos, trabajadores).
6. Sustituir spinners genéricos por skeletons donde tenga sentido.
7. Evitar `#000`; usar `zinc-950` o equivalentes.

### Prioridad baja
8. Valorar cambio Inter → Geist Sans solo si se planea un rediseño.
9. Reducir uso de Cards en vistas muy densas.

---

## Conclusión

El skill aporta buenas prácticas de diseño y rendimiento. Las más útiles para saas-temis son las que no dependen de nuevas librerías: viewport, layout, formularios, estados de UI y animaciones CSS. Mantener lucide-react, Inter y la estructura actual de componentes evita romper lo ya construido.
