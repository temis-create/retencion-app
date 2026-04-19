# 12_exportacion_txt_iva_retenciones.md

# 1. Objetivo

Implementar el módulo de **Exportación TXT de Retenciones IVA** de RetenSaaS para generar el archivo de texto requerido para la declaración de retenciones ante el SENIAT, tomando como fuente los comprobantes y retenciones IVA ya emitidos y validados.

Este módulo debe resolver:

- selección de datos exportables por período
- validaciones previas de consistencia
- construcción del archivo TXT con estructura estable
- persistencia de la exportación en `ExportacionFiscal`
- trazabilidad de qué se exportó, cuándo y por quién
- base para el flujo futuro de declaración

---

# 2. Alcance del paso

Este módulo debe incluir:

1. selección/exportación por período fiscal de IVA
2. validación de consistencia antes de exportar
3. generación del contenido TXT
4. persistencia de registro en `ExportacionFiscal`
5. descarga del archivo
6. detalle básico de exportaciones realizadas
7. prevención razonable de exportaciones inválidas

No implementar todavía:

- subida automática al portal SENIAT
- firma digital
- validación contra servicio externo
- anulación de exportación
- exportación incremental avanzada
- reversiones automáticas
- XML ISLR en este paso

---

# 3. Fuente de datos

La exportación debe basarse en retenciones IVA ya comprometidas en comprobante válido.

Entidades involucradas:

- `PeriodoFiscal`
- `RetencionIVA`
- `ComprobanteIVA`
- `Compra`
- `Proveedor`
- `Empresa`
- `ExportacionFiscal`

Solo deben exportarse retenciones que:

- pertenezcan al tenant actual
- pertenezcan a la empresa seleccionada
- pertenezcan al período fiscal seleccionado
- tengan `comprobanteIVAId`
- estén en estado coherente para exportación
- pertenezcan a compras válidas

---

# 4. Formato de salida

## 4.1 Tipo de exportación
En este paso solo se implementa:

- `TXT_IVA`

## 4.2 Estructura
La exportación debe producir un archivo TXT con líneas delimitadas por tabulación, siguiendo el orden definido en el documento funcional del proyecto.

Campos requeridos por línea:

A. RIF del Agente  
B. Período Impositivo (AAAAMM)  
C. Fecha de Factura (AAAA-MM-DD)  
D. Tipo de Operación (usar `C` para Compra en el MVP)  
E. Tipo de Documento  
F. RIF del Proveedor  
G. Número de Documento  
H. Número de Control  
I. Monto Total  
J. Base Imponible  
K. Monto Retenido  
L. Documento Afectado  
M. Número de Comprobante  
N. Monto Exento  
O. Alícuota  
P. Número de Expediente

## 4.3 Reglas MVP para campos con complejidad parcial
Si algunos campos aún no tienen lógica completa, definir política explícita y consistente, por ejemplo:

- `L Documento Afectado`: vacío si no aplica
- `P Número de Expediente`: vacío por ahora si no existe dato operativo real
- `E Tipo de Documento`: usar código del catálogo `TipoDocumento`
- `O Alícuota`: usar alícuota/snapshot real usada en la compra

No inventar valores arbitrarios. Documentar claramente cualquier campo que quede vacío por decisión del MVP.

---

# 5. Flujo funcional

## 5.1 Selección del período
La exportación debe iniciarse seleccionando:

- empresa
- período fiscal de IVA

## 5.2 Validación previa
Antes de generar el archivo, validar al menos:

- el período existe y pertenece al tenant
- el período corresponde a `IVA`
- existen retenciones exportables en ese período
- todas tienen comprobante
- la empresa tiene RIF válido
- los comprobantes tienen número válido
- las compras base tienen datos mínimos requeridos

## 5.3 Generación
Crear servicio tipo:

- `generarExportacionTXTIVA(periodoFiscalId, tenantId, usuarioId)`

Debe:

1. validar elegibilidad del período
2. cargar todas las retenciones exportables
3. mapear cada línea del TXT
4. construir el contenido del archivo
5. guardar registro en `ExportacionFiscal`
6. devolver contenido + metadatos

---

# 6. Reglas de elegibilidad para exportación

Una retención IVA es exportable si:

- tiene `comprobanteIVAId`
- pertenece al período seleccionado
- pertenece al tenant
- tiene compra asociada válida
- tiene proveedor con RIF válido
- tiene montos consistentes

No exportar retenciones:
- huérfanas
- sin comprobante
- de compras anuladas
- de otro tenant
- fuera del período

---

# 7. Persistencia en ExportacionFiscal

Al generar el archivo, crear un registro en `ExportacionFiscal` con:

- tenantId
- empresaId
- periodoFiscalId
- tipo = `TXT_IVA`
- estado inicial coherente (`GENERADA`)
- `usuarioId`
- `fechaGeneracion`
- `cantidadRegistros`
- `montoTotal`
- `hashArchivo` si decides calcularlo
- `urlStorage` solo si ya estás guardando archivo físico; si no, documentar que queda pendiente

Si no se guarda físicamente todavía, al menos persistir el evento y metadatos.

---

# 8. Arquitectura técnica requerida

Mantener el patrón modular actual.

Estructura sugerida:

```txt
src/modules/exportaciones/iva/
  ui/
    exportacion-iva-form.tsx
    exportacion-iva-table.tsx
    exportacion-iva-detail.tsx
  server/
    exportacion-iva.service.ts
    exportacion-iva.repository.ts
    exportacion-iva.mapper.ts
    exportacion-iva.validator.ts
  actions/
    generar-exportacion-iva.ts

Separar claramente:

validación
mapping TXT
persistencia
action
UI
9. Mapeo de líneas TXT

Crear una función clara, por ejemplo:

mapRetencionIVAATxtLine(retencion)

Debe recibir una estructura ya validada y devolver la línea lista para el TXT.

La función debe encargarse de:

formatear montos
formatear fechas
respetar orden de columnas
usar tabulación como separador
no meter lógica de acceso a DB
10. UI mínima requerida
10.1 Pantalla de exportación

Debe permitir:

seleccionar empresa
seleccionar período IVA
generar TXT
10.2 Resultado

Después de generar:

mostrar cantidad de registros exportados
mostrar monto total retenido
permitir descargar el contenido TXT
mostrar que se registró en historial
10.3 Historial básico

Crear una vista/listado simple de exportaciones IVA realizadas, mostrando al menos:

fecha
empresa
período
tipo
cantidad de registros
monto total
usuario generador
11. Validaciones técnicas importantes
11.1 Multitenancy

Toda exportación debe filtrar por tenant.

11.2 Integridad

No generar TXT con líneas incompletas sin control.
Si hay inconsistencias, devolver error claro antes de crear la exportación.

11.3 Tipado

Evitar any en el mapper y el service.

11.4 Revalidación

Alinear revalidatePath(...) con las rutas reales del dashboard privado.

12. Decisiones del MVP

En esta fase se asume:

exportación manual
una exportación por acción explícita del usuario
no se sube automáticamente al SENIAT
no se anula exportación
el archivo puede generarse y descargarse desde la UI
el registro en ExportacionFiscal sirve como trazabilidad

Estas decisiones deben quedar documentadas al final.

13. Entregables requeridos

Cursor debe dejar implementado:

validación de exportación por período IVA
mapper de líneas TXT
servicio de generación
action server-side
persistencia en ExportacionFiscal
UI mínima para generar y descargar
historial básico
resumen técnico corto con:
qué implementó
qué campos quedaron vacíos por decisión del MVP
qué quedó pendiente para declaración completa
14. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

seleccionar un período IVA
generar el TXT de retenciones
descargarlo
registrar la exportación realizada
dejar base lista para declaración y mejoras posteriores
15. Fuera de alcance de este paso

No implementar todavía:

XML de ISLR
subida al SENIAT
anulación de exportaciones
almacenamiento definitivo de archivo en S3/Blob si aún no existe infraestructura
reconciliación con planilla de pago    