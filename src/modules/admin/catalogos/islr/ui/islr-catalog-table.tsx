"use client";

import { useState } from "react";
import { ISLRCatalogForm } from "./islr-catalog-form";
import { toggleConceptoActivoAction } from "../actions/islr-catalog-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  conceptos: any[];
}

export function ISLRCatalogTable({ conceptos }: Props) {
  const [editingConcepto, setEditingConcepto] = useState<any | null>(null);

  const handleToggleActivo = async (id: number) => {
    try {
      const result = await toggleConceptoActivoAction(id);
      if (result.success) {
        toast.success("Estado actualizado");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Error al cambiar estado");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cód / Num</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Concepto</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sujeto</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Base %</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Tarifa</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Mínimo / Sustr.</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Estado</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {conceptos.map((c) => (
              <tr 
                key={c.id} 
                className={cn(
                  "hover:bg-blue-50/30 transition-colors group",
                  !c.activo && "opacity-60 grayscale-[0.5]"
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-blue-600">{c.codigoSeniat || '---'}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{c.numeral}{c.literal ? ` - ${c.literal}` : ''}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 line-clamp-1">{c.concepto}</span>
                    {c.requiereCalculoEspecial && (
                      <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-700 w-fit uppercase">
                        Cálculo Especial
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold border",
                    c.sujeto === 'PNR' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                    c.sujeto === 'PJD' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    "bg-gray-100 text-gray-600 border-gray-200"
                  )}>
                    {c.sujeto}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-gray-600">
                    {c.baseImponiblePorcentaje ? `${Number(c.baseImponiblePorcentaje)}%` : '---'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm">
                  {c.tipoTarifa === "TARIFA_2" ? (
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">TARIFA 2</span>
                  ) : (
                    <span className="font-semibold text-gray-700">{Number(c.porcentajeRetencion)}%</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-gray-700">Min: {Number(c.montoMinimoBs).toLocaleString('es-VE')}</span>
                    <span className="text-[10px] text-gray-400">Sus: {Number(c.sustraendoBs).toLocaleString('es-VE')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleToggleActivo(c.id)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-200",
                      c.activo ? "bg-green-500" : "bg-gray-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                      c.activo ? "right-1" : "left-1"
                    )} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditingConcepto(c)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Editar concepto"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {conceptos.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-medium">No se encontraron conceptos con los filtros aplicados</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingConcepto && (
        <ISLRCatalogForm
          concepto={editingConcepto}
          onClose={() => setEditingConcepto(null)}
        />
      )}
    </div>
  );
}
