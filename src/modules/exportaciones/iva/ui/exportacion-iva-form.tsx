"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generarExportacionIVAAction } from "../actions/generar-exportacion-iva";
import { Download, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ExportacionIVAFormProps {
  empresas: { id: string; nombreFiscal: string; rif: string }[];
  periodos: { id: string; codigoPeriodo: string; anio: number; mes: number }[];
}

export function ExportacionIVAForm({ empresas, periodos }: ExportacionIVAFormProps) {
  const [empresaId, setEmpresaId] = useState(empresas[0]?.id || "");
  const [periodoId, setPeriodoId] = useState(periodos[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    fileName: string;
    content: string;
    cantidad: number;
    monto: number;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await generarExportacionIVAAction(periodoId, empresaId);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || "Algo sali mal");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          Nueva Exportacin TXT IVA
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Empresa</label>
            <select
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombreFiscal} ({e.rif})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Perodo Fiscal</label>
            <select
              value={periodoId}
              onChange={(e) => setPeriodoId(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-white border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.codigoPeriodo} ({p.anio}-{p.mes.toString().padStart(2, "0")})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleGenerate}
            disabled={loading || !empresaId || !periodoId}
            className="w-full md:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              "Generar Archivo TXT"
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-md space-y-3">
            <div className="flex items-start gap-3 text-emerald-700 font-medium">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p>Archivo generado exitosamente</p>
                <p className="text-xs font-normal text-emerald-600 mt-1">
                  Registros: {result.cantidad} | Monto Total: Bs. {result.monto.toLocaleString()}
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar {result.fileName}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
