import Link from "next/link";
import { Plus } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getComprasByTenant } from "@/modules/compras/server/compra.service";
import { CompraTable } from "@/modules/compras/ui/compra-table";

export const metadata = {
  title: "Compras — RetenSaaS",
  description: "Listado de documentos de compra registrados para gestión de retenciones IVA.",
};

export default async function ComprasPage() {
  const tenantId = await getTenantId();
  const compras = await getComprasByTenant(tenantId);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Compras</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Documentos de compra vinculados a períodos fiscales de IVA.
          </p>
        </div>
        <Link
          href="/compras/nueva"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 active:scale-[0.98] transition-all"
        >
          <Plus className="h-4 w-4" />
          Nueva compra
        </Link>
      </div>

      <CompraTable compras={compras as any} />
    </div>
  );
}
