import { getCurrentUser, getEmpresaActivaId } from "@/lib/auth";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";
import { EmpresaSelector } from "@/modules/empresa/ui/empresa-selector";

export async function DashboardHeader() {
  const user = await getCurrentUser();
  if (!user) return null;

  const empresas = await getEmpresasByTenant(user.tenantId);
  const empresaActivaId = await getEmpresaActivaId();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-zinc-900">
          Hola, {user?.name?.split(" ")[0]}
        </h1>
        <div className="h-6 w-[1px] bg-zinc-200 mx-2" />
        <EmpresaSelector 
          empresas={empresas} 
          empresaActivaId={empresaActivaId} 
        />
      </div>
      
      <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
        Org: {user.tenantId.slice(0, 8)}...
      </div>
    </header>
  );
}
