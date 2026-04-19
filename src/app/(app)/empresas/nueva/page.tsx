import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmpresaForm } from "@/modules/empresa/ui/empresa-form";

export default function NuevaEmpresaPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/empresas" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Registrar Empresa</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Completa los datos de la nueva empresa agente de retención.
          </p>
        </div>
      </div>

      <EmpresaForm />
    </div>
  );
}
