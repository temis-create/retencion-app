"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { periodoFiscalSchema, PeriodoFiscalFormValues } from "../server/periodo-fiscal.schema";
import { createPeriodoFiscalAction } from "../actions/periodo-fiscal-actions";

type EmpresaBasica = { id: string; nombreFiscal: string };

interface PeriodoFormProps {
  companies: EmpresaBasica[];
  defaultEmpresaId?: string;
}

export function PeriodoForm({ companies, defaultEmpresaId }: PeriodoFormProps) {
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar empresa por defecto: 
  // 1. defaultEmpresaId si existe en la lista
  // 2. primera empresa si solo hay una
  let initialEmpresaId = "";
  if (defaultEmpresaId && companies.some(c => c.id === defaultEmpresaId)) {
    initialEmpresaId = defaultEmpresaId;
  } else if (companies.length === 1) {
    initialEmpresaId = companies[0].id;
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PeriodoFiscalFormValues>({
    resolver: zodResolver(periodoFiscalSchema) as any,
    defaultValues: {
      empresaId: initialEmpresaId,
      anio: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
      tipoImpuesto: "IVA",
      frecuencia: "MENSUAL",
      subperiodo: null,
      fechaInicio: "",
      fechaFin: "",
    },
  });

  const frecuenciaActual = watch("frecuencia");

  const onSubmit = async (data: PeriodoFiscalFormValues) => {
    setIsSubmitting(true);
    setGlobalError("");
    const res = await createPeriodoFiscalAction(data);
    if (!res.success) {
      setGlobalError(res.error || "Ocurrió un error inesperado.");
      setIsSubmitting(false);
    } else {
      router.push("/fiscal/periodos");
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-3xl bg-white p-8 rounded-xl border border-zinc-200 shadow-sm"
    >
      {globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{globalError}</div>
      )}

      {/* Empresa */}
      <div className="pb-6 border-b border-zinc-200">
        <label htmlFor="empresaId" className="block text-sm font-medium text-zinc-900 mb-2">
          Empresa Operativa <span className="text-red-500">*</span>
        </label>
        <select
          id="empresaId"
          className={`w-full max-w-md border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.empresaId ? "border-red-500" : "border-zinc-300"}`}
          {...register("empresaId")}
        >
          <option value="" disabled>Seleccione una empresa...</option>
          {companies.map((e) => (
            <option key={e.id} value={e.id}>{e.nombreFiscal}</option>
          ))}
        </select>
        {errors.empresaId && <p className="mt-1 text-xs text-red-500">{errors.empresaId.message}</p>}
      </div>

      {/* Impuesto y frecuencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="tipoImpuesto" className="text-sm font-medium text-zinc-900">
            Tipo de Impuesto <span className="text-red-500">*</span>
          </label>
          <select
            id="tipoImpuesto"
            className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            {...register("tipoImpuesto")}
          >
            <option value="IVA">IVA</option>
            <option value="ISLR">ISLR</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="frecuencia" className="text-sm font-medium text-zinc-900">
            Frecuencia <span className="text-red-500">*</span>
          </label>
          <select
            id="frecuencia"
            className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            {...register("frecuencia")}
          >
            <option value="MENSUAL">Mensual</option>
            <option value="QUINCENAL">Quincenal</option>
          </select>
        </div>
      </div>

      {/* Subperíodo (solo quincenal) */}
      {frecuenciaActual === "QUINCENAL" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="subperiodo" className="text-sm font-medium text-zinc-900">
            Subperíodo <span className="text-red-500">*</span>
          </label>
          <select
            id="subperiodo"
            className={`w-full max-w-xs border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.subperiodo ? "border-red-500" : "border-zinc-300"}`}
            {...register("subperiodo", { valueAsNumber: true })}
          >
            <option value="">Seleccione...</option>
            <option value={1}>Primera quincena (1)</option>
            <option value={2}>Segunda quincena (2)</option>
          </select>
          {errors.subperiodo && <p className="mt-1 text-xs text-red-500">{errors.subperiodo.message}</p>}
        </div>
      )}

      {/* Año y mes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="anio" className="text-sm font-medium text-zinc-900">
            Año <span className="text-red-500">*</span>
          </label>
          <input
            id="anio"
            type="number"
            min={2020}
            max={2100}
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.anio ? "border-red-500" : "border-zinc-300"}`}
            {...register("anio", { valueAsNumber: true })}
          />
          {errors.anio && <span className="text-xs text-red-500">{errors.anio.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="mes" className="text-sm font-medium text-zinc-900">
            Mes <span className="text-red-500">*</span>
          </label>
          <select
            id="mes"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.mes ? "border-red-500" : "border-zinc-300"}`}
            {...register("mes", { valueAsNumber: true })}
          >
            {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(
              (nombre, i) => (
                <option key={i + 1} value={i + 1}>{nombre}</option>
              )
            )}
          </select>
          {errors.mes && <span className="text-xs text-red-500">{errors.mes.message}</span>}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="fechaInicio" className="text-sm font-medium text-zinc-900">
            Fecha de Inicio <span className="text-red-500">*</span>
          </label>
          <input
            id="fechaInicio"
            type="date"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.fechaInicio ? "border-red-500" : "border-zinc-300"}`}
            {...register("fechaInicio")}
          />
          {errors.fechaInicio && <span className="text-xs text-red-500">{errors.fechaInicio.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="fechaFin" className="text-sm font-medium text-zinc-900">
            Fecha de Fin <span className="text-red-500">*</span>
          </label>
          <input
            id="fechaFin"
            type="date"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.fechaFin ? "border-red-500" : "border-zinc-300"}`}
            {...register("fechaFin")}
          />
          {errors.fechaFin && <span className="text-xs text-red-500">{(errors.fechaFin as any).message}</span>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creando..." : "Crear Período"}
        </button>
      </div>
    </form>
  );
}
