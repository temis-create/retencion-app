import Link from "next/link";
import { PlusCircle, CreditCard } from "lucide-react";
import { getTenantId, getEmpresaActivaId } from "@/lib/auth";
import { getPagosByTenant } from "@/modules/pagos/server/pago.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function PagosPage() {
  const tenantId = await getTenantId();
  const empresaActivaId = await getEmpresaActivaId();
  const pagos = await getPagosByTenant(tenantId, empresaActivaId || undefined);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Pagos (ISLR)</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Registro de egresos para el cálculo de retenciones de impuesto sobre la renta.
          </p>
        </div>
        <Link
          href="/fiscal/pagos/nuevo"
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Registrar Pago
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
            <tr>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Proveedor</th>
              <th className="px-6 py-4">Monto (Bs.)</th>
              <th className="px-6 py-4">Referencia</th>
              <th className="px-6 py-4">Tipo Evento</th>
              <th className="px-6 py-4">Compras</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {pagos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="h-8 w-8 text-zinc-300" />
                    <p>No se encontraron pagos registrados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {format(new Date(pago.fechaPago), "dd MMM yyyy", { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900">{pago.proveedor.nombre}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">{pago.proveedor.rif}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-zinc-900">
                    {Number(pago.montoTotal).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    {pago.referencia || <span className="text-zinc-300">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      pago.tipoEventoRetencion === "PAGO_EFECTIVO" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {pago.tipoEventoRetencion === "PAGO_EFECTIVO" ? "Pago" : "Abono"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    {pago._count.pagoCompras} docs
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/fiscal/pagos/${pago.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
