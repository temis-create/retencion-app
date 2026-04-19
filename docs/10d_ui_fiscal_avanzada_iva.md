# 10d_ui_fiscal_avanzada_iva.md

# 1. Objetivo

Implementar la capa de UI necesaria para capturar los nuevos campos fiscales avanzados del motor de Retención IVA v2, sin sobrecargar la experiencia principal del usuario y manteniendo una interfaz clara y profesional.

Este paso debe conectar visualmente el backend ya extendido con los formularios operativos del sistema, de modo que el motor de reglas IVA pueda trabajar con datos reales y no solo con defaults conservadores.

---

# 2. Alcance del paso

Este paso debe incluir:

1. ajustes al formulario de Proveedor
2. ajustes al formulario de Compra
3. agrupación UX de campos avanzados
4. persistencia correcta en server actions ya existentes
5. carga correcta en edición
6. visualización parcial de flags clave en detalles o badges si aporta valor

No implementar todavía:
- panel de auditoría legal completo
- administración masiva de clasificación fiscal
- automatización por Portal Fiscal
- wizard tributario complejo

---

# 3. Principio UX

Los nuevos campos fiscales NO deben saturar la pantalla principal del usuario.

Implementar una sección colapsable o panel secundario tipo:

- "Clasificación fiscal avanzada IVA"

en los formularios relevantes.

La información básica debe seguir visible primero.
Los campos avanzados deben quedar accesibles, claros y ordenados.

---

# 4. Ajustes requeridos en Proveedor

## 4.1 Formulario de proveedor
Actualizar `proveedor-form.tsx` para incluir en una sección avanzada:

- `esAgentePercepcionIVA`
- `rubroPercepcionIVA`
- `proveedorMarcadoRetencion100`
- `rifRegistrado`

Y, si ya existe el dato:
- mostrar `rifValidadoPortalFiscalAt` solo como lectura si aplica, no necesariamente editable

## 4.2 UX recomendada
Agruparlo bajo un bloque como:

```txt
Clasificación fiscal avanzada IVA

con ayuda contextual breve en cada campo.

Ejemplos de ayuda
esAgentePercepcionIVA: “Úselo solo si el proveedor actúa como agente de percepción en rubros específicos.”
proveedorMarcadoRetencion100: “Indica que el proveedor debe ser retenido al 100% según verificación fiscal.”
rifRegistrado: “Desmarcar solo si se conoce que el proveedor no está inscrito correctamente en el RIF.”
4.3 Campo rubroPercepcionIVA

Debe mostrarse solo o destacarse cuando esAgentePercepcionIVA = true.

Puede implementarse inicialmente como:

select
enum controlado
o string acotado, según cómo quedó el schema actual
5. Ajustes requeridos en Compra
5.1 Formulario de compra

Actualizar compra-form.tsx para incluir una sección avanzada de clasificación fiscal con:

naturalezaIVA
esViatico
esGastoReembolsable
esServicioPublicoDomiciliario
esOperacionArticulo2RetencionTotal
tienePercepcionAnticipadaIVA
ivaDiscriminado
cumpleRequisitosFormales
5.2 UX recomendada

Esta sección debe ir aparte del bloque principal de:

empresa
proveedor
documento
montos

El usuario no debe verla como parte de la captura básica de la factura, sino como una clasificación fiscal avanzada.

5.3 Naturaleza IVA

Mostrar como select controlado con opciones legibles:

Gravada
Exenta
Exonerada
No sujeta

Internamente usar el enum ya definido en Prisma.

5.4 Defaults visibles

Preseleccionar valores razonables:

naturalezaIVA = GRAVADA
ivaDiscriminado = true
cumpleRequisitosFormales = true
los demás en false, salvo regla distinta del negocio
6. Comportamientos UI importantes
6.1 Dependencias visuales

Implementar dependencias simples:

si esAgentePercepcionIVA = false, ocultar o deshabilitar rubroPercepcionIVA
si naturalezaIVA != GRAVADA, mostrar advertencia de que probablemente no aplicará retención IVA
si ivaDiscriminado = false, mostrar advertencia visual de posible retención del 100%
si cumpleRequisitosFormales = false, mostrar advertencia visual de posible retención del 100%
6.2 No bloquear demasiado la captura

En esta fase, mostrar ayudas y advertencias, pero no convertir el formulario en una experiencia hostil.
Las decisiones finales siguen estando en el motor.

7. Integración con Zod y acciones

Verificar que los formularios:

envíen correctamente todos los nuevos campos
respeten los valores por defecto
no rompan creación ni edición
sigan usando los schemas Zod ya ampliados

No duplicar lógica fiscal en la UI.

La UI solo captura y orienta.
La decisión sigue viviendo en el motor y en services.

8. Visualización opcional en detalle

Si aporta valor y no ensucia demasiado, mostrar en detalle de Compra o Proveedor algunos indicadores clave, por ejemplo:

En detalle de Proveedor
Contribuyente formal / ordinario / especial
Agente de percepción IVA
Marcado 100%
RIF registrado
En detalle de Compra
Naturaleza IVA
IVA discriminado
Cumple requisitos formales
Viático / reembolsable / servicio público si aplica

Esto es opcional, pero útil para trazabilidad visual.

9. Requisitos técnicos
mantener tipado fuerte
evitar any
no mover lógica fiscal al client component
no rediseñar los módulos completos
mantener consistencia visual con Empresas, Proveedores y Compras
10. Resultado esperado

Al finalizar este paso, el sistema debe permitir capturar desde la UI los datos fiscales avanzados necesarios para alimentar correctamente el motor de Retención IVA v2.

El usuario debe poder:

clasificar mejor al proveedor
clasificar mejor la compra
activar o desactivar flags fiscales relevantes
ver advertencias contextuales útiles

sin dañar la usabilidad del sistema.

11. Entregables requeridos

Cursor debe dejar implementado:

proveedor-form actualizado
compra-form actualizado
UX colapsable o bloque avanzado claro
defaults razonables
dependencias visuales mínimas
resumen técnico corto indicando:
qué campos expuso en UI
qué defaults usó
qué advertencias visuales agregó
qué quedó pendiente para futura integración con Portal Fiscal