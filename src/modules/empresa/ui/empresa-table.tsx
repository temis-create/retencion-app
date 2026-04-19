import Link from "next/link";
import { Building2, Search, Edit2 } from "lucide-react";

import { Empresa } from "@prisma/client";

export function EmpresaTable({ empresas }: { empresas: Empresa[] }) {
  if (!empresas || empresas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl p-12 mt-6 border border-dashed border-zinc-300 bg-white">
        <Building2 className="h-10 w-10 text-zinc-300 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900">No hay empresas registradas</h3>
        <p className="mt-1 text-sm text-zinc-500">Comienza agregando la primera empresa de tu organización.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead className="bg-zinc-50">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-zinc-900">Empresa Fiscal</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900">RIF</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden md:table-cell">Teléfono</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden lg:table-cell">Agente IVA</th>
              <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-zinc-900 hidden lg:table-cell">Agente ISLR</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {empresas.map((emp) => (
              <tr key={emp.id} className="hover:bg-zinc-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-primary-600">
                  <Link href={`/empresas/${emp.id}`} className="hover:underline">
                    {emp.nombreFiscal}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">{emp.rif}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 hidden md:table-cell">{emp.telefono || "-"}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm hidden lg:table-cell">
                  {emp.agenteRetencionIVA ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Sí</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">No</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm hidden lg:table-cell">
                  {emp.agenteRetencionISLR ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Sí</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">No</span>
                  )}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/empresas/${emp.id}`} className="text-zinc-400 hover:text-primary-600">
                      <Search className="h-4 w-4" />
                      <span className="sr-only">Ver detalle</span>
                    </Link>
                    <Link href={`/empresas/${emp.id}/editar`} className="text-zinc-400 hover:text-amber-600">
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
