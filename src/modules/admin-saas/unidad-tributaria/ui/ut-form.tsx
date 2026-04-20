"use client";

import { useState } from "react";
import { createUTAction } from "../actions/ut.actions";
import { toast } from "sonner";

export function UTForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createUTAction(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Nueva Unidad Tributaria registrada");
      onClose();
    } else {
      toast.error(result.error || "Ocurrió un error");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="font-bold">Nueva Unidad Tributaria</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Valor (Bs.)</label>
            <input
              name="valor"
              type="number"
              step="0.01"
              required
              placeholder="Ej: 43.00"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Fecha de Inicio de Vigencia</label>
            <input
              name="fechaInicio"
              type="date"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Descripción / Gaceta</label>
            <textarea
              name="descripcion"
              placeholder="Ej: Gaceta Oficial N° 42.123..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-24"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Guardar UT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
