import Link from "next/link";
import { ArrowLeft, CreditCard, Building2, Users, FileText, Calendar, Landmark } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getPagoById } from "@/modules/pagos/server/pago.service";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getRetencionISLRByPago } from "@/modules/retenciones/islr/server/retencion-islr.service";
import { RetencionISLRCard } from "@/modules/retenciones/islr/ui/retencion-islr-card";

export default async function PagoDetailPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId();
  const pago = await getPagoById(params.id, tenantId);

  if (!pago) notFound();

  const retencion = await getRetencionISLRByPago(params.id);
  const periodoCerrado = pago.periodoFiscal.estado === "CERRADO";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/fiscal/pagos" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Detalle de Pago</h1>
          <p className="mt-1 text-sm text-zinc-500 font-mono text-xs">ID: {pago.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card Principal */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-zinc-900">Información del Pago</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                pago.tipoEventoRetencion === "PAGO_EFECTIVO" 
                  ? "bg-emerald-100 text-emerald-700" 
                  : "bg-amber-100 text-amber-700"
              }`}>
                {pago.tipoEventoRetencion === "PAGO_EFECTIVO" ? "Pago Efectivo" : "Abono en Cuenta"}
              </span>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fecha de Pago</p>
                <div className="flex items-center gap-2 font-medium text-zinc-900">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  {format(new Date(pago.fechaPago), "PPP", { locale: es })}
                </div>
              </div>
              <div className="space-y-1 border-l border-zinc-100 pl-6">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Monto Total</p>
                <p className="text-2xl font-black text-indigo-600">
                  Bs. {Number(pago.montoTotal).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Referencia</p>
                <p className="text-sm font-medium text-zinc-900">{pago.referencia || "Sin referencia"}</p>
              </div>
              <div className="space-y-1 border-l border-zinc-100 pl-6">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Concepto Retención ISLR</p>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-zinc-400 mt-0.5" />
                  <p className="text-sm font-medium text-zinc-900">
                    <span className="text-indigo-600 font-bold">[{pago.conceptoISLR.codigoSeniat}]</span> {pago.conceptoISLR.concepto}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Listado de Documentos Aplicados */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-zinc-900">Documentos (Facturas) Cubiertos</h3>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500">
                    <tr>
                        <th className="px-6 py-3 font-medium">Documento</th>
                        <th className="px-6 py-3 font-medium">Fecha Factura</th>
                        <th className="px-6 py-3 font-medium text-right">Total Factura</th>
                        <th className="px-6 py-3 font-medium text-right text-indigo-600">Monto Aplicado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {pago.pagoCompras.map(pc => (
                        <tr key={pc.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="font-bold text-zinc-700">{pc.compra.tipoDocumento.codigo}</span> {pc.compra.numeroFactura}
                            </td>
                            <td className="px-6 py-4 text-zinc-500">
                                {format(new Date(pc.compra.fechaFactura), "dd/MM/yyyy")}
                            </td>
                            <td className="px-6 py-4 text-right tabular-nums">
                                {Number(pc.compra.totalFactura).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-indigo-600 tabular-nums">
                                {Number(pc.montoAplicado).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-zinc-50/50">
                    <tr className="font-bold text-zinc-900">
                        <td colSpan={3} className="px-6 py-4 text-right uppercase tracking-wider text-[10px]">Suma Total Aplicada</td>
                        <td className="px-6 py-4 text-right tabular-nums text-lg underline decoration-indigo-300 decoration-2 underline-offset-4">
                            Bs. {Number(pago.montoTotal).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                </tfoot>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <RetencionISLRCard 
            pagoId={pago.id} 
            retencion={retencion} 
            periodoCerrado={periodoCerrado} 
          />

          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partes Involucradas</h4>
              
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Emisor (Empresa)</p>
                  <p className="text-sm font-bold text-zinc-900 leading-tight">{pago.empresa.nombreFiscal}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Proveedor</p>
                  <p className="text-sm font-bold text-zinc-900 leading-tight">{pago.proveedor.nombre}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{pago.proveedor.rif}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Información de Sistema</h4>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                        Este pago está vinculado al período fiscal <strong>{pago.periodoFiscal.codigoPeriodo}</strong>.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
