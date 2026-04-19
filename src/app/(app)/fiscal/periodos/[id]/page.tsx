import { notFound } from "next/navigation";
import { getTenantId } from "@/lib/auth";
import { getPeriodoById } from "@/modules/fiscal/periodos/server/periodo-fiscal.service";
import { PeriodoDetail } from "@/modules/fiscal/periodos/ui/periodo-detail";

export default async function DetallePeriodoPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId();
  const periodo = await getPeriodoById(params.id, tenantId);

  if (!periodo) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PeriodoDetail periodo={periodo as any} />
    </div>
  );
}
