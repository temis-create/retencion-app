# Resumen Técnico: Módulo de Comprobante IVA

## Implementación Realizada
Se ha completado el módulo de **Comprobante IVA** para cerrar el primer ciclo fiscal de compras dentro de RetenSaaS. 

### Características Implementadas:
1. **Reglas de Elegibilidad y Agrupación**:
   Implementadas en `comprobante-iva.rules.ts`. Solo se permiten retenciones `CALCULADAS`, pertenecientes al mismo tenant, misma empresa (agente), mismo proveedor (sujeto) y mismo periodo fiscal, asegurando homogeneidad estricta en un único comprobante consolidado.

2. **Generación de Correlativo (Transaction)**:
   Se ha integrado la emisión con la tabla `ParametroFiscal`. Utilizando `prisma.$transaction`, se intercepta el `proximoCorrelativoIVA`, se incrementa atómicamente y se genera un correlativo rígido con formato `AAAAMMSSSSSSSS`.

3. **Vínculo y Bloqueo Definitivo**:
   Al emitirse el comprobante, el registro `RetencionIVA` adopta el estado `CONFIRMADA` e ingiere el ID del comprobante emitido (`comprobanteIVAId`). Esto activa instantáneamente un bloqueo técnico en el servicio base, prohibiendo ediciones o recálculos ciegos.

4. **Interfaz Integrada**:
   - Listado Histórico de comprobantes (`/fiscal/comprobantes-iva`).
   - Portal de Emisión Multiselección (`/fiscal/comprobantes-iva/emitir`).
   - Detalle desglosado con totalizaciones.
   - Enlace cruzado en el UI del Detalle de Compras (la tarjeta de retención ahora muestra a qué comprobante N° pertenece y lleva un enlace accionable).

### Pendientes Acordados (Para el Futuro):
- **Exportación TXT SENIAT**: Por ahora, los datos están disponibles, pero la serialización formal en plano de datos aún no se implementa según lo solicitado.
- **Formato Impresión Oficial/PDF**: Al igual que la emisión TXT, la generación de PDFs listos para imprenta o despacho quedan fuera del Scope del MVP presente.
- **Flujos atípicos de Reverso/Anulación**.
