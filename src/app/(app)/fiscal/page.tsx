import Link from "next/link";
import { CalendarDays, ChevronRight, FileText, Receipt, Download } from "lucide-react";

export const metadata = {
  title: "Fiscal — RetenSaaS",
};

export default function FiscalPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Módulo Fiscal</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Gestión de períodos fiscales, parámetros y exportaciones tributarias.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Períodos fiscales */}
        <Link
          href="/fiscal/periodos"
          className="group flex items-start gap-4 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
              Períodos Fiscales
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Abre, consulta y cierra períodos de IVA e ISLR por empresa.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 mt-0.5 transition-colors" />
        </Link>

        {/* Retenciones IVA */}
        <Link
          href="/fiscal/retenciones-iva"
          className="group flex items-start gap-4 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
              Retenciones IVA
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Consulta el histórico de cálculos de retención detallados.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 mt-0.5 transition-colors" />
        </Link>

        {/* Comprobantes IVA */}
        <Link
          href="/fiscal/comprobantes-iva"
          className="group flex items-start gap-4 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Receipt className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
              Comprobantes IVA
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Listado de comprobantes emitidos y herramientas de impresión.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 mt-0.5 transition-colors" />
        </Link>

        {/* Exportaciones IVA */}
        <Link
          href="/fiscal/exportaciones-iva"
          className="group flex items-start gap-4 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-900 group-hover:text-indigo-600 transition-colors">
              Exportaciones IVA
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Genera los archivos TXT mensuales para el SENIAT.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-500 mt-0.5 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
