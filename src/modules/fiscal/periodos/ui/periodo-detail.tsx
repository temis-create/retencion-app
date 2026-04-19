"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Building2, Lock, Clock } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { closePeriodoFiscalAction } from "../actions/periodo-fiscal-actions";

type PeriodoDetailParams = {
  id: string;
  codigoPeriodo: string;
  anio: number;
  mes: number;
  tipoImpuesto: string;
  frecuencia: string;
  subperiodo: number | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  estado: string;
  fechaCierre: Date | null;
  createdAt: Date;
  updatedAt: Date;
  empresa: { nombreFiscal: string; id: string };
};

const MESES = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export function PeriodoDetail({ periodo }: { periodo: PeriodoDetailParams }) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [closeError, setCloseError] = useState("");

  const handleClose = async () => {
    setClosing(true);
    setShowModal(false);
    setCloseError("");
    const res = await closePeriodoFiscalAction(periodo.id);
    if (!res.success) {
      setCloseError(res.error || "Error al cerrar el período.");
      setClosing(false);
    } else {
      router.refresh();
    }
  };

  const isAbierto = periodo.estado === "ABIERTO";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/fiscal/periodos" className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center bg-primary-100 text-primary-700 rounded-lg">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-mono">
                {periodo.codigoPeriodo}
              </h1>
              <p className="text-sm text-zinc-500">
                {MESES[periodo.mes]} {periodo.anio} — {periodo.tipoImpuesto}
              </p>
            </div>
          </div>
        </div>

        {/* Estado badge + acción */}
        <div className="flex items-center gap-3">
          {isAbierto ? (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              ● Abierto
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">
              ✕ Cerrado
            </span>
          )}

          {isAbierto && (
            <button
              onClick={() => setShowModal(true)}
              disabled={closing}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <Lock className="h-4 w-4" />
              {closing ? "Cerrando..." : "Cerrar Período"}
            </button>
          )}
        </div>
      </div>

      {closeError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{closeError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Estructura temporal */}
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Estructura Temporal</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Año</dt>
                <dd className="mt-2 text-2xl font-bold text-zinc-900">{periodo.anio}</dd>
              </div>
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Mes</dt>
                <dd className="mt-2 text-xl font-semibold text-zinc-900">{MESES[periodo.mes]}</dd>
              </div>
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100">
                <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Frecuencia</dt>
                <dd className="mt-2 text-sm font-semibold text-zinc-900">
                  {periodo.frecuencia}
                  {periodo.subperiodo ? ` — Q${periodo.subperiodo}` : ""}
                </dd>
              </div>
            </dl>

            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-zinc-500">Fecha de Inicio</dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {periodo.fechaInicio ? new Date(periodo.fechaInicio).toLocaleDateString() : "No definida"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-zinc-500">Fecha de Fin</dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {periodo.fechaFin ? new Date(periodo.fechaFin).toLocaleDateString() : "No definida"}
                </dd>
              </div>
            </dl>
          </section>

          {/* Empresa */}
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-zinc-400" />
              Empresa Operativa
            </h2>
            <p className="text-sm text-zinc-900 font-medium">{periodo.empresa?.nombreFiscal}</p>
            <p className="mt-2 text-xs text-zinc-500 border-l-2 border-primary-200 pl-3">
              Todas las compras, pagos y retenciones de este período quedan vinculados a esta empresa.
            </p>
          </section>
        </div>

        <div className="space-y-6">
          {/* Tipo impuesto */}
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Impuesto</h2>
            <span className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-bold ring-1 ring-inset ${
              periodo.tipoImpuesto === "IVA"
                ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                : "bg-purple-50 text-purple-700 ring-purple-600/20"
            }`}>
              {periodo.tipoImpuesto}
            </span>
          </section>

          {/* Cierre */}
          {!isAbierto && periodo.fechaCierre && (
            <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5 text-zinc-400" />
                Cierre
              </h2>
              <div>
                <span className="block text-xs font-medium text-zinc-500">Fecha de Cierre</span>
                <span className="block mt-1 text-sm text-zinc-900">
                  {new Date(periodo.fechaCierre).toLocaleDateString()}
                </span>
              </div>
            </section>
          )}

          {/* Metadatos */}
          <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-zinc-400" />
              Metadatos
            </h2>
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-zinc-500">ID del Sistema</span>
                <span className="block mt-1 text-xs text-zinc-400 font-mono break-all">{periodo.id}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-zinc-500">Creado</span>
                <span className="block mt-1 text-sm text-zinc-900">{new Date(periodo.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleClose}
        loading={closing}
        variant="danger"
        title="Cerrar Período Fiscal"
        description={`¿Confirma que desea cerrar el período ${periodo.codigoPeriodo}? Esta acción es irreversible y bloqueará todos los registros asociados.`}
        confirmText="Confirmar Cierre"
      />
    </div>
  );
}
