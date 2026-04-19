import { PrismaClient, TipoPersona, TipoResidencia, TipoContribuyente, TipoImpuesto, FrecuenciaPeriodo, EstadoPeriodoFiscal, NaturalezaIVA, EstadoCompra } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando Seed QA Motor IVA v2...");

  // 1. Organizacin de Prueba
  const tenant = await prisma.organizacion.upsert({
    where: { rif: "J-99999999-1" },
    update: {},
    create: {
      id: "qa-tenant-iva-id",
      nombre: "QA Retenciones IVA",
      rif: "J-99999999-1",
      emailContacto: "qa@retensaas.com",
    },
  });

  // 2. Empresa Operativa Principal
  const empresa = await prisma.empresa.upsert({
    where: { 
      tenantId_rif: {
        tenantId: tenant.id,
        rif: "J-11111111-1"
      }
    },
    update: {},
    create: {
      id: "qa-empresa-iva-id",
      tenantId: tenant.id,
      nombreFiscal: "Empresa QA IVA, C.A.",
      rif: "J-11111111-1",
      agenteRetencionIVA: true,
      agenteRetencionISLR: false,
    },
  });

  // 3. Parmetros Fiscales
  await prisma.parametroFiscal.upsert({
    where: { empresaId: empresa.id },
    update: {},
    create: {
      empresaId: empresa.id,
      proximoCorrelativoIVA: 1,
      proximoCorrelativoISLR: 1,
      reinicioCorrelativoMensual: true,
    },
  });

  // 4. Perodos Fiscales
  const periodoAbierto = await prisma.periodoFiscal.upsert({
    where: { 
      empresaId_tipoImpuesto_codigoPeriodo: {
        empresaId: empresa.id,
        tipoImpuesto: TipoImpuesto.IVA,
        codigoPeriodo: "2026-04-IVA-M",
      }
    },
    update: {},
    create: {
      id: "qa-periodo-abierto-id",
      tenantId: tenant.id,
      empresaId: empresa.id,
      anio: 2026,
      mes: 4,
      tipoImpuesto: TipoImpuesto.IVA,
      frecuencia: FrecuenciaPeriodo.MENSUAL,
      codigoPeriodo: "2026-04-IVA-M",
      estado: EstadoPeriodoFiscal.ABIERTO,
      fechaInicio: new Date("2026-04-01"),
      fechaFin: new Date("2026-04-30"),
    },
  });

  await prisma.periodoFiscal.upsert({
    where: { 
      empresaId_tipoImpuesto_codigoPeriodo: {
        empresaId: empresa.id,
        tipoImpuesto: TipoImpuesto.IVA,
        codigoPeriodo: "2026-03-IVA-M",
      }
    },
    update: {},
    create: {
      id: "qa-periodo-cerrado-id",
      tenantId: tenant.id,
      empresaId: empresa.id,
      anio: 2026,
      mes: 3,
      tipoImpuesto: TipoImpuesto.IVA,
      frecuencia: FrecuenciaPeriodo.MENSUAL,
      codigoPeriodo: "2026-03-IVA-M",
      estado: EstadoPeriodoFiscal.CERRADO,
      fechaInicio: new Date("2026-03-01"),
      fechaFin: new Date("2026-03-31"),
      fechaCierre: new Date("2026-04-01"),
    },
  });

  // 5. Proveedores
  const proveedoresData = [
    {
      id: "qa-prov-ord-75",
      nombre: "Proveedor Ordinario 75",
      rif: "J-30000000-1",
      tipoContribuyente: TipoContribuyente.ORDINARIO,
      porcentajeRetencionIVA: 75,
      esAgentePercepcionIVA: false,
      proveedorMarcadoRetencion100: false,
      rifRegistrado: true,
    },
    {
      id: "qa-prov-ord-100",
      nombre: "Proveedor Ordinario 100",
      rif: "J-30000000-2",
      tipoContribuyente: TipoContribuyente.ORDINARIO,
      porcentajeRetencionIVA: 100,
      esAgentePercepcionIVA: false,
      proveedorMarcadoRetencion100: true,
      rifRegistrado: true,
    },
    {
      id: "qa-prov-formal",
      nombre: "Proveedor Formal",
      rif: "J-30000000-3",
      tipoContribuyente: TipoContribuyente.FORMAL,
      porcentajeRetencionIVA: 0,
      esAgentePercepcionIVA: false,
      proveedorMarcadoRetencion100: false,
      rifRegistrado: true,
    },
    {
      id: "qa-prov-sin-rif",
      nombre: "Proveedor Sin RIF Registrado",
      rif: "J-30000000-4",
      tipoContribuyente: TipoContribuyente.ORDINARIO,
      porcentajeRetencionIVA: 75,
      esAgentePercepcionIVA: false,
      proveedorMarcadoRetencion100: false,
      rifRegistrado: false,
    },
    {
      id: "qa-prov-percepcion",
      nombre: "Proveedor Percepcin Tabaco",
      rif: "J-30000000-5",
      tipoContribuyente: TipoContribuyente.ORDINARIO,
      porcentajeRetencionIVA: 75,
      esAgentePercepcionIVA: true,
      rubroPercepcionIVA: "TABACO",
      rifRegistrado: true,
    },
  ];

  for (const prov of proveedoresData) {
    await prisma.proveedor.upsert({
      where: { empresaId_rif: { empresaId: empresa.id, rif: prov.rif } },
      update: prov,
      create: {
        ...prov,
        tenantId: tenant.id,
        empresaId: empresa.id,
        tipoPersona: TipoPersona.JURIDICA,
        tipoResidencia: TipoResidencia.DOMICILIADO,
      },
    });
  }

  // 6. Tipos de Documento (asegurar)
  const fac = await prisma.tipoDocumento.upsert({
    where: { codigo: "01" },
    update: {},
    create: { codigo: "01", descripcion: "Factura" },
  });

  // 7. Alicuota (asegurar)
  await prisma.alicuotaIVA.upsert({
    where: { id: "qa-alicuota-general" },
    update: {},
    create: { 
        id: "qa-alicuota-general",
        nombre: "General QA", 
        porcentaje: 16, 
        fechaDesde: new Date("2020-01-01") 
    },
  });

  // 8. Compras
  const comprasData = [
    {
      id: "qa-comp-ret-75",
      proveedorId: "qa-prov-ord-75",
      numeroFactura: "FACT-75",
      montoBase: 1000,
      impuestoIVA: 160,
      totalFactura: 1160,
      naturalezaIVA: NaturalezaIVA.GRAVADA,
      desc: "Caso estndar retencin 75%",
    },
    {
      id: "qa-comp-formal",
      proveedorId: "qa-prov-formal",
      numeroFactura: "FACT-FORMAL",
      montoBase: 1000,
      impuestoIVA: 160,
      totalFactura: 1160,
      naturalezaIVA: NaturalezaIVA.GRAVADA,
      desc: "Exclusin por proveedor formal",
    },
    {
      id: "qa-comp-exenta",
      proveedorId: "qa-prov-ord-75",
      numeroFactura: "FACT-EXENTA",
      montoBase: 0,
      montoExento: 1000,
      impuestoIVA: 0,
      totalFactura: 1000,
      naturalezaIVA: NaturalezaIVA.EXENTA,
      desc: "Exclusin por operacin exenta",
    },
    {
      id: "qa-comp-viatico",
      proveedorId: "qa-prov-ord-75",
      numeroFactura: "FACT-VIATICO",
      montoBase: 500,
      impuestoIVA: 80,
      totalFactura: 580,
      esViatico: true,
      desc: "Exclusin por viticos",
    },
    {
      id: "qa-comp-100-no-disc",
      proveedorId: "qa-prov-ord-75",
      numeroFactura: "FACT-100-NODISC",
      montoBase: 1000,
      impuestoIVA: 160,
      totalFactura: 1160,
      ivaDiscriminado: false,
      desc: "Retencin 100% por IVA no discriminado",
    },
    {
      id: "qa-comp-100-invalido",
      proveedorId: "qa-prov-ord-75",
      numeroFactura: "FACT-100-INV",
      montoBase: 1000,
      impuestoIVA: 160,
      totalFactura: 1160,
      cumpleRequisitosFormales: false,
      desc: "Retencin 100% por documento invlido",
    },
    {
      id: "qa-comp-100-prov-marcado",
      proveedorId: "qa-prov-ord-100",
      numeroFactura: "FACT-100-PROV",
      montoBase: 1000,
      impuestoIVA: 160,
      totalFactura: 1160,
      desc: "Retencin 100% por proveedor marcado",
    },
    {
        id: "qa-comp-100-sin-rif",
        proveedorId: "qa-prov-sin-rif",
        numeroFactura: "FACT-100-SINRIF",
        montoBase: 1000,
        impuestoIVA: 160,
        totalFactura: 1160,
        desc: "Retencin 100% por proveedor sin RIF",
    },
    {
        id: "qa-comp-100-art2",
        proveedorId: "qa-prov-ord-75",
        numeroFactura: "FACT-100-ART2",
        montoBase: 1000,
        impuestoIVA: 160,
        totalFactura: 1160,
        esOperacionArticulo2RetencionTotal: true,
        desc: "Retencin 100% por operacin Art 2",
    }
  ];

  for (const c of comprasData) {
    const { desc, ...data } = c;
    await prisma.compra.upsert({
      where: { id: c.id },
      update: data as any,
      create: {
        ...data,
        tenantId: tenant.id,
        empresaId: empresa.id,
        tipoDocumentoId: fac.id,
        periodoFiscalId: periodoAbierto.id,
        fechaFactura: new Date("2026-04-15"),
        montoExento: (data as any).montoExento || 0,
        estado: EstadoCompra.REGISTRADA,
        porcentajeAlicuotaSnapshot: 16,
      } as any,
    });
  }

  // 9. Usuario QA
  const hashedPassword = await bcrypt.hash("qa123", 10);
  const qaUser = await prisma.usuario.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "qa@retensaas.com" } },
    update: {},
    create: {
      id: "qa-user-id",
      tenantId: tenant.id,
      nombre: "QA Engineer",
      email: "qa@retensaas.com",
      passwordHash: hashedPassword,
      activo: true,
    },
  });

  // 10. Rol y Asignacin
  const rolAdmin = await prisma.rol.findFirst({ where: { nombre: "ADMINISTRADOR" } });
  if (rolAdmin) {
    await prisma.asignacionRol.upsert({
      where: { 
        usuarioId_rolId_empresaId: {
            usuarioId: qaUser.id,
            rolId: rolAdmin.id,
            empresaId: empresa.id,
        }
      },
      update: {},
      create: {
        usuarioId: qaUser.id,
        rolId: rolAdmin.id,
        empresaId: empresa.id,
      },
    });
  }

  console.log("✅ Seed QA IVA v2 completado. Usuario: qa@retensaas.com / qa123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
