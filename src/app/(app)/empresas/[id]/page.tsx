import { notFound } from "next/navigation";
import { getTenantId } from "@/lib/auth";
import { getEmpresaById } from "@/modules/empresa/server/empresa.service";
import { EmpresaDetail } from "@/modules/empresa/ui/empresa-detail";

export default async function DetalleEmpresaPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId();
  const empresa = await getEmpresaById(params.id, tenantId);

  if (!empresa) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <EmpresaDetail empresa={empresa} />
    </div>
  );
}
