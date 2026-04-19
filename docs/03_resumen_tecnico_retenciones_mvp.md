# Resumen Técnico: Política de Retención IVA (MVP)

## Notas de Crédito / Débito (NC/ND)

Para el lanzamiento inicial (MVP) del módulo de Retención IVA, se ha establecido la política de **no calcular automáticamente retenciones sobre documentos tipo Nota de Crédito y Nota de Débito**. 

### Motivos
1. **Complejidad Fiscal:** El cálculo de retenciones sobre Notas de Crédito/Débito requiere evaluar si el ajuste se realiza en el mismo período fiscal que la factura original o en uno posterior. Esto afecta cómo impacta la retención (si descuenta directo del comprobante actual o se ajusta como excedente).
2. **Dependencia Temporal:** El sistema precisa trazar la temporalidad entre la NC/ND y el Comprobante de IVA original. Automatizar este ajuste cruzado introduce altos riesgos de inconsistencia de saldos de IVA sin un flujo de validación manual.
3. **Foco del MVP:** El objetivo primordial es habilitar la emisión fluida y exacta de Comprobantes de Retención para facturas estándar, que cubren la inmensa mayoría del volumen transaccional.

### Solución Implementada
- La regla en `esCompraRetenibleIVA` (`retencion-iva.rules.ts`) intercepta la evaluación para `tipoDocumento.codigo` pertenecientes a `["NC", "ND"]`.
- Cuando se detecta uno de estos códigos, se devuelve `aplica: false` con el motivo claro: *"El MVP no soporta cálculo automático de retención para Notas de Crédito o Débito"*.
- El UI (mediante el componente `RetencionIVACard`) presentará este motivo amigablemente al usuario.
