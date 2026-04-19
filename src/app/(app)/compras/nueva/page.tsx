import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CompraForm } from "@/modules/compras/ui/compra-form";

export const metadata = {
  title: "Nueva Compra — RetenSaaS",
  description: "Registrar un nuevo documento de compra vinculado a un período fiscal de IVA.",
};

export default async function NuevaCompraPage() {
  const tenantId = await getTenantId();

  const [empresas, proveedores, tiposDocumento, alicuotas] = await Promise.all([
    prisma.empresa.findMany({
      where: { tenantId, deletedAt: null },
      select: { id: true, nombreFiscal: true },
      orderBy: { nombreFiscal: "asc" },
    }),
    prisma.proveedor.findMany({
      where: { tenantId, deletedAt: null },
      select: { id: true, nombre: true, rif: true, empresaId: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.tipoDocumento.findMany({
      select: { id: true, codigo: true, descripcion: true },
      orderBy: { codigo: "asc" },
    }),
    prisma.alicuotaIVA.findMany({
      where: { activa: true },
      select: { id: true, nombre: true, porcentaje: true },
      orderBy: { porcentaje: "desc" },
    }),
  ]);

  const empresaActivaId = await getEmpresaActivaId();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Nueva Compra</h1>
        <p className="mt-1 text-sm text-zinc-500">
          El sistema asociará automáticamente la compra al período fiscal IVA abierto de la empresa.
        </p>
      </div>

      <CompraForm
        empresas={empresas}
        proveedores={proveedores}
        tiposDocumento={tiposDocumento}
        alicuotas={alicuotas as any}
        comprasDisponibles={[]}
        defaultEmpresaId={empresaActivaId || undefined}
      />
    </div>
  );
}
