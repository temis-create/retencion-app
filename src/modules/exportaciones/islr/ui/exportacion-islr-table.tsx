"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileDown, Calendar, Building2, UserCircle } from "lucide-react";

interface Exportacion {
  id: string;
  fechaGeneracion: Date;
  empresa: { nombreFiscal: string };
  periodoFiscal: { codigoPeriodo: string };
  tipo: string;
  cantidadRegistros: number;
  montoTotal: number | any;
  usuario: { nombre: string | null } | null;
  nombreArchivo: string | null;
}

interface Props {
  exportaciones: Exportacion[];
}

export function ExportacionISLRTable({ exportaciones }: Props) {
  if (exportaciones.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-100 p-12 text-center">
        <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileDown className="h-8 w-8 text-zinc-300" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Sin Historial</h3>
        <p className="text-xs text-zinc-400 mt-1 uppercase font-medium">Aún no se han generado exportaciones ISLR para este tenant.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 text-left">
          <thead className="bg-zinc-50/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fecha / Usuario</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Empresa / Período</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Formato</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Regs.</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Monto Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {exportaciones.map((exp) => (
              <tr key={exp.id} className="hover:bg-zinc-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-zinc-900">
                    {format(new Date(exp.fechaGeneracion), "dd MMM yyyy, HH:mm", { locale: es })}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase mt-0.5">
                    <UserCircle className="h-3 w-3" />
                    {exp.usuario?.nombre || "Sistema"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-700">
                    <Building2 className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                    {exp.empresa.nombreFiscal}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase mt-1">
                    <Calendar className="h-3 w-3" />
                    {exp.periodoFiscal.codigoPeriodo}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded text-[10px] font-black tracking-tighter uppercase ${
                    exp.tipo === 'ISLR_TXT' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {exp.tipo.split('_')[1]}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-zinc-900 font-mono">
                    {exp.cantidadRegistros}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-black text-indigo-700 font-mono">
                    Bs. {Number(exp.montoTotal).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] text-zinc-400 font-bold uppercase hover:text-zinc-600 transition-colors cursor-default truncate max-w-[150px] ml-auto">
                    {exp.nombreArchivo}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
