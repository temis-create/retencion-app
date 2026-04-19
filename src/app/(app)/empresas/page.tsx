import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";
import { EmpresaTable } from "@/modules/empresa/ui/empresa-table";

export default async function EmpresasPage() {
  const tenantId = await getTenantId();
  const empresas = await getEmpresasByTenant(tenantId);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Empresas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestiona las organizaciones o sucursales que operan en este Tenant.
          </p>
        </div>
        <Link 
          href="/empresas/nueva"
          className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Nueva Empresa
        </Link>
      </div>

      <EmpresaTable empresas={empresas} />
    </div>
  );
}
