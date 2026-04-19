import { Receipt, AlertCircle, Printer, FileDown } from "lucide-react";
import Link from "next/link";
import { DescargarComprobanteIVAPdfButton } from "@/modules/retenciones/iva/pdf/ui/descargar-comprobante-iva-pdf-button";

interface RetencionIVA {
  id: string;
  estado: string;
  porcentajeRetencionSnapshot: number | string;
  montoBaseSnapshot: number | string;
  impuestoIVASnapshot: number | string;
  montoRetenido: number | string;
  comprobanteIVAId?: string | null;
  comprobanteIVA?: { id: string; numeroComprobante: string } | null;
}

interface Props {
  retencionIVA?: RetencionIVA | null;
}

function formatMonto(val: number | string) {
  return Number(val).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3 border-b border-zinc-100 last:border-0">
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="text-sm text-zinc-900">{value}</dd>
    </div>
  );
}

export function RetencionIVACard({ retencionIVA }: Props) {
  if (!retencionIVA) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 text-center h-full flex flex-col items-center justify-center">
        <Receipt className="h-8 w-8 text-zinc-300 mb-3" />
        <h3 className="text-sm font-semibold text-zinc-700">Sin retención IVA</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          No se ha calculado o no aplica retención de IVA para este documento.
        </p>
      </div>
    );
  }

  const estaComprometida = !!retencionIVA.comprobanteIVAId;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
        <div className="flex items-center gap-2.5">
          <Receipt className="h-5 w-5 text-indigo-500" />
          <h2 className="text-base font-semibold text-zinc-900">
            Retención de IVA
          </h2>
        </div>
        <span
          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ${
            retencionIVA.estado === "CALCULADA"
              ? "bg-blue-50 text-blue-700 ring-blue-600/20"
              : retencionIVA.estado === "CONFIRMADA"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
              : "bg-red-50 text-red-700 ring-red-600/20"
          }`}
        >
          {retencionIVA.estado}
        </span>
      </div>

      <div className="px-6 py-4 flex-1 flex flex-col">
        {estaComprometida && (
          <div className="mb-4 bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-indigo-700 font-medium">
                Retención incluida en comprobante
              </p>
            </div>
            <div className="pl-6.5 text-sm text-indigo-600 flex flex-col gap-2">
              <p>
                Pertenece al Comprobante N°{" "}
                {retencionIVA.comprobanteIVA ? (
                  <a
                    href={`/fiscal/comprobantes-iva/${retencionIVA.comprobanteIVA.id}`}
                    className="font-mono font-bold hover:underline"
                  >
                    {retencionIVA.comprobanteIVA.numeroComprobante}
                  </a>
                ) : (
                  <span className="font-mono font-bold">DESCONOCIDO</span>
                )}
                . No puede ser recalculada automáticamente.
              </p>
              
              {retencionIVA.comprobanteIVAId && (
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/retenciones/iva/comprobantes/${retencionIVA.comprobanteIVAId}/print`}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 transition-colors w-full"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Vista Impresión
                  </Link>
                  <DescargarComprobanteIVAPdfButton 
                    comprobanteId={retencionIVA.comprobanteIVAId}
                    numeroComprobante={retencionIVA.comprobanteIVA?.numeroComprobante}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <dl className="space-y-0 flex-1">
          <Row label="Porcentaje retenido" value={`${Number(retencionIVA.porcentajeRetencionSnapshot)}%`} />
          <Row label="Base imponible" value={<span className="font-mono">{formatMonto(retencionIVA.montoBaseSnapshot)}</span>} />
          <Row label="IVA base" value={<span className="font-mono">{formatMonto(retencionIVA.impuestoIVASnapshot)}</span>} />
        </dl>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200">
          <span className="text-sm font-semibold text-zinc-700">Monto retenido</span>
          <span className="text-lg font-bold text-indigo-700 font-mono">
            {formatMonto(retencionIVA.montoRetenido)}
          </span>
        </div>
      </div>
    </div>
  );
}
