import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando actualización de Unidad Tributaria...");

  // 1. Cerrar la UT actual si existe
  await prisma.unidadTributaria.updateMany({
    where: {
      activo: true,
      fechaFin: null,
    },
    data: {
      fechaFin: new Date("2025-06-01"),
      activo: false,
    },
  });

  // 2. Crear la nueva UT (Gaceta 43.140)
  const nuevaUt = await prisma.unidadTributaria.create({
    data: {
      valor: 43.00,
      fechaInicio: new Date("2025-06-02"),
      descripcion: "Gaceta Oficial N° 43.140 (Establecimiento de nuevo valor)",
      activo: true,
    },
  });

  console.log("Nueva Unidad Tributaria creada:", nuevaUt);
  console.log("Actualización completada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
