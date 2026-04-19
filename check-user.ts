import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function check() {
  const email = "admin@retensaas.com";
  const user = await prisma.usuario.findFirst({
    where: { email },
  });

  if (!user) {
    console.log(`Usuario ${email} NO encontrado.`);
    return;
  }

  console.log(`Usuario ${email} encontrado.`);
  console.log(`Activo: ${user.activo}`);
  
  const isValid = await bcrypt.compare("Admin123456*", user.passwordHash);
  console.log(`¿Password 'Admin123456*' es válido?: ${isValid}`);
}

check().finally(() => prisma.$disconnect());
