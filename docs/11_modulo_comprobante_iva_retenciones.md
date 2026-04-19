# 11_modulo_comprobante_iva_retenciones.md

# 1. Objetivo

Implementar el módulo de **Comprobante IVA** de RetenSaaS para emitir y gestionar comprobantes de retención de IVA a partir de retenciones previamente calculadas y válidas.

Este módulo debe resolver:

- creación de `ComprobanteIVA`
- agrupación de una o varias `RetencionIVA`
- generación de número correlativo legal
- bloqueo definitivo de recálculo de retenciones ya comprometidas
- visualización del comprobante
- base técnica para exportación TXT y futura impresión/PDF

Este paso marca el cierre del primer ciclo fiscal operativo del sistema: **Compra → Retención IVA → Comprobante IVA**.

---

# 2. Alcance del paso

Este módulo debe incluir:

1. emisión de comprobante IVA
2. agrupación de una o varias retenciones IVA
3. correlativo fijo legal `AAAAMMSSSSSSSS`
4. validaciones de elegibilidad para agrupar
5. persistencia de `ComprobanteIVA`
6. asociación de `RetencionIVA.comprobanteIVAId`
7. bloqueo definitivo del recálculo de retenciones ya comprometidas
8. listado y detalle básico de comprobantes IVA
9. integración con detalle de compra y/o retención

No implementar todavía:

- exportación TXT SENIAT
- impresión oficial PDF
- envío por correo
- anulación/reverso de comprobante
- emisión masiva compleja con filtros avanzados
- libro fiscal formal

---

# 3. Entidades involucradas

Usar:

- `RetencionIVA`
- `ComprobanteIVA`
- `ParametroFiscal`
- `Empresa`
- `Proveedor`
- `PeriodoFiscal`

Campos relevantes:

## ComprobanteIVA
- tenantId
- empresaId
- proveedorId
- numeroComprobante
- fechaEmision

## RetencionIVA
- compraId
- comprobanteIVAId
- periodoFiscalId
- estado
- porcentajeRetencionSnapshot
- montoBaseSnapshot
- impuestoIVASnapshot
- montoRetenido

## ParametroFiscal
- empresaId
- proximoCorrelativoIVA
- reinicioCorrelativoMensual

---

# 4. Política de agrupación del MVP

Para el MVP, se adopta una política estricta y clara:

## Un comprobante IVA puede agrupar varias retenciones SOLO si cumplen todas estas condiciones:

- misma empresa
- mismo proveedor
- mismo período fiscal
- mismo tenant
- no tener ya `comprobanteIVAId`
- estado válido para ser comprobantadas
- no pertenecer a compras anuladas
- no venir de períodos cerrados incompatibles si decides restringirlo

Esta política debe estar implementada y documentada explícitamente.

---

# 5. Correlativo del comprobante IVA

## Formato obligatorio
El `numeroComprobante` debe seguir el formato fijo:

```txt
AAAAMMSSSSSSSS

Donde:

AAAA = año de emisión
MM = mes de emisión
SSSSSSSS = secuencia de 8 dígitos
Ejemplo:
20260400000001
Reglas
la secuencia es por empresa
la secuencia debe generarse usando ParametroFiscal.proximoCorrelativoIVA
si reinicioCorrelativoMensual = true, la lógica debe contemplar reinicio mensual o al menos dejar el terreno preparado claramente
para el MVP, puedes implementar:
secuencia acumulativa por empresa
pero el número emitido siempre con prefijo AAAAMM
si implementas reinicio mensual real, documenta bien el criterio
Requisito técnico crítico

La generación del correlativo debe hacerse en transacción para evitar duplicados.

6. Flujo funcional del módulo
6.1 Selección de retenciones elegibles

Debe existir una función para obtener retenciones IVA elegibles para comprobante.

Ejemplo:

getRetencionesIVAElegibles(params)

Mínimo:

por tenant
por empresa
opcionalmente por proveedor o período
6.2 Emisión

Debe existir una función tipo:

emitirComprobanteIVA(retencionIds, tenantId)

Debe hacer, en este orden:

cargar todas las retenciones indicadas
validar que existan y pertenezcan al tenant
validar que todas sean elegibles
validar que cumplan política de agrupación
generar correlativo en transacción
crear ComprobanteIVA
actualizar RetencionIVA.comprobanteIVAId
opcionalmente mover RetencionIVA.estado a CONFIRMADA
devolver comprobante emitido con sus retenciones
7. Reglas de elegibilidad
Una retención es elegible si:
existe
pertenece al tenant
tiene estado CALCULADA
no tiene comprobanteIVAId
su compra asociada existe y está en estado válido
su compra no está anulada
su compra/proveedor/empresa siguen siendo consistentes
No es elegible si:
ya tiene comprobante
está anulada
la compra está anulada
no cumple agrupación homogénea
pertenece a otro tenant
no tiene período fiscal o datos clave válidos
8. Reglas de agrupación homogénea

Implementar una validación clara, por ejemplo:

validarAgrupacionComprobanteIVA(retenciones)

Debe verificar que todas las retenciones compartan:

tenantId
empresaId (vía compra/comprobante contexto)
proveedorId (vía compra)
periodoFiscalId

Si alguna difiere, bloquear la emisión con error claro.

9. Persistencia y estados
9.1 Crear comprobante

Crear ComprobanteIVA con:

tenantId
empresaId
proveedorId
numeroComprobante
fechaEmision
9.2 Actualizar retenciones

Cada retención agrupada debe:

recibir comprobanteIVAId
pasar a estado CONFIRMADA si ese es el criterio del dominio actual
9.3 Efecto de negocio

Una vez una retención tenga comprobanteIVAId, no debe poder recalcularse automáticamente.

Este bloqueo ya existe en parte; este módulo debe convertirlo en flujo completo real.

10. Arquitectura técnica requerida

Mantener separación clara:

src/modules/retenciones/iva/comprobantes/
  ui/
    comprobante-iva-table.tsx
    comprobante-iva-detail.tsx
    emitir-comprobante-iva-form.tsx
  server/
    comprobante-iva.service.ts
    comprobante-iva.repository.ts
    comprobante-iva.rules.ts
  actions/
    emitir-comprobante-iva.ts

Puedes ajustar nombres, pero mantener separación entre:

reglas de agrupación
servicio
persistencia
acciones
UI
11. Reglas encapsuladas

Crear funciones claras, por ejemplo:

esRetencionIVAElegibleParaComprobante(...)
validarAgrupacionComprobanteIVA(...)
generarNumeroComprobanteIVA(...)

La lógica de correlativo no debe quedar regada por varios archivos.

12. Integración con ParametroFiscal

La emisión debe usar ParametroFiscal de la empresa.

Requisitos:

cargar ParametroFiscal
si no existe, error claro
leer proximoCorrelativoIVA
generar número
incrementar correlativo dentro de la misma transacción

Esto es obligatorio.

13. UI mínima requerida
13.1 Listado de retenciones elegibles

Crear una vista o sección donde el usuario pueda ver retenciones candidatas a comprobante.

Mínimo mostrar:

compra / número factura
proveedor
empresa
período
monto retenido
estado
13.2 Acción emitir comprobante

Permitir seleccionar una o varias retenciones elegibles y emitir un comprobante.

Para el MVP:

puede ser una selección simple por checkbox
o incluso emitir desde un grupo ya filtrado por proveedor/período
13.3 Detalle del comprobante

Mostrar:

número comprobante
fecha emisión
empresa
proveedor
período
lista de retenciones incluidas
suma total retenida
13.4 Integración con detalle de compra

Si una compra ya tiene una retención con comprobante, mostrar en su detalle:

número de comprobante
estado comprometido
mensaje claro de que no puede recalcularse
14. Validaciones técnicas importantes
14.1 Transacción

La emisión completa debe ocurrir dentro de prisma.$transaction.

14.2 Concurrencia

La lógica del correlativo debe minimizar riesgo de duplicados.
Para el MVP:

usa transacción
y documenta la limitación si no hay locking más avanzado
14.3 Rutas y revalidación

Alinear revalidatePath(...) con las rutas reales del dashboard privado.

14.4 Tipado

Evitar any en UI y services de este módulo.

15. Resumen de reglas del MVP

En esta fase, se asume:

solo se emiten comprobantes sobre retenciones previamente calculadas
no se recalcula durante la emisión
no se anula comprobante
no se exporta TXT aún
no se imprime PDF aún
la agrupación es estricta y homogénea

Estas decisiones deben quedar documentadas en el resumen técnico final.

16. Entregables requeridos

Cursor debe dejar implementado:

reglas de elegibilidad
reglas de agrupación
generador de número de comprobante IVA
servicio de emisión con transacción
actualización de RetencionIVA.comprobanteIVAId
cambio de estado de retención si aplica
vista/listado básico de comprobantes
detalle del comprobante
integración visual con compra/retención
resumen técnico corto con:
qué implementó
qué política de agrupación usó
cómo resolvió correlativo
qué quedó pendiente para TXT/PDF
17. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

seleccionar retenciones IVA elegibles
emitir un comprobante IVA válido
generar correlativo legal
vincular retenciones al comprobante
bloquear definitivamente su recálculo
consultar detalle del comprobante emitido
18. Fuera de alcance de este paso

No implementar todavía:

exportación TXT
PDF oficial
anulación de comprobante
reemisión
consolidación por lotes complejos
envío al proveedor
integración con SENIAT