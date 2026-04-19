import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";
import { PeriodoForm } from "@/modules/fiscal/periodos/ui/periodo-form";

export default async function NuevoPeriodoPage() {
  const tenantId = await getTenantId();
  const empresas = await getEmpresasByTenant(tenantId);
  const empresaActivaId = await getEmpresaActivaId();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/fiscal/periodos" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Crear Período Fiscal</h1>
          <p className="mt-1 text-sm text-zinc-500">
            El código del período se generará automáticamente según empresa, año, mes, impuesto y frecuencia.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <PeriodoForm companies={empresas as any} defaultEmpresaId={empresaActivaId || undefined} />
      </div>
    </div>
  );
}
