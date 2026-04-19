import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugTenants() {
  console.log("--- ORGANIZACIONES ---");
  const orgs = await prisma.organizacion.findMany();
  console.table(orgs.map(o => ({ id: o.id, nombre: o.nombre, rif: o.rif })));

  console.log("\n--- USUARIOS ---");
  const users = await prisma.usuario.findMany({
    include: {
      tenant: true
    }
  });
  console.table(users.map(u => ({ 
    id: u.id, 
    email: u.email, 
    tenantId: u.tenantId, 
    tenantExists: !!u.tenant 
  })));

  console.log("\n--- EMPRESAS ---");
  const empresas = await prisma.empresa.findMany({
    include: {
      tenant: true
    }
  });
  console.table(empresas.map(e => ({ 
    id: e.id, 
    nombre: e.nombreFiscal, 
    tenantId: e.tenantId, 
    tenantExists: !!e.tenant 
  })));
}

debugTenants()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
