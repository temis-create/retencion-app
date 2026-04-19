import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExportacionISLRForm } from "@/modules/exportaciones/islr/ui/exportacion-islr-form";
import { ExportacionISLRTable } from "@/modules/exportaciones/islr/ui/exportacion-islr-table";
import { getHistorialExportacionesISLR } from "@/modules/exportaciones/islr/server/exportacion-islr.service";
import { FileDown, History } from "lucide-react";

export const metadata = {
  title: "Exportaciones Fiscales ISLR — RetenSaaS",
};

export default async function DeclaracionesISLRPage() {
  const tenantId = await getTenantId();

  // Cargar datos para el formulario
  const [empresas, periodos, historial] = await Promise.all([
    prisma.empresa.findMany({ 
      where: { tenantId },
      select: { id: true, nombreFiscal: true }
    }),
    prisma.periodoFiscal.findMany({
      where: { tenantId, tipoImpuesto: 'ISLR' },
      select: { id: true, codigoPeriodo: true, empresaId: true, tipoImpuesto: true },
      orderBy: { fechaInicio: 'desc' }
    }),
    getHistorialExportacionesISLR(tenantId)
  ]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-2xl text-white">
            <FileDown className="h-8 w-8" />
          </div>
          Generar Declaración ISLR
        </h1>
        <p className="text-zinc-500 font-medium">
          Exporte las retenciones confirmadas en archivos compatibles para su declaración administrativa o fiscal.
        </p>
      </div>

      {/* Main Form */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
           <span className="w-8 h-[2px] bg-zinc-200"></span>
           Configuración de Exportación
        </div>
        <ExportacionISLRForm empresas={empresas} periodos={periodos} />
      </section>

      {/* Historial */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="w-8 h-[2px] bg-zinc-200"></span>
              Historial de Archivos Generados
           </div>
           <History className="h-4 w-4 text-zinc-300" />
        </div>
        <ExportacionISLRTable exportaciones={historial} />
      </section>
    </div>
  );
}
