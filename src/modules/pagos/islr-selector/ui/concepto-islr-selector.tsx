"use client";

import { useState, useEffect } from "react";
import { CONCEPTOS_ISLR_UI_AGRUPADOS } from "../server/concepto-islr-ui";
import { resolverConceptoISLRAction } from "../actions/resolver-concepto-islr";
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  proveedorId: string;
  onResolved: (conceptoTecnicoId: number | null) => void;
  defaultValue?: string;
  error?: string;
}

export function ConceptoISLRSelector({ proveedorId, onResolved, defaultValue, error }: Props) {
  const [selectedUIId, setSelectedUIId] = useState<string>(defaultValue || "");
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionError, setResolutionError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Cada vez que cambie la selección amigable O el proveedor, resolvemos el técnico
  useEffect(() => {
    if (!selectedUIId || !proveedorId) {
       onResolved(null);
       setIsConfirmed(false);
       setResolutionError(null);
       return;
    }

    const resolve = async () => {
      setIsResolving(true);
      setIsConfirmed(false);
      setResolutionError(null);
      
      try {
        const res = await resolverConceptoISLRAction({
          conceptoUIId: selectedUIId,
          proveedorId
        });

        if (res.success && res.conceptoTecnicoId) {
          onResolved(res.conceptoTecnicoId);
          setIsConfirmed(true);
        } else {
          onResolved(null);
          setResolutionError(res.error || "No se pudo mapear este concepto.");
        }
      } catch (err) {
        setResolutionError("Error de comunicación al resolver concepto.");
      } finally {
        setIsResolving(false);
      }
    };

    resolve();
  }, [selectedUIId, proveedorId]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                Operación Económica (ISLR)
                <Sparkles className="h-3 w-3 text-indigo-500" />
            </label>
            <p className="text-[10px] text-zinc-400 font-medium">
                Selecciona la actividad. El sistema aplicará la ley según el proveedor.
            </p>
        </div>
        {isResolving && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
             <Loader2 className="h-3 w-3 animate-spin" />
             Resolviendo...
          </div>
        )}
        {isConfirmed && !isResolving && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
             <CheckCircle2 className="h-3 w-3" />
             Mapeado Correctamente
          </div>
        )}
      </div>

      <div className="relative">
        <select
          value={selectedUIId}
          onChange={(e) => setSelectedUIId(e.target.value)}
          disabled={!proveedorId}
          className={cn(
            "w-full border rounded-md px-3 py-2.5 text-sm transition-all focus:ring-2 focus:ring-indigo-500/20 outline-none",
            !proveedorId ? "bg-zinc-50 cursor-not-allowed opacity-60" : "bg-white",
            error || resolutionError ? "border-red-300 ring-4 ring-red-500/5" : "border-zinc-300",
            isConfirmed && "border-emerald-200 bg-emerald-50/10"
          )}
        >
          <option value="">-- Seleccione tipo de operación --</option>
          {Object.entries(CONCEPTOS_ISLR_UI_AGRUPADOS).map(([categoria, conceptos]) => (
            <optgroup key={categoria} label={categoria}>
              {conceptos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {(!proveedorId) && (
        <p className="text-[10px] text-amber-600 italic flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Primero debe seleccionar un proveedor para habilitar el selector.
        </p>
      )}

      {(resolutionError || error) && (
        <p className="text-xs text-red-600 font-medium flex items-start gap-1.5 mt-1 bg-red-50 p-2 rounded border border-red-100">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          {resolutionError || error}
        </p>
      )}

      {isConfirmed && !isResolving && (
          <p className="text-[10px] text-zinc-500 italic mt-1">
            El sistema ha detectado automáticamente el sujeto legal y la tarifa aplicable.
          </p>
      )}
    </div>
  );
}
