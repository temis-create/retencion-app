# Patrón de Arquitectura CRUD Módulos (RetenSaaS)

Este documento establece el patrón estándar, verificado y exitoso, para la creación de cualquier CRUD administrativo dentro de RetenSaaS. Todo nuevo módulo (Proveedores, Compras, Pagos, etc.) debe adherirse a esta convención para garantizar seguridad, accesibilidad, validaciones mixtas (Cliente/Servidor) y consistencia bajo el modelo *Next.js App Router Server-First*.

## 1. Estructura de Directorios del Módulo

El código funcional reside en `src/modules/[nombre-modulo]/` separado en tres capas:

```txt
src/modules/[modulo]/
├── actions/
│   └── [modulo]-actions.ts     # Server Actions (Zod re-validation, lógica try/catch)
├── server/
│   ├── [modulo].schema.ts      # Esquemas de validación Zod inferidos a Types
│   └── [modulo].service.ts     # Primitivas con Prisma (Data Access Layer + Tenant filter)
└── ui/
    ├── [modulo]-table.tsx      # Presentación en formato tabla con "Empty States"
    ├── [modulo]-form.tsx       # Componente Cliente react-hook-form + Zod Resolver
    └── [modulo]-detail.tsx     # Vista Server-Side exclusiva de modo lectura
```

## 2. Enrutamiento (Pages)

Las interfaces interactuarán en `src/app/(app)/[modulos]/` con el siguiente ruteo por defecto:

- `/`: (`page.tsx`) Listado asíncrono. Obtiene datos mediante Service y pasa props a la Tabla UI. Requiere Invocación explícita a la variable sesión `tenantId`.
- `/nueva`: (`page.tsx`) Retorna el UI Form sin prop `initialData`.
- `/[id]`: (`page.tsx`) Vista Detalle, recupera Server-side por ID y TenantID, arrojando `notFound()` si incumple.
- `/[id]/editar`: (`page.tsx`) Vista del formulario cargado con la prop `initialData`.

## 3. Políticas Obligatorias

1. **Aislamiento Multitenant Firme**: Ninguna consulta puede asomarse fuera de su `tenantId`. En mutaciones (`update`/`delete`), usar `findFirst({ where: { id, tenantId, deletedAt: null } })` como paso previo de autorización — incluyendo siempre `deletedAt: null` para respetar el soft-delete del sistema. Actualizar luego usando solo el `id` único en el `where` de Prisma.
2. **Double Validation**: El formulario frontend implementa validación con React Hook Form + Zod, previendo feedback instantáneo (Client-Side). El Server Action debe volver a validar empleando exactamente el mismo Zod Schema mediante `schema.safeParse` (Server-Side).
3. **Manejo Libre de Excepciones**: Los Server Actions retornan objetos serializables del formato `{ success: boolean, data?: any, error?: string }` en vez de realizar throws directos capturados fuera de contexto en React-Client.
4. **Mutación y Refresco UI**: Luego de un Create/Update exitoso, se invalida caché con rutas **explícitas y concretas** — nunca usar el scope genérico `"layout"`. Para un create: `revalidatePath("/[modulo]")`. Para un update: `revalidatePath("/[modulo]")` + `revalidatePath("/[modulo]/[id]")` + `revalidatePath("/[modulo]/[id]/editar")`.

## 4. Estándares Técnicos Continuos

- **Tipado Estricto UI**: Está prohibido el uso de la deuda técnica `any` en los componentes (Tablas, Detalles). Si la vista cruza varias tablas incrustando colecciones (`include: { ... }`), genera un Type local a mano o utiliza los genéricos exportados por Prisma (`import { Tipo } from "@prisma/client"`).
- **Sanitización Pre-Save (Backend)**: Toda clave nominal foránea que amerite unicidad, como identificaciones o RIFs, se convertirá o normalizará asertivamente (`.trim().toUpperCase()`) EN EL SERVIDOR antes de interactuar con Prisma, previniendo duplicados "falsos" silenciados por espacios en las acciones del cliente.
- **Fail-Safe Authenticator**: El getter base `getTenantId()` lanza textualmente la premisa de error `"Unauthorized"`. Los handlers o bounds deben atraparlo siempre como capa de seguridad impenetrable para cualquier acción o query de un visitante sin un Tenant asignado.

Mantener este paradigma asegura el estado predecible, seguro y escalable de este SaaS en todo momento.
