import { notFound } from "next/navigation";
import Link from "next/link";
import { Receipt, ArrowLeft, Download, Building2, User } from "lucide-react";
import { getTenantId } from "@/lib/auth";
import { getComprobanteIVAById } from "@/modules/retenciones/iva/comprobantes/server/comprobante-iva.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DescargarComprobanteIVAPdfButton } from "@/modules/retenciones/iva/pdf/ui/descargar-comprobante-iva-pdf-button";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Detalle de Comprobante IVA — RetenSaaS",
};

export default async function ComprobanteIVADetailPage({ params }: Props) {
  const tenantId = await getTenantId();
  const comprobante = await getComprobanteIVAById(params.id, tenantId);

  if (!comprobante) {
    notFound();
  }

  const totalBase = comprobante.retencionesIVA.reduce((acc, r) => acc + Number(r.montoBaseSnapshot), 0);
  const totalIVA = comprobante.retencionesIVA.reduce((acc, r) => acc + Number(r.impuestoIVASnapshot), 0);
  const totalRetenido = comprobante.retencionesIVA.reduce((acc, r) => acc + Number(r.montoRetenido), 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/fiscal/comprobantes-iva"
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <Receipt className="h-6 w-6 text-indigo-500" />
              Comprobante N° {comprobante.numeroComprobante}
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Emitido el {format(comprobante.fechaEmision, "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/retenciones/iva/comprobantes/${comprobante.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-200 rounded-md transition-colors"
          >
            <Receipt className="h-4 w-4" />
            Imprimir
          </Link>
          <DescargarComprobanteIVAPdfButton 
            comprobanteId={comprobante.id} 
            numeroComprobante={comprobante.numeroComprobante} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex items-start gap-4">
          <Building2 className="h-6 w-6 text-zinc-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 mb-1">Agente de Retención</h3>
            <p className="font-medium text-zinc-900">{comprobante.empresa.nombreFiscal}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex items-start gap-4">
          <User className="h-6 w-6 text-zinc-400 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 mb-1">Sujeto Retenido</h3>
            <p className="font-medium text-zinc-900">{comprobante.proveedor.nombre}</p>
            <p className="text-sm text-zinc-500">{comprobante.proveedor.rif} — {comprobante.proveedor.tipoResidencia}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <h3 className="text-base font-semibold text-zinc-900">Documentos Retenidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Fecha / Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">N° Control / Factura</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Base Imponible</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">IVA</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">% Ret.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Monto Retenido</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {comprobante.retencionesIVA.map((r) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    <div>{format(new Date(r.compra.fechaFactura), "dd/MM/yyyy")}</div>
                    <div className="font-medium text-zinc-900">{r.compra.tipoDocumento.codigo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 font-mono">
                    <div>Ctrl: {r.compra.numeroControl || "S/N"}</div>
                    <div>Fact: {r.compra.numeroFactura || "S/N"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 text-right font-mono">
                    {Number(r.montoBaseSnapshot).toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 text-right font-mono">
                    {Number(r.impuestoIVASnapshot).toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 text-right font-mono">
                    {Number(r.porcentajeRetencionSnapshot)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-700 text-right font-mono">
                    {Number(r.montoRetenido).toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-zinc-50 border-t border-zinc-200">
              <tr>
                <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900 text-right">
                  TOTALES:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900 text-right font-mono">
                  {totalBase.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-zinc-900 text-right font-mono">
                  {totalIVA.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-indigo-700 text-right font-mono">
                  Bs. {totalRetenido.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
