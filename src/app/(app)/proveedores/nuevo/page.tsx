import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProveedorForm } from "@/modules/proveedores/ui/proveedor-form";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";

export default async function NuevoProveedorPage() {
  const tenantId = await getTenantId();
  const empresas = await getEmpresasByTenant(tenantId);
  const empresaActivaId = await getEmpresaActivaId();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/proveedores" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Registrar Proveedor</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Completa los datos del proveedor y asócialo a una empresa de la organización.
          </p>
        </div>
      </div>

      <ProveedorForm empresas={empresas} defaultEmpresaId={empresaActivaId || undefined} />
    </div>
  );
}
