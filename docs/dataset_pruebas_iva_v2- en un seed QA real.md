Necesito convertir el documento `dataset_pruebas_iva_v2.md` en un seed QA real y reutilizable dentro del proyecto.

Objetivo:
Crear un dataset automatizable de pruebas para el motor IVA v2, que permita probar rápida y consistentemente los escenarios fiscales reales desde la UI y desde backend, sin tener que crear registros manualmente cada vez.

## Alcance
Implementar un seed QA separado del seed base productivo.

Debe poder crear o actualizar:
- organización QA
- empresa(s) QA
- parámetros fiscales QA
- períodos fiscales QA
- proveedores QA
- compras QA diseñadas para disparar reglas del motor IVA v2

No debe romper ni duplicar el seed normal del sistema.

---

## Requisitos de implementación

### 1. Ubicación
Crear una estructura clara para el seed QA, por ejemplo una de estas opciones:

```txt
prisma/seeds/qa/

o

prisma/seed-qa-iva-v2.ts

Escoge la opción más mantenible según la estructura actual del proyecto y documenta la decisión.

2. Seed QA independiente

El seed QA no debe mezclarse de forma desordenada con el seed base del sistema.

Debe quedar claro qué es:

seed base de catálogos / demo mínima
seed QA de pruebas fiscales

Si hace falta, agregar scripts separados en package.json, por ejemplo:

seed
seed:qa
3. Datos base a crear
3.1 Organización QA

Crear una organización dedicada a pruebas:

nombre: QA Retenciones IVA
rif: J-99999999-1
3.2 Empresa principal QA
nombreFiscal: Empresa QA IVA, C.A.
rif: J-11111111-1
agenteRetencionIVA: true
agenteRetencionISLR: false
3.3 Empresa secundaria QA (opcional si ayuda a pruebas)
nombreFiscal: Empresa QA Secundaria, C.A.
rif: J-22222222-2
agenteRetencionIVA: true
3.4 ParametroFiscal

Crear o asegurar ParametroFiscal para la empresa principal:

proximoCorrelativoIVA = 1
proximoCorrelativoISLR = 1
reinicioCorrelativoMensual = true
3.5 Períodos fiscales QA

Crear al menos:

período IVA abierto: abril 2026
período IVA cerrado: marzo 2026

Con sus códigos correctos y estados coherentes.

4. Proveedores QA

Crear proveedores específicos que representen casos fiscales del motor IVA v2.

Debe incluir al menos:

PROV_ORD_75
ordinario
porcentajeRetencionIVA = 75
rifRegistrado = true
proveedorMarcadoRetencion100 = false
esAgentePercepcionIVA = false
PROV_ORD_100
ordinario
porcentajeRetencionIVA = 100
proveedorMarcadoRetencion100 = true
rifRegistrado = true
PROV_FORMAL
formal
porcentajeRetencionIVA = 0
PROV_SIN_RIF
ordinario
porcentajeRetencionIVA = 75
rifRegistrado = false
PROV_PERCEPCION_TABACO
ordinario
porcentajeRetencionIVA = 75
esAgentePercepcionIVA = true
rubroPercepcionIVA = TABACO (o valor equivalente según el schema real)
5. Compras QA

Crear compras específicas que disparen reglas del motor.

Usar nombres o referencias internas estables para identificarlas fácilmente.

Implementar al menos estos casos:

COMP_RET_75
COMP_FORMAL
COMP_EXENTA
COMP_NO_SUJETA
COMP_EXONERADA
COMP_VIATICO
COMP_REEMBOLSABLE
COMP_SERV_PUBLICO
COMP_PERCEPCION_IMPORT
COMP_PERCEPCION_TABACO
COMP_100_DOC_SIN_IVA
COMP_100_DOC_INVALIDO
COMP_100_PROV_MARCADO
COMP_100_SIN_RIF
COMP_100_ART2
COMP_PERIODO_CERRADO
COMP_MONTO_20UT

Cada una debe usar:

empresa válida
proveedor válido
período coherente
flags fiscales apropiados
montos concretos y trazables
6. Catálogos y dependencias

Asegúrate de que existan antes o durante el seed QA:

TipoDocumento
AlicuotaIVA
UnidadTributaria
cualquier catálogo que el módulo de Compras necesite

Si el seed base ya los crea, reutilízalo o valida su existencia.
No duplicar catálogos globales.

7. Idempotencia

El seed QA debe ser idempotente.

Requisitos:

no duplicar organización
no duplicar empresas
no duplicar proveedores
no duplicar períodos
no duplicar compras QA
actualizar o reutilizar registros si ya existen

Usar:

upsert
búsquedas previas
claves funcionales estables
8. Convenciones de trazabilidad

Cada dato QA debe ser fácil de identificar.

Recomendaciones:

usar nombres explícitos
usar referencias internas o comentarios en el código
si hace falta, agregar un prefijo QA en nombres

El objetivo es que luego puedas entrar al sistema y reconocer rápido qué compra prueba cada regla.

9. Resumen técnico obligatorio

Al final deja un resumen técnico corto indicando:

dónde quedó el seed QA
qué script debo correr
qué casos quedaron sembrados
qué módulos del sistema quedan listos para probar con esos datos
10. Script de ejecución

Si hace falta, agrega o ajusta package.json para que yo pueda correr algo como:

npm run seed:qa

o el comando equivalente que dejes definido.

Importante
No rediseñar el dominio
No borrar datos productivos/demostrativos existentes
No mezclar QA con seed base sin orden
Mantener consistencia con el motor IVA v2 ya implementado
Resultado esperado

Al terminar, el proyecto debe tener un seed QA real que me permita entrar al sistema y probar manualmente, con datos ya preparados, todos los escenarios importantes del motor IVA v2.