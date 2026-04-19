import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { getProveedoresByTenant } from "@/modules/proveedores/server/proveedor.service";
import { ProveedorTable } from "@/modules/proveedores/ui/proveedor-table";

export default async function ProveedoresPage() {
  const tenantId = await getTenantId();
  const empresaActivaId = await getEmpresaActivaId();
  const proveedores = await getProveedoresByTenant(tenantId, empresaActivaId || undefined);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Proveedores</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestiona los terceros sujetos a operaciones de compra y retención.
          </p>
        </div>
        <Link 
          href="/proveedores/nuevo"
          className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Nuevo Proveedor
        </Link>
      </div>

      <ProveedorTable proveedores={proveedores} />
    </div>
  );
}
