"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  unidades: any[];
}

export function UTTable({ unidades }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inicio Vigencia</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fin Vigencia</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {unidades.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No hay Unidades Tributarias registradas.
                </td>
              </tr>
            ) : (
              unidades.map((ut) => (
                <tr key={ut.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-lg font-extrabold text-slate-900">Bs. {Number(ut.valor).toLocaleString('es-VE', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">
                        {ut.fechaInicio ? format(new Date(ut.fechaInicio), "dd 'de' MMMM, yyyy", { locale: es }) : '---'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400">
                      {ut.fechaFin 
                        ? format(new Date(ut.fechaFin), "dd 'de' MMMM, yyyy", { locale: es })
                        : <span className="text-emerald-600 font-bold italic">Vigente</span>
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-xs text-slate-500 line-clamp-2">{ut.descripcion || '---'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {ut.activo && !ut.fechaFin ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">VIGENTE</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-slate-200">HISTÓRICO</Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
