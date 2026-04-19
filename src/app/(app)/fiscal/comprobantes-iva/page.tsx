import Link from "next/link";
import { Receipt, FileText, Plus, Printer, FileDown } from "lucide-react";
import { DescargarComprobanteIVAPdfButton } from "@/modules/retenciones/iva/pdf/ui/descargar-comprobante-iva-pdf-button";
import { getTenantId } from "@/lib/auth";
import { getComprobantesIVAByTenant } from "@/modules/retenciones/iva/comprobantes/server/comprobante-iva.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const metadata = {
  title: "Comprobantes de IVA — RetenSaaS",
};

export default async function ComprobantesIVAPage() {
  const tenantId = await getTenantId();
  const comprobantes = await getComprobantesIVAByTenant(tenantId);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-indigo-500" />
            Comprobantes de Retención IVA
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Historial de comprobantes de retención emitidos.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/fiscal/comprobantes-iva/emitir"
            className="inline-flex items-center gap-2 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            Emitir Comprobante
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-zinc-300">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900">
                      N° Comprobante
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Emisión
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Empresa
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Proveedor
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900">
                      Retenciones
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {comprobantes.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 font-mono">
                        {c.numeroComprobante}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {format(c.fechaEmision, "dd MMM yyyy", { locale: es })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {c.empresa.nombreFiscal}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {c.proveedor.nombre}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                          {c._count.retencionesIVA} doc(s)
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                        <Link
                          href={`/fiscal/comprobantes-iva/${c.id}`}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Ver Detalle"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/retenciones/iva/comprobantes/${c.id}/print`}
                          target="_blank"
                          className="text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 transition-colors"
                          title="Imprimir"
                        >
                          <Printer className="h-4 w-4" />
                        </Link>
                        <DescargarComprobanteIVAPdfButton 
                           comprobanteId={c.id} 
                           variant="ghost" 
                           showText={false}
                           className="px-2"
                        />
                      </td>
                    </tr>
                  ))}
                  {comprobantes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-zinc-500">
                        No hay comprobantes emitidos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
