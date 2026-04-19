import { getTenantId } from "@/lib/auth";
import { getEmpresasByTenant } from "@/modules/empresa/server/empresa.service";
import { getPeriodosByTenant } from "@/modules/fiscal/periodos/server/periodo-fiscal.service";
import { ExportacionIVAForm } from "@/modules/exportaciones/iva/ui/exportacion-iva-form";
import { ExportacionIVATable } from "@/modules/exportaciones/iva/ui/exportacion-iva-table";
import { ExportacionIVAService } from "@/modules/exportaciones/iva/server/exportacion-iva.service";

interface PageProps {
  searchParams: {
    empresa?: string;
  };
}

export default async function ExportacionIVAPage({ searchParams }: PageProps) {
  const tenantId = await getTenantId();
  const empresas = await getEmpresasByTenant(tenantId);
  
  // Filter only IVA periods
  const allPeriodos = await getPeriodosByTenant(tenantId);
  const periodosIVA = allPeriodos.filter(p => p.tipoImpuesto === "IVA");

  const selectedEmpresaId = searchParams.empresa || empresas[0]?.id;
  
  const history = selectedEmpresaId 
    ? await ExportacionIVAService.getHistorial(selectedEmpresaId, tenantId)
    : [];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 font-outfit">Exportaciones IVA</h2>
          <p className="text-zinc-500">
            Genera y descarga los archivos TXT para la declaracin de retenciones ante el SENIAT.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ExportacionIVAForm 
            empresas={empresas} 
            periodos={periodosIVA} 
          />
        </div>
        
        <div className="lg:col-span-2">
           <div className="mb-4">
             {/* Simple empresa selector for history if needed, 
                 but the form already selects one. 
                 For now we show history of the first or selected one. */}
           </div>
           <ExportacionIVATable records={history as any} />
        </div>
      </div>
    </div>
  );
}
