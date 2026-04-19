# 04b_fix_email_multitenant.md

# 1. Objetivo

Corregir el modelo de autenticación para eliminar la restricción de email único global y adaptar el sistema a un enfoque multitenant real.

Esto implica:

- permitir el mismo email en diferentes organizaciones (tenants)
- ajustar el schema de Prisma
- adaptar la lógica de autenticación (NextAuth)
- mantener compatibilidad con el MVP actual
- evitar romper el flujo existente

---

# 2. Problema actual

Actualmente el modelo `Usuario` tiene:

```prisma
email String @unique

Esto genera:

imposibilidad de reutilizar emails en distintos tenants
limitación del modelo SaaS
problemas futuros con usuarios compartidos entre organizaciones
3. Decisión arquitectónica

Se adopta el siguiente enfoque:

eliminar la unicidad global del email
definir unicidad compuesta por tenant

Resultado esperado:

@@unique([tenantId, email])
4. Ajuste en schema.prisma
4.1 Modificar modelo Usuario

Actualizar el modelo Usuario:

ANTES:

email String @unique

DESPUÉS:

email String

@@unique([tenantId, email])

Requisitos:

eliminar completamente @unique del campo email
agregar constraint compuesta al final del modelo
no modificar otros campos innecesariamente
5. Migración de base de datos

Generar nueva migración:

npx prisma migrate dev --name fix_usuario_email_multitenant

Verificar que:

se elimina el índice único global
se crea índice compuesto (tenantId, email)
6. Ajuste en autenticación (NextAuth)
6.1 Problema

Actualmente el login probablemente hace:

where: { email }

Esto ya no es válido.

6.2 Nueva lógica requerida

Implementar flujo:

Buscar usuarios por email:
const users = await prisma.usuario.findMany({
  where: { email }
})
Evaluar resultados:
Caso 1: 0 usuarios
lanzar error: "Usuario no encontrado"
Caso 2: 1 usuario
usar ese usuario directamente
continuar validación de password
Caso 3: múltiples usuarios
para el MVP:
lanzar error controlado:
Este usuario pertenece a múltiples organizaciones. Selección de organización no implementada aún.

(NO implementar selector todavía)

6.3 Validación de contraseña

Mantener:

bcrypt compare
validación de usuario activo
6.4 Session / JWT

Asegurar que en sesión se incluya:

user.id
user.tenantId
user.email
user.name

No cambiar estructura existente salvo que sea necesario.

7. Seed inicial

Revisar prisma/seed.ts y asegurar:

el usuario admin tiene tenantId correcto
no se crean duplicados innecesarios

Si ya existe un usuario con ese email en ese tenant, evitar duplicarlo.

8. Middleware y helpers

No deben requerir cambios si:

usan tenantId desde la sesión
no dependen de unicidad global del email

Verificar:

getCurrentUser
getTenantId
requireAuth
9. Validación funcional

Después del cambio:

login debe funcionar correctamente
sesión debe contener tenantId
middleware debe seguir protegiendo rutas
queries deben seguir filtrando por tenantId
10. Buenas prácticas reforzadas
nunca hacer consultas por email sin tenant en lógica interna crítica
usar siempre tenantId en queries de negocio
mantener consistencia multitenant en todos los módulos
11. Resultado esperado

Al finalizar este ajuste:

el sistema permite el mismo email en distintos tenants
el login sigue funcionando para el MVP
el modelo queda preparado para:
selector de organización
subdominios
RBAC avanzado
12. Nota para fases futuras

En futuras fases se deberá implementar:

selector de organización en login (cuando haya múltiples tenants)
soporte para subdominios por empresa
manejo de múltiples sesiones por usuario
13. Entregable requerido

Cursor debe:

actualizar schema.prisma
generar migración
ajustar lógica de autenticación
validar funcionamiento
documentar brevemente los cambios realizados