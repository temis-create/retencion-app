import { getTenantId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExportacionIVAForm } from "@/modules/exportaciones/iva/ui/exportacion-iva-form";
import { ExportacionIVATable } from "@/modules/exportaciones/iva/ui/exportacion-iva-table";
import { ExportacionIVAService } from "@/modules/exportaciones/iva/server/exportacion-iva.service";
import { Download, History } from "lucide-react";

export const metadata = {
  title: "Exportaciones Fiscales IVA — RetenSaaS",
};

export default async function ExportacionesIVAPage() {
  const tenantId = await getTenantId();

  // Cargar datos iniciales
  const [empresas, allPeriodos] = await Promise.all([
    prisma.empresa.findMany({ 
      where: { tenantId },
      select: { id: true, nombreFiscal: true, rif: true }
    }),
    prisma.periodoFiscal.findMany({
      where: { tenantId, tipoImpuesto: 'IVA' },
      select: { id: true, codigoPeriodo: true, empresaId: true, anio: true, mes: true },
      orderBy: { fechaInicio: 'desc' }
    })
  ]);

  // Para el historial inicial, tomamos la primera empresa si existe
  const historial = empresas.length > 0 
    ? await ExportacionIVAService.getHistorial(empresas[0].id, tenantId)
    : [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-2xl text-white">
            <Download className="h-8 w-8" />
          </div>
          Exportaciones IVA
        </h1>
        <p className="text-zinc-500 font-medium">
          Genera y descarga los archivos de texto (TXT) de retenciones de IVA requeridos por el SENIAT.
        </p>
      </div>

      {/* Main Form */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
           <span className="w-8 h-[2px] bg-zinc-200"></span>
           Nueva Exportación
        </div>
        <ExportacionIVAForm empresas={empresas} periodos={allPeriodos} />
      </section>

      {/* Historial */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <span className="w-8 h-[2px] bg-zinc-200"></span>
              Historial de Archivos (Empresa Seleccionada)
           </div>
           <History className="h-4 w-4 text-zinc-300" />
        </div>
        <ExportacionIVATable records={historial as any} />
      </section>
    </div>
  );
}
