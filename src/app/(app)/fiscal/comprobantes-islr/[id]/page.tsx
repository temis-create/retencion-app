import { notFound } from "next/navigation";
import Link from "next/link";
import { Receipt, ArrowLeft, Building2, User, CreditCard, Printer } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getComprobanteISLRById } from "@/modules/retenciones/islr/comprobantes/server/comprobante-islr.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DescargarComprobanteISLRPdfButton } from "@/modules/retenciones/islr/pdf/ui/descargar-comprobante-islr-pdf-button";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Detalle Comprobante ISLR — RetenSaaS",
};

export default async function ComprobanteISLRDetailPage({ params }: Props) {
  const tenantId = await getTenantId();
  const comprobante = await getComprobanteISLRById(params.id, tenantId);

  if (!comprobante) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/fiscal/comprobantes-islr"
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Receipt className="h-6 w-6 text-indigo-500" />
              Comprobante ISLR {comprobante.numeroComprobante}
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Emitido el {format(new Date(comprobante.fechaEmision), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DescargarComprobanteISLRPdfButton 
            comprobanteId={comprobante.id} 
            variant="outline"
          />
          <Link
            href={`/retenciones/islr/comprobantes/${comprobante.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-black px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-zinc-800 rounded-lg transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            Vista Imprimible
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex items-start gap-4">
          <Building2 className="h-6 w-6 text-indigo-400 flex-shrink-0" />
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Agente de Retención</h3>
            <p className="font-bold text-zinc-900">{comprobante.empresa.nombreFiscal}</p>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{comprobante.empresa.rif}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex items-start gap-4 border-l-4 border-l-indigo-500">
          <User className="h-6 w-6 text-indigo-500 flex-shrink-0" />
          <div>
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Sujeto Retenido</h3>
            <p className="font-bold text-zinc-900">{comprobante.proveedor.nombre}</p>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">{comprobante.proveedor.rif}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Detalle de Retenciones Incluidas</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
            PERIODO: {comprobante.periodoFiscal.codigoPeriodo}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-zinc-500 uppercase">Pago / Concepto</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-zinc-500 uppercase">Facturas Cubiertas</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-zinc-500 uppercase">Base Cálculo</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-zinc-500 uppercase">Tarifa</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-zinc-500 uppercase">Retenido</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {comprobante.retencionesISLR.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="font-bold text-zinc-900 flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-zinc-400" />
                        {r.pago.referencia || 'S/Ref'}
                    </div>
                    <div className="text-[11px] text-zinc-500 italic mt-0.5">
                        [{r.codigoConceptoSnapshot}] {r.descripcionConceptoSnapshot}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-zinc-600">
                    <ul className="space-y-0.5">
                        {r.pago.pagoCompras.map(pc => (
                            <li key={pc.id}>
                                <span className="font-bold">{pc.compra.tipoDocumento.codigo}</span> {pc.compra.numeroFactura}
                            </li>
                        ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium font-mono">
                    {r.baseCalculoSnapshot.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-zinc-500 font-mono">
                    {(r.tarifaAplicadaSnapshot * 100).toFixed(2)}%
                    {r.sustraendoSnapshot > 0 && (
                        <div className="text-[10px] text-rose-500 font-bold">
                            - Bs. {r.sustraendoSnapshot.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-indigo-700 font-mono">
                    Bs. {r.montoRetenido.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-indigo-50/30 border-t border-zinc-200">
              <tr>
                <td colSpan={4} className="px-6 py-6 text-right text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Monto Total Retenido en este Comprobante
                </td>
                <td className="px-6 py-6 text-right whitespace-nowrap">
                   <span className="text-2xl font-black text-indigo-700 font-mono">
                      Bs. {comprobante.montoTotalRetenido.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                   </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
