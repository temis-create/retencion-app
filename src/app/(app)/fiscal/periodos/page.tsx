import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { getPeriodosByTenant } from "@/modules/fiscal/periodos/server/periodo-fiscal.service";
import { PeriodoTable } from "@/modules/fiscal/periodos/ui/periodo-table";

export default async function PeriodosPage() {
  const tenantId = await getTenantId();
  const empresaActivaId = await getEmpresaActivaId();
  const periodos = await getPeriodosByTenant(tenantId, empresaActivaId || undefined);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Períodos Fiscales</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Controla los tramos temporales de operación fiscal de cada empresa. Required para registrar compras y pagos.
          </p>
        </div>
        <Link
          href="/fiscal/periodos/nuevo"
          className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Nuevo Período
        </Link>
      </div>

      <PeriodoTable periodos={periodos} />
    </div>
  );
}
