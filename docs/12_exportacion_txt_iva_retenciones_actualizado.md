# 12_exportacion_txt_iva_retenciones_actualizado.md

# 1. Objetivo

Implementar el módulo de **Exportación TXT de Retenciones IVA** de RetenSaaS, alineado con el flujo fiscal real del sistema y con el motor de reglas IVA v2, para generar el archivo de texto requerido para la declaración de retenciones ante el SENIAT.

La exportación debe trabajar exclusivamente sobre retenciones ya:

- calculadas correctamente
- auditables
- comprometidas en `ComprobanteIVA`
- pertenecientes al período fiscal correspondiente
- consistentes con el resultado definitivo del motor de reglas

Este módulo no debe volver a calcular el impuesto ni redecidir si la retención aplica o no. Su responsabilidad es exportar de forma segura y trazable lo que ya fue consolidado.

---

# 2. Alcance del paso

Este módulo debe incluir:

1. selección de exportación por empresa y período fiscal IVA
2. validación de consistencia de comprobantes y retenciones
3. generación del contenido TXT
4. persistencia del evento en `ExportacionFiscal`
5. descarga del archivo
6. historial básico de exportaciones
7. validaciones específicas para motor IVA v2

No implementar todavía:

- subida automática al portal SENIAT
- firma digital
- anulación de exportación
- reconciliación automática con declaraciones
- almacenamiento definitivo en S3/Blob si no existe aún infraestructura
- exportación XML/ISLR en este paso

---

# 3. Fuente de datos oficial del módulo

La exportación debe basarse en:

- `ComprobanteIVA`
- `RetencionIVA`
- `Compra`
- `Proveedor`
- `Empresa`
- `PeriodoFiscal`
- `ExportacionFiscal`

## Regla central
Solo deben exportarse retenciones IVA que:

- pertenezcan al tenant actual
- pertenezcan a la empresa seleccionada
- pertenezcan al período fiscal seleccionado
- tengan `comprobanteIVAId`
- estén en estado coherente para exportación (`CONFIRMADA` o el estado final que hayas definido)
- tengan compra asociada válida
- no provengan de compras anuladas
- estén fiscalmente consolidadas

La exportación NO debe incluir retenciones meramente calculadas y aún no comprobantadas.

---

# 4. Relación con el motor IVA v2

## 4.1 Lo que el módulo NO debe hacer
Este módulo NO debe:

- reevaluar exclusiones
- recalcular porcentaje retenido
- reinterpretar reglas del motor
- cambiar el monto retenido

## 4.2 Lo que el módulo SÍ debe hacer
Sí debe validar que cada retención exportable:

- tenga trazabilidad mínima consistente
- tenga `motivoCodigo` coherente si ya se persiste
- tenga `categoriaRegla` coherente si ya se persiste
- tenga base legal o snapshot suficientes, si el modelo actual ya los guarda
- tenga `montoRetenido` consistente con su estado final

## 4.3 Casos de 75% y 100%
El exportador debe contemplar correctamente retenciones:
- generales (75%)
- totales (100%)

No requiere lógica distinta de cálculo, pero sí debe respetar el monto final retenido y la alícuota/snapshot correspondiente.

---

# 5. Tipo de exportación

En este paso solo se implementa:

- `TXT_IVA`

Debe quedar explícito en `ExportacionFiscal`.

---

# 6. Formato del archivo TXT

## 6.1 Estructura de salida
Generar un archivo TXT con líneas delimitadas por tabulación.

Cada línea representa una retención IVA exportable.

## 6.2 Campos por línea
Campos mínimos esperados:

A. RIF del Agente  
B. Período Impositivo (`AAAAMM`)  
C. Fecha de Factura (`AAAA-MM-DD` o el formato exigido por tu política final)  
D. Tipo de Operación (`C` para Compra en el MVP)  
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

## 6.3 Política MVP para campos incompletos
Si algunos campos aún no tienen captura operativa completa, aplicar política explícita y documentada:

- `L Documento Afectado`: vacío si no aplica
- `P Número de Expediente`: vacío por ahora si no existe en el modelo
- `E Tipo de Documento`: usar código real de `TipoDocumento`
- `O Alícuota`: usar snapshot real de la compra o de la retención, no inferir a posteriori

No inventar datos.

---

# 7. Flujo funcional

## 7.1 Selección inicial
La exportación debe iniciarse seleccionando:

- empresa
- período fiscal de IVA

## 7.2 Validación previa
Antes de generar el archivo, validar:

- el período existe y pertenece al tenant
- el período corresponde a IVA
- la empresa pertenece al tenant
- existen retenciones exportables en ese período
- todas tienen comprobante
- todas están en estado exportable
- los comprobantes tienen número válido
- la empresa tiene RIF válido
- los proveedores tienen RIF válido
- las compras base no están anuladas
- no hay líneas críticamente incompletas

## 7.3 Generación
Crear servicio tipo:

- `generarExportacionTXTIVA(periodoFiscalId, empresaId, tenantId, usuarioId)`

Debe:

1. validar elegibilidad del período
2. cargar comprobantes y retenciones exportables
3. mapear cada línea del TXT
4. construir el contenido completo
5. persistir `ExportacionFiscal`
6. devolver metadatos + contenido del archivo

---

# 8. Reglas de elegibilidad para exportación

Una retención IVA es exportable si:

- tiene `comprobanteIVAId`
- pertenece al período seleccionado
- pertenece al tenant actual
- pertenece a la empresa seleccionada
- tiene compra asociada válida
- la compra no está anulada
- el proveedor tiene RIF válido
- el comprobante tiene número válido
- el monto retenido es mayor o igual a cero y coherente
- su estado es final/exportable

## No exportar:
- retenciones sin comprobante
- retenciones huérfanas
- retenciones de compras anuladas
- retenciones de otro tenant
- retenciones fuera del período
- retenciones con inconsistencia crítica de datos

---

# 9. Persistencia en ExportacionFiscal

Al generar una exportación, crear un registro en `ExportacionFiscal` con:

- tenantId
- empresaId
- periodoFiscalId
- tipo = `TXT_IVA`
- estado = `GENERADA`
- usuarioId
- fechaGeneracion
- cantidadRegistros
- montoTotal
- hashArchivo si decides calcularlo
- nombreArchivo sugerido
- urlStorage solo si ya guardas archivo físicamente

## Regla
Aunque el archivo no se guarde todavía en storage externo, el evento de exportación sí debe quedar persistido.

---

# 10. Validaciones específicas por motor IVA v2

Este módulo debe incorporar validaciones adicionales derivadas del nuevo motor:

## 10.1 No reevaluar motor
No recalcular `aplica/no aplica`.

## 10.2 Verificar consistencia mínima del snapshot
Si `RetencionIVA` ya guarda:
- `motivoCodigo`
- `categoriaRegla`
- `baseLegal*`
- `versionMotor`

validar que estén presentes o, al menos, no en un estado evidentemente corrupto.

## 10.3 Aceptar 75% y 100%
El exportador debe soportar ambas sin lógica diferenciada de cálculo, usando el resultado consolidado.

## 10.4 No exportar retenciones en estado intermedio
Exportar solo estados finales:
- por ejemplo `CONFIRMADA`
o el estado final que haya quedado definido tras `ComprobanteIVA`

---

# 11. Arquitectura técnica requerida

Mantener separación clara entre:

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

Responsabilidades
validator: valida elegibilidad y consistencia
mapper: transforma retención → línea TXT
service: coordina generación y persistencia
repository: acceso a datos
actions: interacción server-side
ui: selección, descarga e historial
12. Mapeo de líneas TXT

Crear una función pura:

mapRetencionIVAATxtLine(retencion)

Debe:

recibir una estructura ya validada
construir la línea respetando el orden de columnas
usar tabulación como separador
formatear montos y fechas consistentemente
NO consultar base de datos
13. UI mínima requerida
13.1 Pantalla de generación

Debe permitir:

seleccionar empresa
seleccionar período fiscal IVA
generar archivo TXT
13.2 Resultado de generación

Luego de generar:

mostrar cantidad de registros
mostrar monto total exportado
permitir descargar el TXT
mostrar mensaje de éxito
registrar en historial
13.3 Historial básico

Mostrar:

fecha
empresa
período
tipo
cantidad de registros
monto total
usuario generador
14. Descarga del archivo

El sistema debe permitir descargar el archivo generado en la misma interacción.

Requisitos
nombre de archivo consistente
contenido exacto generado por el mapper
no regenerar con datos distintos al momento de descargar dentro de la misma acción
Nombre sugerido

Ejemplo:

retenciones_iva_<rif_empresa>_<aaaamm>.txt

Cursor puede ajustar el naming si propone algo mejor.

15. Validaciones técnicas importantes
15.1 Multitenancy

Toda exportación debe filtrar por tenant.

15.2 Integridad transaccional mínima

La persistencia del registro de ExportacionFiscal y los metadatos asociados debe ser coherente con el archivo generado.

15.3 Tipado

Evitar any.

15.4 Rutas

Alinear revalidatePath(...) con la estructura real del dashboard privado.

16. Decisiones del MVP

En esta fase se asume:

exportación manual
generación bajo acción explícita del usuario
sin subida automática al SENIAT
sin anulación de exportación
el archivo se genera y descarga desde UI
el registro en ExportacionFiscal sirve como trazabilidad
el exportador usa datos ya consolidados por comprobante, no lógica fiscal viva

Estas decisiones deben documentarse en el resumen técnico.

17. Entregables requeridos

Cursor debe dejar implementado:

validator de exportación TXT IVA
mapper de líneas TXT
servicio de generación
action server-side
persistencia en ExportacionFiscal
UI mínima para generar y descargar
historial básico
resumen técnico corto con:
qué implementó
qué validaciones nuevas agregó por motor IVA v2
qué campos quedan vacíos por decisión del MVP
qué queda pendiente para declaración completa
18. Resultado esperado

Al finalizar este paso, el sistema debe permitir:

seleccionar empresa y período IVA
generar el TXT de retenciones ya comprobantadas
descargarlo
registrar el evento de exportación
dejar una base lista para declaración y mejoras futuras
19. Fuera de alcance de este paso

No implementar todavía:

XML de ISLR
subida al SENIAT
anulación de exportaciones
almacenamiento definitivo del archivo en nube si aún no existe infraestructura
reconciliación automática con planillas o pagos    