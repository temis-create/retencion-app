# 11b_modulo_emision_comprobante_iva.md

# 1. Objetivo

Implementar el flujo formal de **emisión de Comprobante IVA** en RetenSaaS, para convertir una o varias retenciones IVA calculadas en un documento fiscal oficial emitido, con número correlativo válido, estado definitivo y capacidad posterior de:

- impresión
- PDF
- exportación TXT
- bloqueo de recálculo

Este paso debe cerrar el vacío actual entre:
- `RetencionIVA calculada`
y
- `ComprobanteIVA emitido`

---

# 2. Problema actual

El sistema ya puede:

- registrar compras
- calcular retenciones IVA
- guardar `RetencionIVA`
- diseñar formato de impresión/PDF

Pero todavía no tiene un flujo funcional y visible para:

- **emitir** el comprobante legal
- asignarle correlativo
- vincular retenciones a ese comprobante
- navegar a ese comprobante emitido

Por tanto, hoy la impresión no aparece porque legalmente todavía no existe el documento fiscal emitido.

---

# 3. Alcance del paso

Este módulo debe incluir:

1. acción de emisión de comprobante IVA
2. creación real de `ComprobanteIVA`
3. asignación de correlativo legal `AAAAMMSSSSSSSS`
4. vinculación de una o varias `RetencionIVA`
5. cambio de estado final de las retenciones
6. pantalla/listado básico de comprobantes emitidos
7. detalle del comprobante emitido
8. acceso desde compra/retención al comprobante ya emitido

No implementar todavía:

- anulación de comprobante
- reemisión
- edición del comprobante ya emitido
- firma digital
- envío por correo
- emisión masiva avanzada con filtros sofisticados

---

# 4. Regla funcional principal

## Emitir comprobante ≠ calcular retención

Deben quedar como pasos separados:

### Paso 1
Calcular retención IVA:
- genera o actualiza `RetencionIVA`
- estado inicial: `CALCULADA`

### Paso 2
Emitir comprobante IVA:
- genera `ComprobanteIVA`
- asigna número oficial
- vincula retenciones
- cambia estado a `CONFIRMADA`
- bloquea recálculo posterior

---

# 5. Flujo funcional esperado

El flujo del sistema debe quedar así:

```txt
Compra → Calcular Retención IVA → Emitir Comprobante IVA → Imprimir / PDF / Exportar TXT

6. Política de emisión del MVP

Para el MVP, permitir emitir comprobante de estas dos formas:

6.1 Emisión individual

Desde el detalle de una compra que ya tiene una RetencionIVA calculada y elegible.

6.2 Emisión agrupada simple

Desde un listado básico de retenciones elegibles o desde una vista simple de comprobantes, agrupando únicamente si todas cumplen:

mismo tenant
misma empresa
mismo proveedor
mismo período fiscal
estado CALCULADA
sin comprobante previo

Si la emisión agrupada complica demasiado esta fase, al menos dejar bien implementada la emisión individual y documentar que la agrupación simple queda para el siguiente refinamiento.

7. Reglas de elegibilidad para emitir

Una RetencionIVA puede emitirse en comprobante solo si:

existe
pertenece al tenant
estado = CALCULADA
no tiene comprobanteIVAId
la compra asociada existe
la compra no está anulada
el período fiscal existe
el proveedor existe y es consistente
no hay bloqueo por inconsistencia grave
No emitir si:
ya tiene comprobante
la compra está anulada
la retención no fue calculada
pertenece a otro tenant
carece de datos mínimos necesarios
8. Creación de ComprobanteIVA

Al emitir, crear registro en ComprobanteIVA con:

tenantId
empresaId
proveedorId
numeroComprobante
fechaEmision

Y, si el modelo actual lo contempla o lo necesita:

periodoFiscalId
totalRetenidoSnapshot o campo equivalente si decides agregarlo
9. Generación del correlativo
Formato obligatorio

Usar:

AAAAMMSSSSSSSS
Ejemplo:
20260400000001
Reglas
secuencia por empresa
tomar correlativo de ParametroFiscal.proximoCorrelativoIVA
generar en transacción
incrementar correlativo en la misma transacción
respetar prefijo año/mes de la fecha de emisión
Recomendación MVP

Si reinicioCorrelativoMensual = true todavía no está resuelto al 100%, al menos:

dejar el número emitido con prefijo AAAAMM
documentar si la secuencia sigue corrida por empresa
no romper unicidad
10. Actualización de RetencionIVA

Al emitir comprobante, cada retención involucrada debe:

recibir comprobanteIVAId
cambiar de estado a CONFIRMADA (o equivalente final del dominio)
quedar bloqueada para recálculo

Si ya existe el bloqueo en el módulo de retención, esta emisión debe activarlo de forma real y no solo teórica.

11. Arquitectura técnica requerida

Mantener patrón modular claro.

Estructura sugerida:

src/modules/retenciones/iva/comprobantes/
  ui/
    emitir-comprobante-iva-button.tsx
    comprobante-iva-table.tsx
    comprobante-iva-detail.tsx
  server/
    emision-comprobante-iva.service.ts
    emision-comprobante-iva.repository.ts
    emision-comprobante-iva.rules.ts
  actions/
    emitir-comprobante-iva.ts

Puedes adaptar nombres, pero mantener separación entre:

reglas
persistencia
servicio
actions
UI
12. Vista/listado de comprobantes emitidos

Crear una pantalla básica visible en la app para listar comprobantes emitidos.

Ruta sugerida:

/dashboard/fiscal/comprobantes-iva

o la ruta equivalente coherente con tu estructura actual.

Debe mostrar:
número comprobante
fecha
empresa
proveedor
período
total retenido
acción ver detalle
acción imprimir
acción PDF si ya existe el módulo

Esto resuelve el problema actual de que el usuario no tiene un lugar donde ver comprobantes emitidos.

13. Detalle del comprobante emitido

Crear una vista detalle del comprobante con:

número comprobante
fecha emisión
empresa
proveedor
período fiscal
retenciones incluidas
compras/facturas asociadas
totales
botones:
imprimir comprobante
descargar PDF (si ya está disponible)

Ruta sugerida:

/dashboard/fiscal/comprobantes-iva/[id]
14. Integración con detalle de compra

En el detalle de una compra:

Si no hay retención calculada

No mostrar emisión.

Si hay retención calculada y elegible

Mostrar botón:

Emitir comprobante IVA
Si ya hay comprobante emitido

Mostrar:

número de comprobante
estado confirmado
enlace a ver comprobante
botón imprimir
botón PDF si ya existe

Esto debe sustituir la ambigüedad actual.

15. Integración con impresión y PDF

La impresión y el PDF solo deben mostrarse si existe realmente un ComprobanteIVA emitido.

Regla

No mostrar opciones de imprimir/PDF en base a una simple retención calculada.

Solo mostrar si:

existe comprobanteIVAId
el comprobante ya fue creado formalmente

Esto debe quedar explícito en la UI y en la lógica.

16. Server action de emisión

Crear action tipo:

emitirComprobanteIVAAction(retencionIds | compraId)

Debe:

obtener tenantId
validar elegibilidad
emitir comprobante en transacción
revalidar rutas relevantes
devolver:
success
comprobanteId
numeroComprobante
mensaje útil
17. Validaciones de seguridad
Multitenancy

No emitir comprobantes de otro tenant.

Consistencia

No emitir si las retenciones no son homogéneas cuando se use agrupación.

Estado

No emitir retenciones ya comprometidas.

Error semántico claro

Si falla la emisión, mostrar errores entendibles:

“La retención ya fue emitida”
“La compra está anulada”
“No existe correlativo disponible”
“Las retenciones seleccionadas no pertenecen al mismo proveedor/período”
18. UX mínima requerida
18.1 Desde compra

Botón claro:

Emitir comprobante IVA
18.2 Feedback

Luego de emitir:

mensaje de éxito
mostrar número de comprobante
redirigir a detalle del comprobante emitido
18.3 Listado

Debe existir una pantalla navegable de comprobantes emitidos

18.4 Menú

Si aún no existe sección visible, agregar temporalmente acceso desde:

fiscal
o retenciones/IVA
según la estructura actual

Lo importante es que el usuario pueda encontrar el comprobante ya emitido.

19. Entregables requeridos

Cursor debe dejar implementado:

flujo de emisión formal
servicio transaccional de emisión
correlativo legal
actualización de RetencionIVA
listado básico de comprobantes emitidos
detalle del comprobante
integración con compra
resumen técnico corto con:
qué implementó
cómo resolvió la emisión
cómo resolvió el correlativo
qué queda pendiente para impresión/PDF si aplica
20. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

calcular retención IVA
emitir formalmente el comprobante
asignar número oficial
listar comprobantes emitidos
entrar al detalle del comprobante
desde ahí imprimir o descargar PDF en pasos posteriores
21. Fuera de alcance de este paso

No implementar todavía:

anulación
reemisión
firma digital
envío por correo
workflows complejos de aprobación