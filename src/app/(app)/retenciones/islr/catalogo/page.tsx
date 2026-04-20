import { CatalogoISLRClientService } from "@/modules/retenciones/islr/catalogo/server/catalogo-islr.service";
import { CatalogoISLRTable } from "@/modules/retenciones/islr/catalogo/ui/catalogo-islr-table";
import { CatalogoISLRFilters } from "@/modules/retenciones/islr/catalogo/ui/catalogo-islr-filters";
import { BookOpen, HelpCircle, Calculator } from "lucide-react";
import { UnidadTributariaService } from "@/modules/admin-saas/unidad-tributaria/server/ut.service";

export const metadata = {
  title: "Catálogo ISLR | RetenSaaS",
  description: "Consulta los conceptos y porcentajes de retención de ISLR vigentes.",
};

export default async function CatalogoISLRPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    sujeto?: string; 
    orderBy?: string; 
    orderDir?: 'asc' | 'desc' 
  };
}) {
  const service = new CatalogoISLRClientService();
  const utService = new UnidadTributariaService();

  const [rawConceptos, rawUtVigente] = await Promise.all([
    service.getConceptos({
      search: searchParams.search,
      sujeto: searchParams.sujeto,
      orderBy: searchParams.orderBy,
      orderDir: searchParams.orderDir,
    }),
    utService.getUTByFecha()
  ]);

  // Serialización para Client Components
  const conceptos = rawConceptos.map(c => ({
    ...c,
    baseImponiblePorcentaje: c.baseImponiblePorcentaje ? Number(c.baseImponiblePorcentaje) : null,
    porcentajeRetencion: c.porcentajeRetencion ? Number(c.porcentajeRetencion) : null,
    montoMinimoBs: c.montoMinimoBs ? Number(c.montoMinimoBs) : 0,
    sustraendoBs: c.sustraendoBs ? Number(c.sustraendoBs) : 0,
  }));

  const utVigente = rawUtVigente ? {
    ...rawUtVigente,
    valor: Number(rawUtVigente.valor)
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Catálogo ISLR</h1>
          </div>
          <p className="text-slate-500">Consulta la normativa y porcentajes de retención vigentes.</p>
        </div>

        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-xl shadow-lg shadow-emerald-100 text-white">
                <Calculator className="h-4 w-4" />
                <span className="text-xs font-bold whitespace-nowrap">
                    UT Vigente: Bs. {utVigente ? Number(utVigente.valor).toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '---'}
                </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <HelpCircle className="h-3 w-3" />
                <span>Valores según configuración del administrador</span>
            </div>
        </div>
      </div>

      <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 flex gap-4 items-start">
        <div className="p-2 bg-white rounded-lg shadow-sm">
            <BookOpen className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
            <h3 className="text-sm font-bold text-emerald-900 mb-0.5">Información sobre este catálogo</h3>
            <p className="text-sm text-emerald-800/80 leading-relaxed max-w-3xl">
                Este catálogo muestra los conceptos de retención de ISLR utilizados por el sistema. 
                Los valores y porcentajes aquí presentados son solo informativos y están configurados de acuerdo 
                a la normativa vigente del SENIAT. El sistema utiliza estos datos automáticamente 
                al registrar pagos.
            </p>
        </div>
      </div>

      <CatalogoISLRFilters />
      
      <CatalogoISLRTable conceptos={conceptos} />
    </div>
  );
}
