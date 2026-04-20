import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getEmpresaById } from "@/modules/empresa/server/empresa.service";
import { EmpresaForm } from "@/modules/empresa/ui/empresa-form";

export default async function EditarEmpresaPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId();
  const empresa = await getEmpresaById(params.id, tenantId);

  if (!empresa) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/empresas/${empresa.id}`} className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Editar Empresa</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Actualiza los datos de <strong className="text-zinc-700">{empresa.nombreFiscal}</strong>
          </p>
        </div>
      </div>

      <EmpresaForm initialData={{
        id: empresa.id,
        nombreFiscal: empresa.nombreFiscal,
        rif: empresa.rif,
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        agenteRetencionIVA: empresa.agenteRetencionIVA,
        agenteRetencionISLR: empresa.agenteRetencionISLR,
        proximoCorrelativoIVA: empresa.parametrosFiscales?.proximoCorrelativoIVA || 1,
        proximoCorrelativoISLR: empresa.parametrosFiscales?.proximoCorrelativoISLR || 1,
      }} />
    </div>
  );
}
