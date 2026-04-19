import { requireAuth } from "@/lib/auth";
import { ISLRCatalogService } from "@/modules/admin/catalogos/islr/server/islr-catalog-service";
import { ISLRCatalogTable } from "@/modules/admin/catalogos/islr/ui/islr-catalog-table";
import { ISLRCatalogFilters } from "@/modules/admin/catalogos/islr/ui/islr-catalog-filters";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo Global ISLR | Admin",
  description: "Administración del catálogo de conceptos de retención ISLR 2025",
};

interface Props {
  searchParams: {
    search?: string;
    sujeto?: string;
    tipoTarifa?: string;
    activo?: string;
  };
}

export default async function ISLRCatalogPage({ searchParams }: Props) {
  // Asegurar autenticación
  const user = await requireAuth();

  // TODO: Implementar verificación de Rol Administrativo real
  // Por ahora permitimos el acceso si está autenticado para facilitar QA
  // if (user.rol !== 'ADMIN') redirect('/dashboard');

  const conceptos = await ISLRCatalogService.getConceptos({
    search: searchParams.search,
    sujeto: searchParams.sujeto,
    tipoTarifa: searchParams.tipoTarifa,
    activo: searchParams.activo === "true" ? true : searchParams.activo === "false" ? false : undefined,
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Catálogo Global ISLR</h1>
          <p className="text-gray-500 mt-1">
            Gestión centralizada de conceptos de retención ISLR 2025 (UT Bs. 43,00)
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">Global Master</span>
        </div>
      </div>

      <ISLRCatalogFilters />

      <ISLRCatalogTable conceptos={conceptos} />
      
      <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
        <span>Mostrando {conceptos.length} conceptos normativos</span>
        <span>RetenSaaS Admin Framework v1.0</span>
      </div>
    </div>
  );
}
