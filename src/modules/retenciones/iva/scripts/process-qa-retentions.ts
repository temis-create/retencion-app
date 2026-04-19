import { prisma } from "../../../../lib/prisma";
import { calcularYGuardarRetencionIVA } from "../server/retencion-iva.service";

async function main() {
  console.log("🔄 Procesando retenciones para el Dataset QA...");

  const compras = await prisma.compra.findMany({
    where: {
      id: { startsWith: "qa-comp-" },
    },
  });

  console.log(`Encontradas ${compras.length} compras de QA.`);

  for (const compra of compras) {
    try {
      console.log(`- Calculando retencin para ${compra.numeroFactura} (${compra.id})...`);
      const res = await calcularYGuardarRetencionIVA(compra.id, compra.tenantId);
      console.log(`  Resultado: ${res.aplica ? "APLICA (" + res.resultado.categoriaRegla + ")" : "NO APLICA (" + res.resultado.motivoCodigo + ")"}`);
    } catch (error: any) {
      console.error(`  ❌ Error en ${compra.numeroFactura}: ${error.message}`);
    }
  }

  console.log("✅ Procesamiento de retenciones QA completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
