"use client";

import { CheckCircle2, AlertTriangle, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function EmisionConfirmacionModal({ isOpen, onClose, onConfirm, loading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative p-6">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-full">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-zinc-900 font-outfit">Emisión del Comprobante Fiscal</h1>
              <p className="text-sm text-zinc-500 leading-relaxed px-4">
                Estás a punto de generar el documento legal definitivo ante el SENIAT. 
                <span className="block mt-2 font-medium text-amber-600 flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Esta acción bloqueará cualquier recálculo fiscal posterior.
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Confirmar Emisión"
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-zinc-50 px-6 py-3 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest font-medium">
            Proceso transaccional bloqueante
          </p>
        </div>
      </div>
    </div>
  );
}
