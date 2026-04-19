# Resumen Técnico: Alícuotas IVA en Compras

## Diseño e Implementación
Para soportar el cálculo del IVA mediante alícuotas configurables, se implementaron los siguientes ajustes:

1. **Schema Prisma (`Compra`)**: 
   Se añadió el campo `porcentajeAlicuotaSnapshot (Decimal?)` a la tabla de `Compra`. Este enfoque ('snapshot') es preferible a una relación rígida, ya que garantiza inmutabilidad histórica. Si el catálogo global `AlicuotaIVA` cambia en el futuro, los documentos de compra antiguos mantendrán intacto el porcentaje de impuesto con el que fueron registrados.

2. **Cálculo Automático y Override (Control Manual)**:
   - **Comportamiento Híbrido**: El sistema no bloquea rígidamente la edición del campo de IVA. En su lugar, proporciona un mecanismo híbrido diseñado específicamente para facturación SENIAT.
   - **Cálculo Dinámico**: Al seleccionar una alícuota y modificar la Base Imponible, el sistema calcula de forma instantánea el "IVA" y ajusta el "Total".
   - **Override Controlado**: Al mismo tiempo, el campo `impuestoIVA` y `totalFactura` permanecen como `inputs` editables. Esto permite al operador introducir ajustes finos manuales (como diferencias de ±1 Bs, comunes debido a inconsistencias de redondeo en algunas máquinas fiscales viejas), sin violar la integridad principal de los comprobantes.
   - Si se edita la base imponible posteriormente, el sistema vuelve a prevalecer su cálculo automático.

3. **Catálogo de Alícuotas**:
   El catálogo global `AlicuotaIVA` se insertó en el `seed.ts` de forma idempotente, incluyendo de base la tasa *General (16%)* y *Reducida (8%)*. Estos registros se inyectan sin afectar datos operativos existentes.
