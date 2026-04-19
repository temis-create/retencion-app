import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando y recreando usuario con password simple...");

  await prisma.asignacionRol.deleteMany();
  await prisma.usuario.deleteMany();
  
  const tenant = await prisma.organizacion.findFirst();
  const empresa = await prisma.empresa.findFirst();
  const rol = await prisma.rol.findFirst();

  if (!tenant || !empresa || !rol) {
    console.log("Faltan datos maestros. Ejecute el seed completo primero.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin", 10);
  await prisma.usuario.create({
    data: {
      email: "admin@retensaas.com",
      nombre: "Admin Demo",
      passwordHash: hashedPassword,
      tenantId: tenant.id,
      activo: true,
    },
  });

  await prisma.asignacionRol.create({
    data: {
      usuarioId: (await prisma.usuario.findFirst())?.id!,
      rolId: rol.id,
      empresaId: empresa.id,
    },
  });

  console.log("Usuario recreado: admin@retensaas.com / admin");
}

main().finally(() => prisma.$disconnect());
