# 03_bootstrap_nextjs_prisma_retenciones.md

# 1. Objetivo

Inicializar la base técnica del proyecto SaaS de retenciones usando:

- Next.js (App Router)
- Prisma ORM
- PostgreSQL (Neon)
- TypeScript
- Tailwind CSS
- Estructura escalable tipo SaaS

Este paso deja el proyecto listo para comenzar a desarrollar módulos funcionales.

---

# 2. Crear proyecto Next.js

Ejecutar:

```bash
npx create-next-app@latest reten-saas

Seleccionar:

TypeScript: YES
ESLint: YES
Tailwind: YES
App Router: YES
src/ directory: YES
Import alias: YES (@/*)
3. Instalar dependencias

7. Crear instancia global de Prisma Client

Crear archivo:

src/lib/prisma.ts

Contenido:

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
8. Estructura base del proyecto

Crear estructura:

src/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│
├── lib/
│   ├── prisma.ts
│
├── modules/
│   ├── auth/
│   ├── empresa/
│   ├── proveedores/
│   ├── compras/
│   ├── pagos/
│   ├── retenciones/
│   ├── fiscal/
│
├── server/
│   ├── db/
│   ├── services/
│   ├── repositories/
│
├── types/
│
├── utils/
9. Configurar layout base

Editar:

src/app/layout.tsx

Ejemplo mínimo:

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
10. Probar conexión con base de datos

Editar:

src/app/page.tsx

Ejemplo:

import { prisma } from '@/lib/prisma'

export default async function Home() {
  const empresas = await prisma.empresa.findMany()

  return (
    <div>
      <h1>RetenSaaS</h1>
      <pre>{JSON.stringify(empresas, null, 2)}</pre>
    </div>
  )
}
11. Ejecutar proyecto
npm run dev

Abrir:

http://localhost:3000
12. Verificación de funcionamiento

Checklist:

 Prisma conecta correctamente
 No hay errores en consola
 Página carga correctamente
 Query a DB funciona
 Migración aplicada
13. Buenas prácticas desde el inicio
No usar Prisma en el cliente (solo server)
Centralizar acceso en lib/prisma.ts
Usar módulos (modules/) por dominio
Separar lógica en:
services
repositories
Mantener multi-tenant desde el inicio