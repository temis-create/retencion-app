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

  // Seed Unidad Tributaria (Historial y Vigente)
  const uts = [
    {
      valor: 9.00,
      fechaInicio: new Date("2024-05-01"), // Valor anterior referencial
      fechaFin: new Date("2025-06-01"),
      descripcion: "Providencia Administrativa SENIAT/2024/0001 (Referencial)",
      activo: false
    },
    {
      valor: 43.00,
      fechaInicio: new Date("2025-06-02"),
      fechaFin: null,
      descripcion: "Gaceta Oficial N° 43.140 (Incremento 377.78%)",
      activo: true
    }
  ];

  for (const utData of uts) {
    const existeUt = await prisma.unidadTributaria.findFirst({
        where: { valor: utData.valor, fechaInicio: utData.fechaInicio }
    });
    if (!existeUt) {
        await prisma.unidadTributaria.create({ data: utData });
    }
  }
  console.log("Historial de Unidad Tributaria actualizado.");

  // 1. Seed Planes (SaaS)
  const planes = [
    { codigo: "BRONCE", nombre: "Plan Bronce (Demo)", limiteEmpresas: 1, precioReferencial: 0 },
    { codigo: "PLATA", nombre: "Plan Plata", limiteEmpresas: 5, precioReferencial: 49.99 },
    { codigo: "ORO", nombre: "Plan Oro (Enterprise)", limiteEmpresas: 50, precioReferencial: 149.99 },
  ];

  for (const plan of planes) {
    await prisma.plan.upsert({
      where: { codigo: plan.codigo },
      update: {
        limiteEmpresas: plan.limiteEmpresas,
        precioReferencial: plan.precioReferencial
      },
      create: plan,
    });
  }
  console.log("Catálogo de Planes actualizado.");

  const planBronce = await prisma.plan.findUnique({ where: { codigo: "BRONCE" } });

  // 1. Crear Organización (Tenant)
  const tenant = await prisma.organizacion.upsert({
    where: { rif: "J-00000000-0" },
    update: {
        planId: planBronce?.id,
        limiteEmpresas: planBronce?.limiteEmpresas,
        fechaInicioPlan: new Date()
    },
    create: {
      id: "737c865c-5287-47ef-939d-95a1157a9054",
      nombre: "RetenSaaS Demo",
      rif: "J-00000000-0",
      emailContacto: "contacto@retensaas.com",
      planId: planBronce?.id,
      limiteEmpresas: planBronce?.limiteEmpresas,
      fechaInicioPlan: new Date()
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

  // 3. Crear Rol Admin Aplicación
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

  // 4. Crear Usuario Administrador (SUPERADMIN SaaS)
  const hashedPassword = await bcrypt.hash("admin", 10);
  const emailAdmin = "admin@retensaas.com";
  
  const adminUser = await prisma.usuario.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: emailAdmin } },
    update: { 
        rolGlobal: "SUPERADMIN",
        activo: true 
    },
    create: {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        email: emailAdmin,
        nombre: "Admin Demo",
        passwordHash: hashedPassword,
        tenantId: tenant.id,
        rolGlobal: "SUPERADMIN",
        activo: true,
    }
  });

  console.log(`Usuario superadmin SaaS listo: ${adminUser.email}`);

  // 4b. Crear Usuario QA (Usuario regular)
  const emailQA = "qa@retensaas.com";
  await prisma.usuario.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: emailQA } },
    update: { 
        rolGlobal: "USUARIO",
        activo: true 
    },
    create: {
        email: emailQA,
        nombre: "QA Tester",
        passwordHash: hashedPassword,
        tenantId: tenant.id,
        rolGlobal: "USUARIO",
        activo: true,
    }
  });

  // 5. Asignar Rol Operativo al admin
  await prisma.asignacionRol.upsert({
    where: {
        usuarioId_rolId_empresaId: {
            usuarioId: adminUser.id,
            rolId: rolAdmin.id,
            empresaId: empresa.id,
        }
    },
    update: {},
    create: {
        usuarioId: adminUser.id,
        rolId: rolAdmin.id,
        empresaId: empresa.id,
    }
  });

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
