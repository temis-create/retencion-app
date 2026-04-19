# 14_catalogo_islr_global_2025.md

## Objetivo

Definir una **tabla maestra única de conceptos de retención ISLR 2025** para la aplicación, usando como base comparada tres fuentes cargadas por el usuario:

- Forvis Mazars
- Moore Venezuela
- Grant Thornton

Valor de la Unidad Tributaria vigente usado en este catálogo: **Bs. 43,00**.

---

## Resultado del análisis comparativo

### Conclusión general

Las tres tablas coinciden en lo esencial:

- porcentajes de retención,
- bases imponibles,
- montos mínimos,
- sustraendos de personas naturales,
- uso de Tarifa N° 2 para casos acumulativos de no domiciliados.

### Observaciones detectadas

1. **Forvis Mazars**
   - Es la tabla más limpia para lectura humana.
   - Tiene una inconsistencia menor de estilo en una celda: `nª2` en vez de `N°2`.
   - No afecta la lógica tributaria.

2. **Moore Venezuela**
   - Muy completa y útil por sus notas.
   - Tiene un problema de diagramación / numeración alrededor de los numerales 17, 18 y 19.
   - Los valores tributarios no parecen cambiar por ese error visual, pero no debe usarse como fuente primaria de numerales para sembrado.

3. **Grant Thornton**
   - Es la mejor fuente para sistema porque agrega **códigos de concepto SENIAT**.
   - Tiene estructura apta para parametrización de software.
   - Debe tomarse como base principal del catálogo para la app.

---

## Decisión para la aplicación

Para el SaaS, la tabla maestra debe construirse con esta prioridad:

1. **Códigos SENIAT y estructura base:** Grant Thornton
2. **Validación de tasas / bases / sustraendos:** Forvis Mazars
3. **Notas operativas y aclaratorias:** Moore Venezuela

---

## Reglas maestras del sistema

### 1. Unidad Tributaria
- **UT 2025 = Bs. 43,00**

### 2. Sustraendos válidos
- Para retención de **1%**: **Bs. 35,83**
- Para retención de **3%**: **Bs. 107,50**

### 3. Monto mínimo individual para ciertos casos de PN residente
- **Bs. 3.583,34**
- En cálculos internos conviene manejarlo con precisión decimal fija de 2 o 4 posiciones.
- Algunas fuentes muestran `3.583,33` y otras `3.583,34`; para consistencia operativa del sistema se recomienda usar **3.583,34**, que es el valor que también aparece en dos de las tablas y es el que normalmente se usa en práctica con redondeo al centavo.

### 4. Tarifa acumulativa N° 2
Aplicable a ciertos pagos a personas jurídicas no domiciliadas y equivalentes señalados en el decreto.

Tabla operativa:

- Desde **0 U.T.** hasta **2000 U.T.** → **15%**, sustraendo **0 U.T.**
- Desde **2001 U.T.** hasta **3000 U.T.** → **22%**, sustraendo **140 U.T.**
- Desde **3001 U.T.** en adelante → **34%**, sustraendo **500 U.T.**

Equivalencia en bolívares con UT 43:

- 140 U.T. = **Bs. 6.020,00**
- 500 U.T. = **Bs. 21.500,00**

### 5. Regla de cálculo para pagos de tarjetas de crédito o consumo
La base para calcular la retención no se toma directamente del monto pagado bruto, sino de la fórmula legal:

`base = monto_pagado / ((alicuota_iva / 100) + 1)`

### 6. Seguros y reaseguros no domiciliados
La retención del numeral 8 se aplica sobre **ingreso neto**.

---

## Normalización recomendada de sujetos

Para evitar ambigüedad en la app, usar estos códigos internos:

- `PNR` = Persona Natural Residente
- `PNNR` = Persona Natural No Residente
- `PJD` = Persona Jurídica Domiciliada
- `PJND` = Persona Jurídica No Domiciliada

---

## Estructura recomendada del catálogo global

Campos sugeridos:

- `codigoSeniat`
- `numeral`
- `literal`
- `concepto`
- `sujeto`
- `baseImponiblePorcentaje`
- `tipoTarifa` (`PORCENTAJE` | `TARIFA_2`)
- `porcentajeRetencion`
- `montoMinimoBs`
- `sustraendoBs`
- `usaMontoMinimo`
- `usaSustraendo`
- `requiereCalculoEspecial`
- `formulaEspecial`
- `notas`
- `activo`

---

## Catálogo maestro recomendado para sembrado

> Nota: donde la tarifa es acumulativa, `porcentajeRetencion` puede quedar en `NULL` y `tipoTarifa = TARIFA_2`.

| codigoSeniat | numeral | literal | concepto | sujeto | base % | tipoTarifa | tarifa % | montoMinimoBs | sustraendoBs | requiereCalculoEspecial | notas |
|---|---:|---|---|---|---:|---|---:|---:|---:|---|---|
| 003 | 1 | a | Honorarios profesionales | PNNR | 90 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false | No residente |
| 002 | 1 | b/c/d | Honorarios profesionales | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false | Incluye sociedades de personas |
| 005 | 1 | a | Honorarios profesionales | PJND | 90 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 004 | 1 | b | Honorarios profesionales | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 019 | 2 | a/b | Comisiones | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 018 | 2 | a/b | Comisiones | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 020 | 2 | a/b | Comisiones | PJND | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 021 | 2 | a/b | Comisiones | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 022 | 3 | a | Intereses art. 27 #2 LISLR | PNNR | 95 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 023 | 3 | a | Intereses art. 27 #2 LISLR | PJND | 95 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 024 | 3 | b | Intereses art. 52 parágrafo 2° LISLR | PJND | 100 | PORCENTAJE | 4.95 | 0.00 | 0.00 | false | Instituciones financieras no domiciliadas |
| 026 | 3 | c | Intereses | PNNR | 95 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 025 | 3 | c | Intereses | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 028 | 3 | c | Intereses | PJND | 95 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 027 | 3 | c | Intereses | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 029 | 4 |  | Agencias de noticias internacionales | PJND | 15 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 031 | 5 | a | Fletes Venezuela-exterior y viceversa | PJND | 5 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 031 | 5 | b | Fletes en el país a empresa internacional | PJND | 10 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 032 | 6 |  | Exhibición de películas | PNNR | 25 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 033 | 6 |  | Exhibición de películas | PJND | 25 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 034 | 7 | 1 | Regalías y participaciones análogas | PNNR | 90 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 035 | 7 | 1 | Regalías y participaciones análogas | PJND | 90 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 036 | 7 | 2 | Asistencia técnica | PNNR | 30 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 037 | 7 | 2 | Asistencia técnica | PJND | 30 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 038 | 7 | 3 | Servicios tecnológicos | PNNR | 50 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 039 | 7 | 3 | Servicios tecnológicos | PJND | 50 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 040 | 8 |  | Primas de seguro y reaseguro | PJND | 30 | PORCENTAJE | 10.00 | 0.00 | 0.00 | false | Sobre ingreso neto |
| 042 | 9 |  | Ganancias en juegos y apuestas | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 041 | 9 |  | Ganancias en juegos y apuestas | PNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 044 | 9 |  | Ganancias en juegos y apuestas | PJND | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 043 | 9 |  | Ganancias en juegos y apuestas | PJD | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 046 | 9 |  | Premios lotería e hipódromos | PNNR | 100 | PORCENTAJE | 16.00 | 0.00 | 0.00 | false |  |
| 045 | 9 |  | Premios lotería e hipódromos | PNR | 100 | PORCENTAJE | 16.00 | 0.00 | 0.00 | false |  |
| 048 | 9 |  | Premios lotería e hipódromos | PJND | 100 | PORCENTAJE | 16.00 | 0.00 | 0.00 | false |  |
| 047 | 9 |  | Premios lotería e hipódromos | PJD | 100 | PORCENTAJE | 16.00 | 0.00 | 0.00 | false |  |
| 050 | 10 |  | Propietarios de animales de carrera | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 049 | 10 |  | Propietarios de animales de carrera | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 052 | 10 |  | Propietarios de animales de carrera | PJND | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 051 | 10 |  | Propietarios de animales de carrera | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 054 | 11 |  | Servicios | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 053 | 11 |  | Servicios | PNR | PORCENTAJE | 1.00 | 3583.34 | 35.83 | false | Ejecución de obras y prestación de servicios |
| 056 | 11 |  | Servicios | PJND | 100 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 055 | 11 |  | Servicios | PJD | 100 | PORCENTAJE | 2.00 | 0.00 | 0.00 | false |  |
| 058 | 12 |  | Arrendamiento de bienes inmuebles | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 057 | 12 |  | Arrendamiento de bienes inmuebles | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 060 | 12 |  | Arrendamiento de bienes inmuebles | PJND | 100 | TARIFA_2 | NULL | 0.00 | 0.00 | false | Acumulativa |
| 059 | 12 |  | Arrendamiento de bienes inmuebles | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false | Incluye administradoras |
| 062 | 13 |  | Arrendamiento de bienes muebles | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 061 | 13 |  | Arrendamiento de bienes muebles | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 064 | 13 |  | Arrendamiento de bienes muebles | PJND | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 063 | 13 |  | Arrendamiento de bienes muebles | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 066 | 14 |  | Pagos de tarjetas de crédito o consumo | PNNR | NULL | PORCENTAJE | 34.00 | 0.00 | 0.00 | true | Base según fórmula especial |
| 065 | 14 |  | Pagos de tarjetas de crédito o consumo | PNR | NULL | PORCENTAJE | 3.00 | 0.00 | 0.00 | true | Base según fórmula especial |
| 068 | 14 |  | Pagos de tarjetas de crédito o consumo | PJND | NULL | PORCENTAJE | 5.00 | 0.00 | 0.00 | true | Base según fórmula especial |
| 067 | 14 |  | Pagos de tarjetas de crédito o consumo | PJD | NULL | PORCENTAJE | 5.00 | 0.00 | 0.00 | true | Base según fórmula especial |
| 069 | 14 |  | Pago de gasolina con tarjeta de crédito o consumo | PNR | NULL | PORCENTAJE | 1.00 | 0.00 | 0.00 | true | Base según fórmula especial |
| 070 | 14 |  | Pago de gasolina con tarjeta de crédito o consumo | PJD | NULL | PORCENTAJE | 1.00 | 0.00 | 0.00 | true | Base según fórmula especial |
| 071 | 15 |  | Fletes y gastos de transporte nacional | PNR | 100 | PORCENTAJE | 1.00 | 3583.34 | 35.83 | false |  |
| 072 | 15 |  | Fletes y gastos de transporte nacional | PJD | 100 | PORCENTAJE | 3.00 | 0.00 | 0.00 | false |  |
| 073 | 16 |  | Pago de empresa de seguros a corredores | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 074 | 16 |  | Pago de empresa de seguros a corredores | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 075 | 17 |  | Pago de empresas de seguros por reparación de bienes de sus asegurados | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 076 | 17 |  | Pago de empresas de seguros por reparación de bienes de sus asegurados | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 077 | 17 |  | Pago de empresas de seguros a centros de salud por atención de sus asegurados | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 078 | 17 |  | Pago de empresas de seguros a centros de salud por atención de sus asegurados | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false | Se corrige duplicidad visual detectada en la tabla de Grant Thornton |
| 080 | 18 |  | Adquisición de fondos de comercio | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| 079 | 18 |  | Adquisición de fondos de comercio | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 082 | 18 |  | Adquisición de fondos de comercio | PJND | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 081 | 18 |  | Adquisición de fondos de comercio | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 083 | 19 |  | Publicidad y propaganda | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| 085 | 19 |  | Publicidad y propaganda | PJND | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 084 | 19 |  | Publicidad y propaganda | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| 086 | 19 |  | Publicidad y propaganda emisoras de radio | PJD | 100 | PORCENTAJE | 3.00 | 0.00 | 0.00 | false |  |
| NULL | 20 |  | Enajenación de acciones en bolsa de valores | PNNR | 100 | PORCENTAJE | 1.00 | 0.00 | 0.00 | false |  |
| NULL | 20 |  | Enajenación de acciones en bolsa de valores | PNR | 100 | PORCENTAJE | 1.00 | 0.00 | 0.00 | false |  |
| NULL | 20 |  | Enajenación de acciones en bolsa de valores | PJND | 100 | PORCENTAJE | 1.00 | 0.00 | 0.00 | false |  |
| NULL | 20 |  | Enajenación de acciones en bolsa de valores | PJD | 100 | PORCENTAJE | 1.00 | 0.00 | 0.00 | false |  |
| NULL | 21 |  | Enajenación de acciones fuera de bolsa | PNNR | 100 | PORCENTAJE | 34.00 | 0.00 | 0.00 | false |  |
| NULL | 21 |  | Enajenación de acciones fuera de bolsa | PNR | 100 | PORCENTAJE | 3.00 | 3583.34 | 107.50 | false |  |
| NULL | 21 |  | Enajenación de acciones fuera de bolsa | PJND | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |
| NULL | 21 |  | Enajenación de acciones fuera de bolsa | PJD | 100 | PORCENTAJE | 5.00 | 0.00 | 0.00 | false |  |

---

## Correcciones y decisiones de modelado adoptadas

### 1. Servicios numeral 11
Debe registrarse así para PNR:

- Base imponible: **100**
- Tarifa: **1%**
- Monto mínimo: **Bs. 3.583,34**
- Sustraendo: **Bs. 35,83**

### 2. Fletes numeral 5
En la comparación apareció una inconsistencia importante:

- Forvis muestra **100%** para “operaciones en el país”.
- Moore y Grant Thornton muestran **10%**.

Para evitar un error tributario en producción, la tabla de sistema debe dejar este punto marcado como **“requiere validación legal final”** antes de habilitarlo en UI operativa.  
Mi recomendación es:

- dejarlo **inactivo** inicialmente en el catálogo si no será usado;
- o mantenerlo activo con bandera `pendienteRevisionLegal = true`.

### 3. Código 077 / 078 en numeral 17
En Grant Thornton la última fila parece repetir `077` para PNR y PJD en atención a asegurados.  
Para evitar colisión en tu modelo, recomiendo:

- **no usar el código SENIAT como unique global**;
- usar `id` interno;
- permitir `codigoSeniat` nullable y no único;
- almacenar además `numeral + sujeto + concepto`.

### 4. Montos mínimos
Los casos con “Todo pago” deben guardarse como:

- `usaMontoMinimo = false`
- `montoMinimoBs = 0`

No conviene guardar texto libre como “Todo pago” en la tabla maestra si luego la app calculará.

---

## Recomendación de UX para la app

En el selector de conceptos ISLR, no muestres al usuario los 70+ registros técnicos.  
Mejor separar:

### Nivel visible para usuario
- Honorarios profesionales
- Comisiones
- Servicios
- Arrendamiento inmuebles
- Arrendamiento muebles
- Fletes nacionales
- Publicidad y propaganda
- Fondos de comercio
- Seguros
- Tarjetas de crédito
- Acciones en bolsa / fuera de bolsa
- No domiciliados / especiales

### Nivel técnico interno
La app resuelve automáticamente:
- tipo de sujeto,
- código SENIAT,
- base imponible,
- sustraendo,
- monto mínimo,
- si usa Tarifa 2,
- si usa fórmula especial.

---

## Sugerencia de modelo Prisma

```prisma
model ConceptoRetencionISLR {
  id                       Int      @id @default(autoincrement())
  codigoSeniat             String?
  numeral                  String
  literal                  String?
  concepto                 String
  sujeto                   String   // PNR, PNNR, PJD, PJND
  baseImponiblePorcentaje  Decimal? @db.Decimal(10, 4)
  tipoTarifa               String   // PORCENTAJE | TARIFA_2
  porcentajeRetencion      Decimal? @db.Decimal(10, 4)
  montoMinimoBs            Decimal? @default(0) @db.Decimal(14, 2)
  sustraendoBs             Decimal? @default(0) @db.Decimal(14, 2)
  usaMontoMinimo           Boolean  @default(false)
  usaSustraendo            Boolean  @default(false)
  requiereCalculoEspecial  Boolean  @default(false)
  formulaEspecial          String?
  notas                    String?
  activo                   Boolean  @default(true)
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt

  @@index([numeral])
  @@index([concepto])
  @@index([sujeto])
  @@index([codigoSeniat])
}
```

---

## Seed SQL base

```sql
INSERT INTO "ConceptoRetencionISLR"
("codigoSeniat","numeral","literal","concepto","sujeto","baseImponiblePorcentaje","tipoTarifa","porcentajeRetencion","montoMinimoBs","sustraendoBs","usaMontoMinimo","usaSustraendo","requiereCalculoEspecial","formulaEspecial","notas","activo")
VALUES
('002','1','b/c/d','Honorarios profesionales','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,'Incluye sociedades de personas',true),
('004','1','b','Honorarios profesionales','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('003','1','a','Honorarios profesionales','PNNR',90,'PORCENTAJE',34.00,0,0,false,false,false,NULL,'No residente',true),
('005','1','a','Honorarios profesionales','PJND',90,'TARIFA_2',NULL,0,0,false,false,false,NULL,'Acumulativa',true),

('018','2','a/b','Comisiones','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('021','2','a/b','Comisiones','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('019','2','a/b','Comisiones','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('020','2','a/b','Comisiones','PJND',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),

('053','11',NULL,'Servicios','PNR',100,'PORCENTAJE',1.00,3583.34,35.83,true,true,false,NULL,'Ejecución de obras y prestación de servicios',true),
('055','11',NULL,'Servicios','PJD',100,'PORCENTAJE',2.00,0,0,false,false,false,NULL,NULL,true),
('054','11',NULL,'Servicios','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('056','11',NULL,'Servicios','PJND',100,'TARIFA_2',NULL,0,0,false,false,false,NULL,'Acumulativa',true),

('057','12',NULL,'Arrendamiento de bienes inmuebles','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('059','12',NULL,'Arrendamiento de bienes inmuebles','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,'Incluye administradoras',true),
('058','12',NULL,'Arrendamiento de bienes inmuebles','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('060','12',NULL,'Arrendamiento de bienes inmuebles','PJND',100,'TARIFA_2',NULL,0,0,false,false,false,NULL,'Acumulativa',true),

('061','13',NULL,'Arrendamiento de bienes muebles','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('063','13',NULL,'Arrendamiento de bienes muebles','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('062','13',NULL,'Arrendamiento de bienes muebles','PNNR',100,'PORCENTAJE',34.00,0,0,false,false,false,NULL,NULL,true),
('064','13',NULL,'Arrendamiento de bienes muebles','PJND',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),

('071','15',NULL,'Fletes y gastos de transporte nacional','PNR',100,'PORCENTAJE',1.00,3583.34,35.83,true,true,false,NULL,NULL,true),
('072','15',NULL,'Fletes y gastos de transporte nacional','PJD',100,'PORCENTAJE',3.00,0,0,false,false,false,NULL,NULL,true),

('083','19',NULL,'Publicidad y propaganda','PNR',100,'PORCENTAJE',3.00,3583.34,107.50,true,true,false,NULL,NULL,true),
('084','19',NULL,'Publicidad y propaganda','PJD',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('085','19',NULL,'Publicidad y propaganda','PJND',100,'PORCENTAJE',5.00,0,0,false,false,false,NULL,NULL,true),
('086','19',NULL,'Publicidad y propaganda emisoras de radio','PJD',100,'PORCENTAJE',3.00,0,0,false,false,false,NULL,NULL,true);
```

---

## Recomendación final para implementación

Para el MVP de la aplicación, activa primero estos grupos:

1. Honorarios profesionales
2. Comisiones
3. Servicios
4. Arrendamientos
5. Fletes nacionales
6. Publicidad
7. Seguros
8. Tarjetas de crédito

Y deja como fase 2:

- regalías,
- asistencia técnica,
- servicios tecnológicos,
- ganancias fortuitas,
- acciones,
- no domiciliados acumulativos complejos.

---

## Archivos complementarios recomendados después de este

1. `14a_seed_conceptos_islr.sql`
2. `14b_catalogo_islr_admin_ui.md`
3. `14c_motor_calculo_islr.md`
4. `14d_exportacion_txt_islr_seniat.md`

---

## Fuentes comparadas por el usuario

- Forvis Mazars: tabla ISLR vigente con UT Bs. 43,00
- Moore Venezuela: tabla ISLR vigente con UT Bs. 43,00
- Grant Thornton: tabla ISLR con códigos SENIAT y UT Bs. 43,00
