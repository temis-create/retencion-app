"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { emitirComprobanteIVAAction } from "../actions/emitir-comprobante-iva";

interface RetencionCandidata {
  id: string;
  porcentajeRetencionSnapshot: any;
  montoBaseSnapshot: any;
  impuestoIVASnapshot: any;
  montoRetenido: any;
  compra: {
    numeroFactura: string | null;
    empresa: { id: string; nombreFiscal: string };
    proveedor: { id: string; nombre: string; rif: string };
  };
  periodoFiscal: {
    codigoPeriodo: string;
  };
}

interface Props {
  retenciones: RetencionCandidata[];
}

function formatMonto(val: any) {
  return Number(val).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function EmitirComprobanteIVAForm({ retenciones }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
    setError(""); // clear error on change
  };

  const handleEmitir = async () => {
    if (selectedIds.size === 0) {
      setError("Debes seleccionar al menos una retención.");
      return;
    }

    // Validación lado del cliente (homogeneidad)
    const selectedList = retenciones.filter((r) => selectedIds.has(r.id));
    const isHomogeneo = selectedList.every(
      (r) =>
        r.compra.empresa.id === selectedList[0].compra.empresa.id &&
        r.compra.proveedor.id === selectedList[0].compra.proveedor.id &&
        r.periodoFiscal.codigoPeriodo === selectedList[0].periodoFiscal.codigoPeriodo
    );

    if (!isHomogeneo) {
      setError("Las retenciones seleccionadas deben pertenecer a la misma empresa, al mismo proveedor y al mismo período fiscal.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const res = await emitirComprobanteIVAAction(Array.from(selectedIds));
    if (!res.success || !res.data) {
      setError(res.error || "Ocurrió un error al emitir el comprobante.");
      setIsSubmitting(false);
    } else {
      router.push(`/fiscal/comprobantes-iva/${res.data.id}`);
      router.refresh();
    }
  };

  const totalASelecionar = retenciones
    .filter((r) => selectedIds.has(r.id))
    .reduce((acc, r) => acc + Number(r.montoRetenido), 0);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
          <h3 className="text-sm font-semibold text-zinc-900">
            Retenciones Cálculadas Disponibles ({retenciones.length})
          </h3>
          <div className="text-sm">
            <span className="text-zinc-500">Seleccionadas: </span>
            <span className="font-semibold text-indigo-600">{selectedIds.size}</span>
          </div>
        </div>

        {retenciones.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No hay retenciones IVA elegibles para emitir comprobante.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Sel.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Empresa / Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Monto Retenido
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-100">
                {retenciones.map((r) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-zinc-50 transition-colors ${
                      selectedIds.has(r.id) ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-mono">
                      {r.compra.numeroFactura || "S/N"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      <div className="font-medium text-zinc-900">{r.compra.empresa.nombreFiscal}</div>
                      <div>{r.compra.proveedor.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 font-mono">
                      {r.periodoFiscal.codigoPeriodo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-zinc-900 font-mono font-medium">
                      Bs. {formatMonto(r.montoRetenido)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200">
        <div>
          <p className="text-sm text-zinc-500">Total Retenido (Seleccionado)</p>
          <p className="text-xl font-bold text-zinc-900 font-mono">
            Bs. {formatMonto(totalASelecionar)}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleEmitir}
            disabled={selectedIds.size === 0 || isSubmitting}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Emitiendo..."
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Emitir Comprobante
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
