import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedConceptosISLR } from "./seeds/seed-conceptos-islr";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando Seed...");

  // Nota: Se elimina la limpieza destructiva (deleteMany) para preservar
  // los datos operativos de Compras, Proveedores, etc.
  // El seed ahora es 100% idempotente mediante upserts.

  // Seed Catálogos Globales (TipoDocumento)
  const tiposDocs = [
    { codigo: "FAC", descripcion: "Factura" },
    { codigo: "NC", descripcion: "Nota de Crédito" },
    { codigo: "ND", descripcion: "Nota de Débito" },
  ];

  for (const tipo of tiposDocs) {
    await prisma.tipoDocumento.upsert({
      where: { codigo: tipo.codigo },
      update: {},
      create: tipo,
    });
  }
  console.log("Catálogo TipoDocumento actualizado.");

  // Seed Catálogo Global (AlicuotaIVA)
  const alicuotas = [
    { nombre: "General (16%)", porcentaje: 16.00, fechaDesde: new Date("2020-01-01") },
    { nombre: "Reducida (8%)", porcentaje: 8.00, fechaDesde: new Date("2020-01-01") },
  ];

  for (const alicuota of alicuotas) {
    const existe = await prisma.alicuotaIVA.findFirst({
      where: { porcentaje: alicuota.porcentaje }
    });
    if (!existe) {
      await prisma.alicuotaIVA.create({ data: alicuota });
    }
  }
  console.log("Catálogo AlicuotaIVA actualizado.");

  // Seed Catálogo ISLR 2025 (desde archivo especializado)
  await seedConceptosISLR();


  // 1. Crear Organización (Tenant)
  const tenant = await prisma.organizacion.upsert({
    where: { rif: "J-00000000-0" },
    update: {},
    create: {
      id: "737c865c-5287-47ef-939d-95a1157a9054",
      nombre: "RetenSaaS Demo",
      rif: "J-00000000-0",
      emailContacto: "contacto@retensaas.com",
    },
  });

  console.log(`Organización lista: ${tenant.nombre}`);

  // 2. Crear Empresa operativa
  const empresa = await prisma.empresa.upsert({
    where: { 
      tenantId_rif: {
        tenantId: tenant.id,
        rif: "J-99999999-9"
      }
    },
    update: {},
    create: {
      id: "6c99810f-3e16-42ac-a96c-1604972daf10",
      tenantId: tenant.id,
      nombreFiscal: "RetenSaaS Operaciones C.A.",
      rif: "J-99999999-9",
      direccion: "Caracas, Venezuela",
      agenteRetencionIVA: true,
      agenteRetencionISLR: true,
    },
  });

  console.log(`Empresa lista: ${empresa.nombreFiscal}`);

  // 2.5 Crear ParametroFiscal
  const parametroFiscal = await prisma.parametroFiscal.upsert({
    where: { empresaId: empresa.id },
    update: {},
    create: {
      empresaId: empresa.id,
      proximoCorrelativoIVA: 1,
      reinicioCorrelativoMensual: false,
    },
  });
  console.log(`Parámetros Fiscales listos para: ${empresa.nombreFiscal}`);

  // 3. Crear Rol Admin
  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: "ADMINISTRADOR" },
    update: {},
    create: {
      nombre: "ADMINISTRADOR",
      descripcion: "Acceso total al sistema",
      permisos: {
        all: true,
      },
    },
  });

  // 4. Crear Usuario Administrador
  const hashedPassword = await bcrypt.hash("admin", 10);
  const emailAdmin = "admin@retensaas.com";
  
  let user = await prisma.usuario.findFirst({
    where: { 
      email: emailAdmin, 
      tenantId: tenant.id 
    }
  });

  if (!user) {
    user = await prisma.usuario.create({
      data: {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        email: emailAdmin,
        nombre: "Admin Demo",
        passwordHash: hashedPassword,
        tenantId: tenant.id,
        activo: true,
      },
    });
  }

  console.log(`Usuario admin creado: ${user.email}`);

  // 5. Asignar Rol
  const asignacion = await prisma.asignacionRol.findFirst({
    where: {
      usuarioId: user.id,
      rolId: rolAdmin.id,
      empresaId: empresa.id,
    }
  });

  if (!asignacion) {
    await prisma.asignacionRol.create({
      data: {
        usuarioId: user.id,
        rolId: rolAdmin.id,
        empresaId: empresa.id,
      },
    });
  }

  console.log("Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
