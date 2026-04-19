"use client";

import { CheckCircle2, AlertTriangle, X, Loader2, Info, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "success" | "warning" | "info";
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning"
}: Props) {
  if (!isOpen) return null;

  const iconMap = {
    danger: <Trash2 className="w-10 h-10" />,
    success: <CheckCircle2 className="w-10 h-10" />,
    warning: <AlertTriangle className="w-10 h-10" />,
    info: <Info className="w-10 h-10" />
  };

  const bgMap = {
    danger: "bg-rose-50 text-rose-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    info: "bg-indigo-50 text-indigo-600"
  };

  const buttonMap = {
    danger: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
    success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    warning: "bg-black hover:bg-zinc-800 shadow-zinc-200",
    info: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="relative p-8">
          <button 
            onClick={onClose}
            className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-5">
            <div className={cn("w-20 h-20 flex items-center justify-center rounded-3xl", bgMap[variant])}>
              {iconMap[variant]}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed px-2 font-medium">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-3 rounded-2xl border border-zinc-200 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                "px-5 py-3 rounded-2xl text-white text-sm font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2",
                buttonMap[variant]
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white/70" />
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-100 flex justify-center">
           <div className="h-1.5 w-12 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
