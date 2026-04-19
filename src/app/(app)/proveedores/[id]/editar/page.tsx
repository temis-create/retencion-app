import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getProveedorById } from "@/modules/proveedores/server/proveedor.service";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";
import { ProveedorForm } from "@/modules/proveedores/ui/proveedor-form";

export default async function EditarProveedorPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId();
  const proveedor = await getProveedorById(params.id, tenantId);

  if (!proveedor) {
    notFound();
  }

  const empresas = await getEmpresasByTenant(tenantId);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/proveedores/${proveedor.id}`} className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Editar Proveedor</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Actualiza los datos de <strong className="text-zinc-700">{proveedor.nombre}</strong>
          </p>
        </div>
      </div>

      <ProveedorForm 
        empresas={empresas}
        initialData={{
          id: proveedor.id,
          empresaId: proveedor.empresaId,
          nombre: proveedor.nombre,
          rif: proveedor.rif,
          tipoPersona: proveedor.tipoPersona,
          tipoResidencia: proveedor.tipoResidencia,
          tipoContribuyente: proveedor.tipoContribuyente,
          porcentajeRetencionIVA: Number(proveedor.porcentajeRetencionIVA) as 75 | 100,
          esAgentePercepcionIVA: proveedor.esAgentePercepcionIVA,
          proveedorMarcadoRetencion100: proveedor.proveedorMarcadoRetencion100,
          rifRegistrado: proveedor.rifRegistrado,
          rubroPercepcionIVA: proveedor.rubroPercepcionIVA || undefined,
        }} 
      />
    </div>
  );
}
