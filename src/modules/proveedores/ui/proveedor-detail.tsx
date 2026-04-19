import Link from "next/link";
import { ArrowLeft, Users, Edit2, Calendar, ShieldCheck, Building2 } from "lucide-react";

type ProveedorDetailParams = {
  id: string;
  nombre: string;
  rif: string;
  tipoPersona: string;
  tipoResidencia: string;
  tipoContribuyente: string;
  porcentajeRetencionIVA: string | number;
  esAgentePercepcionIVA: boolean;
  rubroPercepcionIVA: string | null;
  proveedorMarcadoRetencion100: boolean;
  rifRegistrado: boolean;
  rifValidadoPortalFiscalAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  empresa: {
    nombreFiscal: string;
  };
};

export function ProveedorDetail({ proveedor }: { proveedor: ProveedorDetailParams }) {
  if (!proveedor) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/proveedores" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-primary-100 text-primary-700 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{proveedor.nombre}</h1>
              <p className="text-sm text-zinc-500 font-mono mt-0.5">{proveedor.rif}</p>
            </div>
          </div>
        </div>
        
        <Link 
          href={`/proveedores/${proveedor.id}/editar`}
          className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all"
        >
          <Edit2 className="h-4 w-4 text-zinc-500" />
          Editar
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-zinc-400" />
              Categorización Fiscal SENIAT
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Tipo de Persona</dt>
                <dd className="mt-2 text-sm font-semibold text-zinc-900">{proveedor.tipoPersona}</dd>
              </div>
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Tipo Residencia</dt>
                <dd className="mt-2 text-sm font-semibold text-zinc-900">{proveedor.tipoResidencia}</dd>
              </div>
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Contribuyente</dt>
                <dd className="mt-2 text-sm font-semibold text-zinc-900">{proveedor.tipoContribuyente}</dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
             <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-zinc-400" />
              Vínculo Operativo
            </h2>
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-zinc-500">Empresa de Asignación</span>
                <span className="block mt-1 text-sm text-zinc-900 font-medium">{proveedor.empresa?.nombreFiscal || "No asociada"}</span>
              </div>
              <div className="pt-2">
                 <p className="text-xs text-zinc-500 border-l-2 border-primary-200 pl-3">
                   Las compras y retenciones de este proveedor se cruzarán exclusivamente con los parámetros fiscales y correlativos de esta empresa.
                 </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Reglas Predefinidas</h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between py-2 border-b border-zinc-100 pb-2">
                <span className="text-sm text-zinc-600">Porcentaje IVA General</span>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  {proveedor.porcentajeRetencionIVA.toString()}%
                </span>
              </li>
              
              <li className="flex justify-between py-2 border-b border-zinc-100 pb-2">
                <span className="text-sm text-zinc-600">Agente de Percepción</span>
                {proveedor.esAgentePercepcionIVA ? (
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Sí
                    </span>
                    {proveedor.rubroPercepcionIVA && (
                      <p className="text-xs text-zinc-500 mt-1">{proveedor.rubroPercepcionIVA.replace("_", " ")}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400 font-medium">No</span>
                )}
              </li>

              <li className="flex items-center justify-between py-2 border-b border-zinc-100 pb-2">
                <span className="text-sm text-zinc-600">Marcado para 100%</span>
                {proveedor.proveedorMarcadoRetencion100 ? (
                  <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                    Retención Total
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400 font-medium">No</span>
                )}
              </li>

              <li className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-600">Estatus RIF</span>
                {proveedor.rifRegistrado ? (
                   <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                     Registrado
                   </span>
                ) : (
                   <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                     No Registrado
                   </span>
                )}
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
             <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" />
              Metadatos
            </h2>
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-zinc-500">ID del Sistema</span>
                <span className="block mt-1 text-xs text-zinc-400 font-mono break-all">{proveedor.id}</span>
              </div>
              <div className="pt-2">
                <span className="block text-xs font-medium text-zinc-500">Fecha de Registro</span>
                <span className="block mt-1 text-sm text-zinc-900">{new Date(proveedor.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-zinc-500">Última Actualización</span>
                <span className="block mt-1 text-sm text-zinc-900">{new Date(proveedor.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
