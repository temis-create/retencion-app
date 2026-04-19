import Link from "next/link";
import { Calculator, FileCheck, AlertCircle, FileDown, Printer, Info } from "lucide-react";
import { DescargarComprobanteISLRPdfButton } from "../pdf/ui/descargar-comprobante-islr-pdf-button";
import { CalcularRetencionISLRButton } from "./calcular-retencion-islr-button";

import { EmitirComprobanteISLRButton } from "../comprobantes/ui/emitir-comprobante-islr-button";

import { cn } from "@/lib/utils";
import { getISLRLabel } from "../ux/islr-messages";

interface Props {
  pagoId: string;
  retencion: any | null; // Sanitized RetencionISLR o null
  periodoCerrado: boolean;
}

export function RetencionISLRCard({ pagoId, retencion, periodoCerrado }: Props) {
  const msg = getISLRLabel(retencion?.motivoCodigo);

  if (!retencion) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden border-dashed">
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100">
            <Calculator className="h-6 w-6 text-zinc-400" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900">Sin Retención ISLR</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">
              Aún no se ha calculado la retención ISLR para este pago.
            </p>
          </div>
          <CalcularRetencionISLRButton pagoId={pagoId} disabled={periodoCerrado} />
          {periodoCerrado && (
            <p className="text-[10px] text-amber-600 font-medium">
              El periodo fiscal está cerrado. No se permiten cálculos.
            </p>
          )}
        </div>
      </div>
    );
  }

  const yaTieneComprobante = !!retencion.comprobanteISLRId;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-100">
                <FileCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="font-bold text-zinc-900 text-sm">Retención ISLR</h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          retencion.estado === "CALCULADA" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"
        }`}>
          {retencion.estado}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start border-b border-zinc-50 pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Concepto</span>
            <span className="text-[11px] font-medium text-zinc-900 text-right max-w-[150px] leading-tight">
              <span className="text-indigo-600 font-bold block">[{retencion.codigoConceptoSnapshot}]</span>
              {retencion.descripcionConceptoSnapshot}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-50 pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Base Cálculo</span>
            <span className="text-[11px] font-bold text-zinc-900 tabular-nums">
              Bs. {retencion.baseCalculoSnapshot?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-50 pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Tarifa</span>
            <span className="text-[11px] font-bold text-indigo-600">
              {Number(retencion.tarifaAplicadaSnapshot).toFixed(2)}%
            </span>
          </div>
          {Number(retencion.sustraendoSnapshot) > 0 && (
            <div className="flex justify-between items-center border-b border-zinc-50 pb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Sustraendo</span>
              <span className="text-[11px] font-medium text-rose-600 tabular-nums font-mono">
                - Bs. {retencion.sustraendoSnapshot?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
        </div>

        <div className={cn(
            "p-3 rounded-lg border",
            msg.variant === 'success' ? "bg-emerald-50/30 border-emerald-100" : 
            msg.variant === 'warning' ? "bg-amber-50/30 border-amber-100" :
            msg.variant === 'error' ? "bg-red-50/30 border-red-100" :
            "bg-indigo-50/30 border-indigo-100"
        )}>
            <div className="flex items-center justify-between mb-1">
                <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    msg.variant === 'success' ? "text-emerald-500" : 
                    msg.variant === 'warning' ? "text-amber-500" :
                    msg.variant === 'error' ? "text-red-500" :
                    "text-indigo-400"
                )}>Total Retenido</p>
                <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                    msg.variant === 'success' ? "bg-emerald-100 text-emerald-700" : 
                    msg.variant === 'warning' ? "bg-amber-100 text-amber-700" :
                    msg.variant === 'error' ? "bg-red-100 text-red-700" :
                    "bg-indigo-100 text-indigo-700"
                )}>
                    {msg.title}
                </span>
            </div>
            <p className={cn(
                "text-xl font-black tabular-nums",
                msg.variant === 'success' ? "text-emerald-700" : 
                msg.variant === 'warning' ? "text-amber-700" :
                msg.variant === 'error' ? "text-red-700" :
                "text-indigo-700"
            )}>
                Bs. {retencion.montoRetenido?.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </p>
            <p className={cn(
              "text-[9px] mt-2 italic leading-tight border-t pt-1.5",
              msg.variant === 'success' ? "text-emerald-500/70 border-emerald-100" :
              msg.variant === 'warning' ? "text-amber-500/70 border-amber-100" :
              msg.variant === 'error' ? "text-red-500/70 border-red-100" :
              "text-indigo-400 border-indigo-100"
            )}>
              {msg.explanation}
            </p>
        </div>

        {retencion.baseLegalArticulo && (
          <div className="px-1 text-[9px] text-zinc-400 flex items-center gap-1">
            <Info className="h-3 w-3" />
            <span>Base Legal: {retencion.baseLegalArticulo}</span>
          </div>
        )}

        {yaTieneComprobante ? (
            <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5" />
                    <div className="text-[10px] text-emerald-700 leading-tight">
                        <p className="font-medium">Comprobante Emitido:</p>
                        <Link 
                           href={`/fiscal/comprobantes-islr/${retencion.comprobanteISLRId}`}
                           className="font-bold underline hover:text-emerald-900 transition-colors"
                        >
                           {retencion.comprobanteISLR?.numeroComprobante || 'Ver Detalle'}
                        </Link>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`/retenciones/islr/comprobantes/${retencion.comprobanteISLRId}/print`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold transition-all"
                    >
                        <Printer className="h-3.5 w-3.5" />
                        Imprimir
                    </Link>
                    <DescargarComprobanteISLRPdfButton 
                        comprobanteId={retencion.comprobanteISLRId} 
                        variant="secondary"
                        showText={false}
                        className="flex-none px-3"
                    />
                </div>
            </div>
        ) : (
            <div className="pt-2 flex flex-col gap-2">
                <EmitirComprobanteISLRButton 
                    retencionIds={[retencion.id]} 
                    pagoId={pagoId} 
                    disabled={periodoCerrado}
                />
                <CalcularRetencionISLRButton pagoId={pagoId} disabled={periodoCerrado} />
            </div>
        )}
      </div>
    </div>
  );
}
