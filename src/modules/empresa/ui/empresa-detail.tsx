import Link from "next/link";
import { ArrowLeft, Building2, Edit2, Calendar, FileText } from "lucide-react";

type EmpresaWithParams = {
  id: string;
  nombreFiscal: string;
  rif: string;
  direccion?: string | null;
  telefono?: string | null;
  agenteRetencionIVA: boolean;
  agenteRetencionISLR: boolean;
  createdAt: Date;
  updatedAt: Date;
  parametrosFiscales: {
    proximoCorrelativoIVA: number;
    proximoCorrelativoISLR: number;
    reinicioCorrelativoMensual: boolean;
  } | null;
};

export function EmpresaDetail({ empresa }: { empresa: EmpresaWithParams }) {
  if (!empresa) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/empresas" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-primary-100 text-primary-700 rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{empresa.nombreFiscal}</h1>
              <p className="text-sm text-zinc-500">{empresa.rif}</p>
            </div>
          </div>
        </div>
        
        <Link 
          href={`/empresas/${empresa.id}/editar`}
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all"
        >
          <Edit2 className="h-4 w-4 text-zinc-500" />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Información General</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-zinc-500">Dirección</dt>
                <dd className="mt-1 text-sm text-zinc-900">{empresa.direccion || "No especificada"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Teléfono</dt>
                <dd className="mt-1 text-sm text-zinc-900">{empresa.telefono || "No especificado"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">ID de Empresa</dt>
                <dd className="mt-1 text-xs text-zinc-500 font-mono">{empresa.id}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-zinc-400" />
              Parámetros Fiscales Actuales
            </h2>
            {empresa.parametrosFiscales ? (
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Próx. Correlativo IVA</dt>
                  <dd className="mt-2 text-2xl font-semibold text-zinc-900">{empresa.parametrosFiscales.proximoCorrelativoIVA}</dd>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Próx. Correlativo ISLR</dt>
                  <dd className="mt-2 text-2xl font-semibold text-zinc-900">{empresa.parametrosFiscales.proximoCorrelativoISLR}</dd>
                </div>
                <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                  <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Reinicio Mensual</dt>
                  <dd className="mt-2 text-sm font-medium text-zinc-900">
                    {empresa.parametrosFiscales.reinicioCorrelativoMensual ? "Sí" : "No"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-zinc-500 italic">No hay parámetros fiscales registrados.</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Configuración Retenciones</h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0 pb-0">
                <span className="text-sm text-zinc-600">Agente Retención IVA</span>
                {empresa.agenteRetencionIVA ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Activo</span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">Inactivo</span>
                )}
              </li>
              <li className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0 pb-0">
                <span className="text-sm text-zinc-600">Agente Retención ISLR</span>
                {empresa.agenteRetencionISLR ? (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Activo</span>
                ) : (
                  <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">Inactivo</span>
                )}
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
             <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Tiempos
            </h2>
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-zinc-500">Fecha de Creación</span>
                <span className="block mt-1 text-sm text-zinc-900">{new Date(empresa.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-zinc-500">Última Actualización</span>
                <span className="block mt-1 text-sm text-zinc-900">{new Date(empresa.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
