import Link from "next/link";
import { CalendarClock, Eye } from "lucide-react";
import { PeriodoFiscal } from "@prisma/client";

type PeriodoJoined = PeriodoFiscal & {
  empresa?: { nombreFiscal: string; id: string };
};

export function PeriodoTable({ periodos }: { periodos: PeriodoJoined[] }) {
  if (!periodos || periodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl p-12 mt-6 border border-dashed border-zinc-300 bg-white">
        <CalendarClock className="h-10 w-10 text-zinc-300 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900">No hay períodos fiscales creados</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Crea el primer período para comenzar a registrar compras y pagos.
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
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-zinc-900">Código</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden md:table-cell">Empresa</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900">Impuesto</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden lg:table-cell">Frecuencia</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden lg:table-cell">Rango</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900">Estado</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {periodos.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-mono font-medium text-primary-600">
                  <Link href={`/fiscal/periodos/${p.id}`} className="hover:underline">
                    {p.codigoPeriodo}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 hidden md:table-cell">
                  {p.empresa?.nombreFiscal || "-"}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    p.tipoImpuesto === "IVA"
                      ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                      : "bg-purple-50 text-purple-700 ring-purple-600/20"
                  }`}>
                    {p.tipoImpuesto}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 hidden lg:table-cell">
                  {p.frecuencia}{p.subperiodo ? ` (Q${p.subperiodo})` : ""}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-xs text-zinc-500 hidden lg:table-cell">
                  {p.fechaInicio ? new Date(p.fechaInicio).toLocaleDateString() : "—"}
                  {" › "}
                  {p.fechaFin ? new Date(p.fechaFin).toLocaleDateString() : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  {p.estado === "ABIERTO" ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      ● Abierto
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
                      ✕ Cerrado
                    </span>
                  )}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <Link href={`/fiscal/periodos/${p.id}`} className="text-zinc-400 hover:text-primary-600">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver detalle</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
