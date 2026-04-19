# 04b_empresa_activa_en_sesion.md

# 1. Objetivo

Implementar el manejo de **empresa activa en sesión** dentro de RetenSaaS, para que el sistema pueda trabajar con una empresa seleccionada por defecto dentro del tenant autenticado, mejorando:

- experiencia de usuario
- consistencia operativa
- simplificación de queries
- navegación multiempresa
- contexto fiscal y operativo

Este paso no elimina el modelo multiempresa, sino que agrega una capa de contexto activo para operar de forma más cómoda y segura.

---

# 2. Problema actual

El sistema ya soporta múltiples empresas dentro de un mismo tenant, lo cual es correcto para:

- contadores
- firmas contables
- grupos empresariales
- usuarios que administran varias empresas

Sin embargo, actualmente muchas operaciones requieren pasar `empresaId` manualmente o inferirlo desde la UI, lo que genera:

- fricción en formularios
- riesgo de inconsistencias
- lógica repetida
- mala experiencia si el tenant tiene varias empresas

---

# 3. Objetivo funcional

El sistema debe poder manejar una **empresa activa** por usuario/sesión, de modo que:

- si el tenant tiene una sola empresa, se seleccione automáticamente
- si el tenant tiene varias empresas, el usuario pueda elegir una
- la mayoría de módulos operen sobre esa empresa activa por defecto
- el contexto visible del sistema indique claramente qué empresa está activa
- el cambio de empresa actualice la experiencia del dashboard y módulos

---

# 4. Decisión de diseño

## 4.1 Qué NO es empresa activa
La empresa activa:
- NO sustituye el tenant
- NO cambia la propiedad de los datos
- NO rompe el modelo multiempresa
- NO elimina `empresaId` de los registros fiscales

## 4.2 Qué SÍ es empresa activa
La empresa activa es un **contexto operativo por sesión** que sirve para:

- filtrar vistas
- precargar formularios
- elegir la empresa por defecto
- mostrar el nombre de la empresa actual
- simplificar acciones del usuario

---

# 5. Estrategia recomendada

Implementar la empresa activa inicialmente en la **sesión del usuario**.

Opciones técnicas posibles:

## Opción A (recomendada para esta fase)
Guardar `empresaActivaId` en la sesión JWT / NextAuth session.

## Opción B
Guardar `empresaActivaId` en cookie independiente.

## Opción C
Persistir preferencia en DB por usuario.

### Decisión para este paso
Implementar **Opción A** primero:
- simple
- consistente con tu auth actual
- suficiente para esta etapa

Si luego quieres persistencia más duradera entre dispositivos, podrás evolucionar a DB.

---

# 6. Alcance del paso

Este paso debe incluir:

1. agregar `empresaActivaId` a la sesión
2. helper server-side para obtener empresa activa
3. acción para cambiar empresa activa
4. integración visual en dashboard/header
5. lógica automática si el tenant tiene una sola empresa
6. fallback seguro si la empresa activa ya no existe o no pertenece al tenant
7. actualización de módulos para usar empresa activa por defecto donde tenga sentido

No implementar todavía:

- preferencias multi-dispositivo persistidas en DB
- selector complejo con buscador avanzado
- permisos por empresa ultra granulares
- multiempresa simultánea en pestañas dentro del mismo dashboard

---

# 7. Reglas funcionales

## 7.1 Tenant con una sola empresa
Si el tenant autenticado tiene una sola empresa activa:

- establecerla automáticamente como empresa activa
- no exigir selección manual
- permitir ocultar o simplificar el selector en UI si se desea

## 7.2 Tenant con varias empresas
Si el tenant tiene varias empresas:

- mostrar selector de empresa activa
- permitir cambio explícito
- reflejar la empresa activa en el header o zona visible del sistema

## 7.3 Empresa activa inválida
Si la `empresaActivaId` en sesión:
- no existe
- no pertenece al tenant
- está eliminada lógicamente

Entonces el sistema debe:
- seleccionar la primera empresa válida del tenant, si existe
- o dejar contexto vacío controlado si no existe ninguna

---

# 8. Cambios técnicos requeridos

## 8.1 Auth / Session
Extender la sesión para incluir:

- `empresaActivaId`

Esto debe vivir junto con:
- userId
- tenantId
- email
- name

## 8.2 Helpers server-side
Crear o actualizar helpers como:

- `getEmpresaActivaId()`
- `getEmpresaActiva()`
- `requireEmpresaActiva()`

### Recomendación
`requireEmpresaActiva()` debe:
- obtener tenantId desde sesión
- cargar empresa activa válida
- hacer fallback automático si aplica
- lanzar error claro si el tenant no tiene empresas

## 8.3 Acción para cambiar empresa activa
Crear action tipo:

- `setEmpresaActivaAction(empresaId)`

Debe:
1. obtener tenantId del usuario autenticado
2. validar que la empresa pertenece al tenant
3. actualizar la sesión o mecanismo escogido
4. refrescar UI / rutas relevantes

---

# 9. UI requerida

## 9.1 Selector de empresa activa
Agregar en el dashboard/header un selector visible si el tenant tiene múltiples empresas.

Opciones aceptables:
- select simple
- dropdown
- menú compacto

Debe mostrar:
- nombre fiscal
- opcionalmente RIF

## 9.2 Header
Mostrar claramente:
- organización / tenant
- empresa activa
- usuario autenticado

## 9.3 Dashboard
La landing del dashboard debe reflejar:
- empresa activa actual
- o estado multiempresa si aún no se seleccionó

---

# 10. Integración con módulos existentes

Actualizar el comportamiento de módulos ya implementados para usar empresa activa por defecto cuando tenga sentido.

## 10.1 Compras
- al crear compra, precargar empresa activa
- al listar, filtrar por empresa activa por defecto si esa es la UX elegida

## 10.2 Proveedores
- listar proveedores de la empresa activa por defecto
- o permitir ver todos con filtro preseleccionado en empresa activa

## 10.3 Pagos
- usar empresa activa como contexto inicial

## 10.4 Períodos fiscales
- mostrar períodos de la empresa activa por defecto

## 10.5 Retenciones / Comprobantes / Exportaciones
- usar empresa activa como filtro por defecto

### Importante
No eliminar la posibilidad de trabajar con otra empresa.
Solo establecer un contexto inicial más inteligente.

---

# 11. Estrategia de filtro recomendada

Para esta fase:

## Listados
Usar empresa activa como filtro por defecto.

## Formularios
Usar empresa activa como valor inicial.

## Cambios manuales
Si un formulario necesita cambiar empresa, permitirlo solo si el usuario tiene varias empresas y la UX lo justifica.

---

# 12. Seguridad y validación

## 12.1 No confiar ciegamente en la sesión
Aunque exista `empresaActivaId` en sesión, siempre validar que:
- pertenece al tenant
- no está eliminada

## 12.2 No usar empresa activa como sustituto de seguridad
La seguridad sigue dependiendo de:
- auth
- tenantId
- validaciones en DB

La empresa activa es contexto de conveniencia, no una barrera de seguridad por sí sola.

---

# 13. Ajustes recomendados en tipos

Actualizar tipos de sesión/NextAuth para incluir:

- `empresaActivaId?: string | null`

Mantener tipado fuerte y consistente.

---

# 14. Flujo esperado del usuario

## Caso A: empresa única
1. usuario inicia sesión
2. sistema detecta una sola empresa
3. la asigna automáticamente como activa
4. el usuario entra directo a operar

## Caso B: varias empresas
1. usuario inicia sesión
2. sistema detecta varias empresas
3. asigna una por defecto o usa la previa si existe
4. usuario puede cambiar desde el selector
5. módulos reflejan la nueva empresa activa

---

# 15. Requisitos técnicos

Cursor debe:

1. revisar la implementación actual de auth/session
2. extender sesión con `empresaActivaId`
3. crear helpers server-side
4. crear action para cambiar empresa activa
5. integrar selector en header/dashboard
6. ajustar módulos clave para usar empresa activa por defecto
7. dejar resumen técnico corto con:
   - cómo se guardó empresa activa
   - cómo se hace el fallback
   - qué módulos ya la usan
   - qué queda pendiente si luego se quiere persistir en DB

---

# 16. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

- operar con una empresa activa clara dentro del tenant
- cambiar de empresa activa cuando haya varias
- simplificar la experiencia multiempresa
- mejorar formularios y listados
- mantener intacta la arquitectura multiempresa

---

# 17. Fuera de alcance

No implementar todavía:

- persistencia de empresa activa por usuario en DB
- multiempresa abierta simultáneamente en paralelo
- reglas avanzadas de permisos por empresa
- dashboards comparativos entre empresas

---

# 18. Próximo paso sugerido

Después de esto, se podrá decidir mejor si:

- continuar con `17_modulo_sucursales_retenciones.md`
- o seguir profundizando ISLR y demás flujos operativos

porque ya la base multiempresa quedará mucho más usable.

