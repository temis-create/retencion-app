# 13d_exportacion_islr_retenciones.md

# 1. Objetivo

Implementar el módulo de **Exportación de Retenciones ISLR** en RetenSaaS para generar archivos o datasets oficiales listos para declaración, conciliación o carga administrativa de retenciones practicadas.

Este módulo debe permitir:

- seleccionar empresa y período fiscal ISLR
- exportar comprobantes ISLR emitidos
- generar archivo estructurado (TXT/CSV según estrategia MVP)
- registrar historial de exportaciones
- dejar base lista para adaptación futura a formato oficial SENIAT vigente

---

# 2. Principio funcional

La exportación ISLR debe trabajar únicamente con:

```txt
RetencionISLR CONFIRMADA + ComprobanteISLR EMITIDO

No exportar:

retenciones calculadas sin comprobante
pagos sin retención
borradores
registros anulados
3. Alcance del paso

Este módulo debe incluir:

selección por empresa
selección por período fiscal ISLR
consulta de comprobantes emitidos
generación de archivo exportable
persistencia en ExportacionFiscal
historial de exportaciones
descarga del archivo

No implementar todavía:

envío automático al SENIAT
firma digital
API externa
conciliación automática con portal fiscal
4. Fuente oficial de datos

Usar:

ComprobanteISLR
RetencionISLR
Pago
PagoCompra
Proveedor
Empresa
PeriodoFiscal
ConceptoISLR
ExportacionFiscal
5. Política MVP de formato
Estrategia recomendada

Como el formato oficial puede cambiar o variar:

Implementar inicialmente:

Opción A (recomendada)
TXT estructurado delimitado por tabulación
Opción B
CSV UTF-8
Recomendación final

Crear arquitectura preparada para múltiples exporters:

ISLR_TXT
ISLR_CSV
ISLR_XML (futuro)
6. Selección inicial

Pantalla debe permitir:

empresa
período fiscal ISLR
tipo de archivo
7. Reglas de elegibilidad

Solo exportar comprobantes que:

pertenezcan al tenant
pertenezcan a la empresa seleccionada
pertenezcan al período ISLR seleccionado
estado = EMITIDO
tengan retenciones asociadas válidas
8. Campos mínimos sugeridos de exportación

Cada línea debe representar una retención o línea fiscal.

Columnas MVP
RIF Agente Retención
Nombre Empresa
Período Fiscal
Número Comprobante
Fecha Emisión
RIF Beneficiario
Nombre Beneficiario
Tipo Persona
Código Concepto ISLR
Descripción Concepto
Monto Pagado
Base Retenible
Porcentaje
Monto Retenido
9. Agrupación interna
Si comprobante tiene múltiples líneas

Exportar:

Recomendación MVP

Una línea por cada RetencionISLR.

Esto simplifica:

conciliación
auditoría
revisión
10. Servicio principal

Crear:

generarExportacionISLR(periodoFiscalId, empresaId, formato, tenantId)

Debe:

validar tenant
validar empresa
validar período
cargar comprobantes emitidos
transformar líneas
generar archivo
persistir ExportacionFiscal
devolver descarga
11. Persistencia en ExportacionFiscal

Crear registro:

tenantId
empresaId
periodoFiscalId
tipo = ISLR_TXT / ISLR_CSV
fechaGeneracion
usuarioId
cantidadRegistros
montoTotalRetenido
nombreArchivo
12. Arquitectura técnica
src/modules/exportaciones/islr/
  server/
    exportacion-islr.service.ts
    exportacion-islr.mapper.ts
    exportacion-islr.validator.ts
  actions/
    generar-exportacion-islr.ts
  ui/
    exportacion-islr-form.tsx
    exportacion-islr-table.tsx
13. UI requerida
Pantalla principal

Ruta sugerida:

/retenciones/islr/exportaciones
Mostrar:
selector empresa
selector período
formato archivo
botón generar
Historial:
fecha
período
empresa
cantidad registros
monto retenido
descargar nuevamente (opcional futuro)
14. Validaciones
No exportar si:
no hay comprobantes emitidos
período cerrado sin datos
tenant incorrecto
datos inconsistentes
Mostrar errores claros:
No existen comprobantes emitidos para ese período
El período no pertenece a la empresa
Exportación vacía
15. Seguridad
Multitenancy obligatorio

Toda exportación debe filtrar por:

tenantId
empresaId
16. Tipado

Evitar any.

Usar DTO claro para línea exportable.

17. Entregables requeridos

Cursor debe dejar implementado:

módulo exportación ISLR
mapper líneas
validator
service
action server
UI generación
historial básico
resumen técnico corto
18. Resultado esperado

El sistema debe permitir:

emitir comprobantes ISLR
exportarlos por período
descargar archivo usable
mantener trazabilidad
19. Fuera de alcance

No implementar aún:

integración directa portal fiscal
firma digital
reenvío automático