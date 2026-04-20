# fase_comercial_mvp_landing_y_acceso.md

# 1. Objetivo

Implementar una **landing comercial MVP + capa de acceso** en RetenSaaS que permita:

- presentar el producto públicamente
- comunicar valor de forma clara
- dirigir a login
- habilitar captación de interesados (manual por ahora)
- separar correctamente app vs sitio público

Este paso convierte el sistema en un producto demostrable.

---

# 2. Arquitectura de rutas

Definir claramente:

```txt
/ → Landing pública
/login → Acceso al sistema
/dashboard → Aplicación interna

Regla clave
/ NO debe requerir autenticación
/dashboard SI debe requerir autenticación
3. Estructura en Next.js (App Router)

Crear:

src/app/page.tsx            → Landing
src/app/(auth)/login/page.tsx
src/app/(app)/dashboard/page.tsx

Si ya tienes (app) y (auth), solo agregar la landing.

4. Landing MVP (estructura obligatoria)

NO sobre diseñar. Debe ser simple, clara y funcional.

4.1 Hero (primera pantalla)
Título:
Sistema de Retenciones IVA e ISLR automatizado en Venezuela
Subtítulo:
Calcula, gestiona y genera comprobantes fiscales sin errores, listo para uso real en empresas y contadores.
Botones:
Iniciar sesión
Solicitar demo
4.2 Problema
Las retenciones fiscales son complejas, propensas a errores y consumen tiempo operativo.
Errores en cálculos o comprobantes pueden generar sanciones y reprocesos.
4.3 Solución
RetenSaaS automatiza el cálculo de retenciones de IVA e ISLR, generando comprobantes y exportaciones listas para uso fiscal.
4.4 Beneficios

Mostrar 3–5 bullets:

✔ Cálculo automático de IVA e ISLR
✔ Generación de comprobantes fiscales
✔ Exportación lista para declaraciones
✔ Multiempresa y multiusuario
✔ Reducción de errores humanos
4.5 Flujo del sistema
Registro de compras → Pagos → Retenciones → Comprobantes → Exportación
4.6 CTA (Call to action)
¿Quieres ver el sistema en funcionamiento?

Solicita una demo personalizada.

Botón:

Solicitar demo
4.7 Footer simple
nombre del producto
contacto (email o WhatsApp)
año
5. UI mínima recomendada

Usar:

Tailwind
shadcn/ui (si ya lo tienes)

Evitar:

animaciones pesadas
componentes complejos
6. Botones funcionales
6.1 Iniciar sesión

Debe redirigir a:

/login
6.2 Solicitar demo

Opciones MVP:

Opción 1 (rápida)

Abrir WhatsApp:

https://wa.me/584145202075
Opción 2

Abrir mail:

mailto:tuemail@dominio.com
7. Separación visual App vs Landing

La landing NO debe verse como el dashboard.

Landing:
centrada
limpia
sin sidebar
App:
sidebar
navegación interna
8. Middleware (importante)

Asegúrate de:

Permitir acceso público a:
/
 /login
Proteger:
/dashboard
9. SEO básico

En la landing agregar:

<title>
<meta description>

Ejemplo:

Sistema de retenciones IVA e ISLR en Venezuela. Automatiza cálculos, comprobantes y exportaciones fiscales.
10. Mensaje clave de producto

Debe quedar claro:

👉 No es un sistema contable completo
👉 Es un sistema especializado en retenciones

11. Qué NO hacer en esta fase

No implementar:

registro automático de usuarios
pagos online
planes SaaS
onboarding automático
blog
landing compleja
12. Integración con el sistema

Desde la landing:

solo acceso a login
no exponer rutas internas
13. Seguridad

No exponer:

endpoints internos
datos del sistema
rutas privadas
14. Entregables requeridos

Cursor debe dejar implementado:

página / funcional
diseño limpio de landing
botones funcionales
integración con login
SEO básico
middleware correcto
separación clara entre app y landing
resumen técnico corto
15. Resultado esperado

El sistema debe:

tener URL pública usable
mostrar valor del producto en segundos
permitir acceso al sistema
permitir contacto para demo