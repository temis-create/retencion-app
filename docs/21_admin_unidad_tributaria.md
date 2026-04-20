# 21_admin_unidad_tributaria.md

# 1. Objetivo

Implementar la gestión administrativa de la **Unidad Tributaria (UT)** en RetenSaaS, permitiendo:

- definir valores de UT por vigencia
- mantener historial de cambios
- garantizar que el motor ISLR utilice la UT correcta según fecha
- mostrar la UT vigente en el sistema para el usuario final

Este módulo es crítico para mantener la precisión normativa del sistema.

---

# 2. Principio clave

❗ La UT NO debe ser un valor único editable.

Debe manejarse como:

```txt
Unidad Tributaria = valor con vigencia en el tiempo

3. Alcance del paso

Este módulo debe incluir:

modelo de Unidad Tributaria con vigencias
CRUD desde admin SaaS
validación de vigencias sin solapamientos
determinación automática de UT vigente por fecha
integración con motor ISLR
visualización de UT vigente en el sistema
uso de snapshot en retenciones

No implementar todavía:

sincronización automática con fuentes oficiales
múltiples tipos de UT
historiales complejos por país
4. Modelo de datos

Crear modelo:

UnidadTributaria

Campos:

id
valor (decimal)
fechaInicio
fechaFin (nullable)
descripcion (ej: "UT vigente 2025")
activo
createdAt
updatedAt
5. Reglas de negocio
5.1 Vigencia única por fecha

No puede existir solapamiento:

❌ Incorrecto:

UT A: 01/01/2025 - null
UT B: 01/06/2025 - null
Debe ser:

✔ Correcto:

UT A: 01/01/2025 - 31/05/2025
UT B: 01/06/2025 - null
5.2 Una sola UT vigente

En cualquier fecha, solo puede haber una UT válida.

5.3 No eliminar históricos

No se deben eliminar UT usadas en cálculos históricos.

6. Determinación de UT vigente

Crear helper:

getUnidadTributariaByFecha(fecha: Date): UnidadTributaria

Debe:

buscar UT donde:
fechaInicio <= fecha
fechaFin null o >= fecha
devolver UT correcta
7. Integración con motor ISLR

El motor ISLR debe:

obtener UT según fecha del pago
usar ese valor para:
Tarifa 2
validaciones por UT
guardar snapshot
En RetencionISLR:
valorUTSnapshot
8. Administración en SaaS
Ruta sugerida
/dashboard-admin/unidad-tributaria
8.1 Listado

Mostrar:

valor UT
fecha inicio
fecha fin
estado (vigente / histórico)
descripción
8.2 Crear UT

Formulario:

valor
fecha inicio
fecha fin (opcional)
descripción
8.3 Editar UT

Permitir:

modificar fechaFin
modificar descripción

⚠️ No permitir cambios que rompan historial ya usado

8.4 Activar nueva UT

Al crear nueva UT:

cerrar automáticamente la anterior (set fechaFin)
validar que no haya conflictos
9. Validaciones
9.1 Fecha inicio obligatoria
9.2 Valor UT > 0
9.3 No solapamiento de fechas
9.4 No permitir múltiples UT activas sin rango definido
10. Visualización en el sistema
10.1 Mostrar UT vigente

Opciones:

A. Dashboard fiscal
UT vigente: Bs. 43,00
B. Módulo ISLR

Mostrar en:

cálculo
catálogo
10.2 Mostrar UT en cálculos

Ejemplo:

UT usada: Bs. 43,00
11. UX recomendada

Mostrar información clara:

La Unidad Tributaria (UT) es utilizada para calcular retenciones ISLR según normativa vigente.
12. Arquitectura técnica
src/modules/admin-saas/unidad-tributaria/
  ui/
    ut-table.tsx
    ut-form.tsx
  server/
    ut.service.ts
    ut.repository.ts
    ut.schema.ts
13. Server logic

Crear:

getUTVigente()
getUTByFecha(fecha)
createUT(data)
updateUT(id, data)
14. Seguridad
solo admin SaaS puede modificar UT
clientes solo pueden visualizar
15. Integración con otros módulos
ISLR
obligatorio
IVA
opcional futuro
Reportes
recomendable
16. Snapshot obligatorio

Toda retención ISLR debe guardar:

valorUTSnapshot

Esto garantiza:

trazabilidad
auditoría
consistencia histórica
17. Entregables requeridos

Cursor debe dejar implementado:

modelo UnidadTributaria
CRUD admin SaaS
validaciones de vigencia
helper getUTByFecha
integración con motor ISLR
snapshot en retenciones
visualización en UI
resumen técnico corto
18. Resultado esperado

El sistema debe:

usar UT correcta según fecha
mantener historial
permitir cambios futuros sin romper datos
mostrar UT al usuario
19. Errores críticos a evitar

❌ UT fija en código
❌ múltiples UT vigentes
❌ cambiar UT histórica usada
❌ no guardar snapshot