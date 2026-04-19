import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";
import { getProveedoresByTenant } from "@/modules/proveedores/server/proveedor.service";
import { getConceptosISLR } from "@/modules/pagos/server/pago.service";
import { PagoForm } from "@/modules/pagos/ui/pago-form";

export default async function NuevoPagoPage() {
  const tenantId = await getTenantId();
  const empresaActivaId = await getEmpresaActivaId();

  const [empresas, proveedores, conceptosISLR] = await Promise.all([
    getEmpresasByTenant(tenantId),
    getProveedoresByTenant(tenantId),
    getConceptosISLR(),
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/fiscal/pagos" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Registrar Pago ISLR</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Los pagos generan el evento base para las retenciones de ISLR (Pago o Abono en Cuenta).
          </p>
        </div>
      </div>

      <PagoForm 
        empresas={empresas} 
        proveedores={proveedores} 
        conceptosISLR={conceptosISLR as any}
        defaultEmpresaId={empresaActivaId || undefined}
      />
    </div>
  );
}
