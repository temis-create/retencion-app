import Link from "next/link";
import { ShoppingCart, Search, Edit2 } from "lucide-react";
import { Compra, EstadoCompra } from "@prisma/client";

type CompraJoined = Compra & {
  empresa: { nombreFiscal: string };
  proveedor: { nombre: string; rif: string };
  tipoDocumento: { codigo: string; descripcion: string };
  periodoFiscal: { codigoPeriodo: string; estado: string };
};

const estadoBadge: Record<EstadoCompra, { label: string; className: string }> = {
  REGISTRADA: {
    label: "Registrada",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  },
  ANULADA: {
    label: "Anulada",
    className: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  },
};

function formatMonto(val: any) {
  return Number(val).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatFecha(date: Date | string) {
  return new Date(date).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function CompraTable({ compras }: { compras: CompraJoined[] }) {
  if (!compras || compras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl p-12 mt-6 border border-dashed border-zinc-300 bg-white">
        <ShoppingCart className="h-10 w-10 text-zinc-300 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900">No hay compras registradas</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Registra la primera compra para comenzar a gestionar retenciones de IVA.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-zinc-900">
                Documento
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden md:table-cell">
                Empresa
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900">
                Proveedor
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden lg:table-cell">
                Fecha
              </th>
              <th scope="col" className="px-3 py-3.5 text-right text-xs font-semibold text-zinc-900">
                Total
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden lg:table-cell">
                Período
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900">
                Estado
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {compras.map((compra) => {
              const badge = estadoBadge[compra.estado];
              return (
                <tr key={compra.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                    <div className="flex flex-col">
                      <Link
                        href={`/compras/${compra.id}`}
                        className="font-medium text-primary-600 hover:underline"
                      >
                        {compra.numeroFactura || "—"}
                      </Link>
                      <span className="text-xs text-zinc-400 font-mono">
                        {compra.tipoDocumento.codigo} · #{compra.numeroControl || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 hidden md:table-cell">
                    {compra.empresa.nombreFiscal}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900">{compra.proveedor.nombre}</span>
                      <span className="text-xs text-zinc-400 font-mono">{compra.proveedor.rif}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 hidden lg:table-cell">
                    {formatFecha(compra.fechaFactura)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-mono font-medium text-zinc-900">
                    {formatMonto(compra.totalFactura)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm hidden lg:table-cell">
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      {compra.periodoFiscal.codigoPeriodo}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/compras/${compra.id}`}
                        className="text-zinc-400 hover:text-primary-600"
                        title="Ver detalle"
                      >
                        <Search className="h-4 w-4" />
                        <span className="sr-only">Ver detalle</span>
                      </Link>
                      <Link
                        href={`/compras/${compra.id}/editar`}
                        className="text-zinc-400 hover:text-amber-600"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
