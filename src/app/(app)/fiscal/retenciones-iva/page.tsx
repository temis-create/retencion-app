import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getTenantId } from "@/lib/auth";
import { getRetencionesIVA } from "@/modules/retenciones/iva/server/retencion-iva.service";
import Link from "next/link";
import { Receipt, Eye, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Retenciones IVA — RetenSaaS",
};

export default async function RetencionesIVAPage() {
  const tenantId = await getTenantId();
  const retenciones = await getRetencionesIVA(tenantId);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Retenciones de IVA</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Listado histórico de todas las retenciones de IVA calculadas.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Fecha Fac.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Proveedor / Factura</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Base Imponible</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Monto Retenido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Comprobante</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-100">
              {retenciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 italic">
                    No hay retenciones de IVA registradas aún.
                  </td>
                </tr>
              ) : (
                retenciones.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {format(new Date(r.compra.fechaFactura), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900">{r.compra.proveedor.nombre}</div>
                      <div className="text-xs text-zinc-500 font-mono">{r.compra.tipoDocumento.codigo}: {r.compra.numeroFactura || "S/N"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 text-right font-mono">
                      {Number(r.montoBaseSnapshot).toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-700 text-right font-mono">
                      {Number(r.montoRetenido).toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${
                        r.estado === "CALCULADA" 
                          ? "bg-blue-50 text-blue-700 ring-blue-600/20" 
                          : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      }`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {r.comprobanteIVA ? (
                        <Link 
                          href={`/fiscal/comprobantes-iva/${r.comprobanteIVA.id}`}
                          className="flex items-center gap-1 text-indigo-600 hover:underline font-mono"
                        >
                          <Receipt className="h-3 w-3" />
                          {r.comprobanteIVA.numeroComprobante}
                        </Link>
                      ) : (
                        <span className="text-zinc-400 italic text-xs">Pendiente</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/compras/${r.compraId}`}
                        className="text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1"
                        title="Ver Compra"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
