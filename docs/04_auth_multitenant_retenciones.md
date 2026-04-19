# 04_auth_multitenant_retenciones.md

# 1. Objetivo

Implementar la base de autenticación y multitenancy de RetenSaaS, asegurando que:

- los usuarios puedan iniciar sesión
- cada usuario pertenezca a una organización (tenant)
- el sistema identifique el tenant activo en cada request
- la aplicación quede preparada para permisos por empresa y por rol
- ninguna consulta operativa pueda escapar del aislamiento lógico por tenant

Este paso no busca todavía un RBAC avanzado completo, pero sí dejar la columna vertebral correcta para autenticación, sesión y aislamiento de datos.

---

# 2. Decisión de implementación

Usar:

- **NextAuth/Auth.js** para autenticación
- **Credentials Provider** para login con email + password
- **bcrypt** para hash de contraseñas
- sesiones con estrategia **JWT**
- Prisma como fuente de usuarios

No implementar todavía:
- OAuth social
- recuperación de contraseña
- MFA
- invitaciones por correo
- auditoría avanzada de login más allá de lo mínimo

---

# 3. Dependencias a instalar

Instalar:

```bash
npm install next-auth bcrypt
npm install -D @types/bcrypt

Si la versión de NextAuth/Auth.js exige paquete distinto según el setup actual, usa la versión compatible más estable con Next.js App Router y documenta la decisión.

4. Variables de entorno requeridas

Agregar en .env:

AUTH_SECRET="generar_un_secret_seguro"
AUTH_URL="http://localhost:3000"

Si en tu setup corresponde NEXTAUTH_SECRET y NEXTAUTH_URL, usa esos nombres y documenta la decisión en el archivo.

5. Alcance funcional del paso

Este paso debe implementar:

Modelo mínimo de autenticación usando la tabla Usuario
Validación de credenciales contra Prisma
Password hash con bcrypt
Sesión persistida
Inclusión de tenantId en la sesión
Inclusión opcional de empresa activa si aplica
Middleware o mecanismo equivalente para proteger rutas privadas
Helpers server-side para obtener:
usuario autenticado
tenant actual
empresa activa si existe
Seeder inicial para crear:
una organización
una empresa
un usuario administrador
una asignación de rol administrativa básica
6. Revisión previa del schema

Antes de implementar, analiza el schema.prisma actual y valida si hacen falta campos mínimos para auth en el modelo Usuario.

Verifica especialmente si existen o deben existir:

email
passwordHash
activo
tenantId
timestamps

Si falta algo imprescindible para auth con credenciales, documéntalo y ajusta el schema de forma mínima y controlada.

No rediseñes el dominio. Solo ajustes estrictamente necesarios para auth.

7. Archivos y estructura sugerida

Crear y/o ajustar archivos equivalentes a esta estructura:

src/
  app/
    (auth)/
      login/
        page.tsx
    api/
      auth/
        [...nextauth]/
          route.ts

  modules/
    auth/
      server/
        auth.config.ts
        auth.ts
        permissions.ts
      ui/
        login-form.tsx
      actions/
        login.ts

  lib/
    auth.ts
    prisma.ts

  server/
    services/
      auth.service.ts
      tenant.service.ts

Puedes adaptar la ubicación final si tu criterio técnico es mejor, pero mantén separación clara entre UI, config y lógica.

8. Implementación requerida
8.1 Configuración de Auth

Implementa la configuración de autenticación con Credentials Provider:

buscar usuario por email
validar que esté activo
comparar password con bcrypt
devolver en sesión:
userId
tenantId
nombre
email
8.2 JWT / Session callbacks

Asegura que el token y la sesión contengan como mínimo:

user.id
user.tenantId
user.email
user.name

Si se maneja empresa activa desde el inicio, incluir:

empresaActivaId
8.3 Página de login

Crear una página /login funcional con:

email
password
submit
feedback de error
redirección tras login exitoso

No gastar tiempo todavía en diseño avanzado. Debe ser limpio, usable y funcional.

8.4 Protección de rutas

Definir mecanismo para proteger rutas privadas, por ejemplo:

dashboard
módulos internos

Puede ser mediante middleware, wrappers server-side o validación en layout privado.

Debe quedar claro qué enfoque se eligió y por qué.

8.5 Contexto multitenant

Crear helpers server-side reutilizables para obtener:

usuario autenticado
tenant actual
empresa activa

Y documentar que toda consulta operativa futura debe filtrar por tenantId.

9. Seeder inicial obligatorio

Crear un seed inicial que inserte:

Organizacion
Empresa
Usuario admin con password hasheado
Rol administrativo base
AsignacionRol

Datos sugeridos:

Organización: RetenSaaS Demo
Empresa: RetenSaaS Demo, C.A.
Usuario: admin@retensaas.com
Password temporal: Admin123456*

La password debe guardarse con bcrypt.
Documenta claramente que luego debe cambiarse.

Si ya existe data, el seed debe ser idempotente o al menos defensivo para no duplicar registros críticos.

10. Reglas técnicas obligatorias
Nunca exponer Prisma en client components
No hacer consultas sin tenantId en módulos privados
No guardar passwords en texto plano
No mezclar lógica de auth con UI
Mantener separación entre autenticación y autorización
Dejar preparado el terreno para RBAC por empresa
11. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

iniciar sesión con un usuario real almacenado en PostgreSQL
recuperar sesión activa en el servidor
conocer el tenant del usuario autenticado
proteger rutas privadas
tener un admin funcional inicial
quedar listo para construir dashboard y módulos internos
12. Entregables requeridos

Cursor debe dejar implementado y documentado:

configuración auth funcionando
login funcional
helpers de sesión y tenant
protección de rutas privadas
seed inicial
cualquier ajuste mínimo de schema si fue necesario
breve documento/resumen técnico indicando:
qué se implementó
qué decisiones tomó
qué quedó pendiente para RBAC avanzado
13. Fuera de alcance de este paso

No implementar todavía:

gestión completa de usuarios desde UI
pantalla de registro público
invitaciones
reset de contraseña
MFA
permisos granulares por pantalla
selector visual de empresa activa
auditoría completa de accesos