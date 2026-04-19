"use client";

import { useState, useMemo } from "react";
import { Download, FileText, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { generarExportacionISLRAction } from "../actions/generar-exportacion-islr";

interface Periodo {
  id: string;
  codigoPeriodo: string;
  empresaId: string;
  tipoImpuesto: string;
}

interface Empresa {
  id: string;
  nombreFiscal: string;
}

interface Props {
  empresas: Empresa[];
  periodos: Periodo[];
}

export function ExportacionISLRForm({ empresas, periodos }: Props) {
  const [empresaId, setEmpresaId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [formato, setFormato] = useState<"TXT" | "CSV">("TXT");
  const [loading, setLoading] = useState(false);

  // Filtrar períodos por empresa seleccionada
  const periodosFiltrados = useMemo(() => {
    return periodos.filter(p => !empresaId || p.empresaId === empresaId);
  }, [periodos, empresaId]);

  const handleGenerar = async () => {
    if (!empresaId || !periodoId) {
      toast.error("Por favor seleccione empresa y período.");
      return;
    }

    setLoading(true);
    try {
      const res = await generarExportacionISLRAction({
        empresaId,
        periodoFiscalId: periodoId,
        formato
      });

      if (res.success && res.data) {
        toast.success(res.data.resumen);
        
        // Descargar archivo
        const blob = new Blob([res.data.contenido], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.data.nombre);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        toast.error(res.error || "Error al generar la exportación.");
      }
    } catch (e) {
      toast.error("Error de conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Empresa */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 uppercase tracking-tighter">Empresa Agente</label>
            <select
              value={empresaId}
              onChange={(e) => {
                setEmpresaId(e.target.value);
                setPeriodoId(""); // Reset período al cambiar empresa
              }}
              className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium h-12"
            >
              <option value="">Seleccione una empresa...</option>
              {empresas.map(e => (
                <option key={e.id} value={e.id}>{e.nombreFiscal}</option>
              ))}
            </select>
          </div>

          {/* Periodo */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 uppercase tracking-tighter">Período Fiscal ISLR</label>
            <select
              value={periodoId}
              onChange={(e) => setPeriodoId(e.target.value)}
              disabled={!empresaId}
              className="w-full rounded-xl border-zinc-200 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium h-12 disabled:bg-zinc-50 disabled:text-zinc-400"
            >
              <option value="">{empresaId ? "Seleccione el período..." : "Primero elija empresa"}</option>
              {periodosFiltrados.map(p => (
                <option key={p.id} value={p.id}>{p.codigoPeriodo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Formato */}
        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-tighter">Formato de Salida</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setFormato("TXT")}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                formato === "TXT" 
                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm" 
                : "border-zinc-100 hover:border-zinc-200 text-zinc-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formato === "TXT" ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Texto Plano (TXT)</div>
                  <div className="text-[10px] opacity-70">Delimitado por TAB</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setFormato("CSV")}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                formato === "CSV" 
                ? "border-emerald-600 bg-emerald-50/50 text-emerald-700 shadow-sm" 
                : "border-zinc-100 hover:border-zinc-200 text-zinc-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${formato === "CSV" ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Valores Separados (CSV)</div>
                  <div className="text-[10px] opacity-70">Compatible con Excel</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 p-6 flex items-center justify-between border-t border-zinc-100">
        <div className="flex items-center gap-2 text-zinc-500">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs font-medium italic">Solo se incluirán retenciones CONFIRMADAS con Comprobante.</span>
        </div>
        <button
          onClick={handleGenerar}
          disabled={loading || !empresaId || !periodoId}
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95 shadow-xl shadow-zinc-200"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          {loading ? "Generando..." : "Generar y Descargar"}
        </button>
      </div>
    </div>
  );
}
