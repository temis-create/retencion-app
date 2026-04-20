"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  HelpCircle, 
  X, 
  Calculator, 
  Info,
  ShieldAlert
} from "lucide-react";

interface Props {
  concepto: any;
  onClose: () => void;
}

export function CatalogoISLRDetail({ concepto, onClose }: Props) {
  const formatBs = (val: any) => {
    return Number(val).toLocaleString('es-VE', { minimumFractionDigits: 2 });
  };

  const getSujetoFull = (s: string) => {
    const map: any = {
      PNR: "Persona Natural Residente",
      PNNR: "Persona Natural No Residente",
      PJD: "Persona Jurídica Domiciliada",
      PJND: "Persona Jurídica No Domiciliada",
    };
    return map[s] || s;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Detalle del Concepto</h3>
              <p className="text-xs text-slate-500 font-mono">{concepto.codigoSeniat || 'Sin código'} · Art: {concepto.numeral}{concepto.literal ? ` - ${concepto.literal}` : ''}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-200 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Concepto Principal */}
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 underline decoration-emerald-500/30 underline-offset-4">Concepto Normativo</div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                {concepto.concepto}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">{getSujetoFull(concepto.sujeto)}</Badge>
                {concepto.requiereCalculoEspecial && <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100 text-[10px]">Cálculo Especial</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                        <Info className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Base Imponible</div>
                        <div className="text-sm font-bold text-slate-800">{Number(concepto.baseImponiblePorcentaje)}% del monto</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                        <Calculator className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Tarifa / %</div>
                        <div className="text-sm font-bold text-slate-800">
                            {concepto.tipoTarifa === 'TARIFA_2' ? 'Escala Progresiva' : `${Number(concepto.porcentajeRetencion)}% Directo`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                        <Calculator className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Mínimo</div>
                        <div className="text-sm font-bold text-slate-800">
                            {concepto.montoMinimoBs > 0 ? `Bs. ${formatBs(concepto.montoMinimoBs)}` : 'N/A'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                        <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Sustraendo</div>
                        <div className="text-sm font-bold text-slate-800">
                            {concepto.sustraendoBs > 0 ? `Bs. ${formatBs(concepto.sustraendoBs)}` : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase mb-2">
                <HelpCircle className="h-4 w-4 text-emerald-500" />
                Guía de aplicación
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
                Este concepto aplica a pagos por <strong>{concepto.concepto.toLowerCase()}</strong>. 
                Se calcula el {Number(concepto.baseImponiblePorcentaje)}% del monto bruto. 
                {concepto.tipoTarifa === 'PROPORCIONAL' 
                    ? ` Se aplica el ${Number(concepto.porcentajeRetencion)}% de retención.`
                    : ` Se aplica la Tarifa 2.`}
                {concepto.sustraendoBs > 0 && ` Se resta el sustraendo de Bs. ${formatBs(concepto.sustraendoBs)}.`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white font-bold">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
