import { UnidadTributariaService } from "@/modules/admin-saas/unidad-tributaria/server/ut.service";
import { UTTable } from "@/modules/admin-saas/unidad-tributaria/ui/ut-table";
import { UTTableActions } from "@/modules/admin-saas/unidad-tributaria/ui/ut-table-actions";
import { Calculator, ShieldAlert, History } from "lucide-react";

export const metadata = {
  title: "Gestión de Unidad Tributaria | Admin SaaS",
};

export default async function UnidadTributariaPage() {
  const service = new UnidadTributariaService();
  const rawUnidades = await service.getAll();
  const unidades = rawUnidades.map(u => ({
    ...u,
    valor: Number(u.valor),
  }));
  const utVigente = unidades.find(u => u.activo && !u.fechaFin);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Unidad Tributaria (UT)</h1>
          </div>
          <p className="text-slate-500">Configura los valores históricos y vigentes de la UT para cálculos de ISLR.</p>
        </div>
        <UTTableActions />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Card UT Vigente */}
        <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
            <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">UT Vigente Actual</div>
                <div className="text-4xl font-black mb-2">
                    Bs. {utVigente ? Number(utVigente.valor).toLocaleString('es-VE', { minimumFractionDigits: 2 }) : '---'}
                </div>
                <p className="text-[10px] bg-white/20 rounded-lg px-2 py-1 w-fit font-bold">
                    Desde: {utVigente ? new Date(utVigente.fechaInicio!).toLocaleDateString('es-VE') : 'No definida'}
                </p>
            </div>
            <Calculator className="absolute right-[-10px] bottom-[-10px] h-24 w-24 text-white/10" />
        </div>

        <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4 items-start">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-2">
                <h3 className="font-bold text-amber-900">Importante sobre la UT</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                    La Unidad Tributaria es el pilar para los cálculos del Sustraendo y la Tarifa 2 en el módulo ISLR. 
                    Al registrar una nueva UT, el sistema cerrará automáticamente el periodo de la anterior. 
                    <strong> No modifiques valores históricos</strong> a menos que sea una corrección de error de carga.
                </p>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-700 font-bold px-2">
        <History className="h-5 w-5" />
        <h3>Historial de Valores</h3>
      </div>
      
      <UTTable unidades={unidades} />
    </div>
  );
}
