"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { empresaSchema, EmpresaFormValues } from "../server/empresa.schema";
import { createEmpresaAction, updateEmpresaAction } from "../actions/empresa-actions";
import { useRouter } from "next/navigation";

interface EmpresaFormProps {
  initialData?: EmpresaFormValues & { id?: string };
}

export function EmpresaForm({ initialData }: EmpresaFormProps) {
  const isEditing = !!initialData?.id;
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema) as any,
    defaultValues: {
      nombreFiscal: initialData?.nombreFiscal || "",
      rif: initialData?.rif || "",
      direccion: initialData?.direccion || "",
      telefono: initialData?.telefono || "",
      agenteRetencionIVA: initialData?.agenteRetencionIVA ?? false,
      agenteRetencionISLR: initialData?.agenteRetencionISLR ?? false,
    }
  });

  const onSubmit = async (data: EmpresaFormValues) => {
    setIsSubmitting(true);
    setGlobalError("");
    
    let res;
    if (isEditing) {
      res = await updateEmpresaAction(initialData.id!, data);
    } else {
      res = await createEmpresaAction(data);
    }

    if (!res.success) {
      setGlobalError(res.error || "Ocurrió un error.");
      setIsSubmitting(false);
    } else {
      router.push("/empresas");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
      {globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombreFiscal" className="text-sm font-medium text-zinc-900">Nombre Fiscal <span className="text-red-500">*</span></label>
          <input
            id="nombreFiscal"
            type="text"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.nombreFiscal ? 'border-red-500' : 'border-zinc-300'}`}
            placeholder="Razón Social C.A."
            {...register("nombreFiscal")}
          />
          {errors.nombreFiscal && <span className="text-xs text-red-500">{errors.nombreFiscal.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="rif" className="text-sm font-medium text-zinc-900">RIF <span className="text-red-500">*</span></label>
          <input
            id="rif"
            type="text"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.rif ? 'border-red-500' : 'border-zinc-300'}`}
            placeholder="J-12345678-9"
            {...register("rif")}
          />
          {errors.rif && <span className="text-xs text-red-500">{errors.rif.message}</span>}
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label htmlFor="direccion" className="text-sm font-medium text-zinc-900">Dirección</label>
          <input
            id="direccion"
            type="text"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-zinc-300`}
            placeholder="Av. Principal, Edificio Empresarial..."
            {...register("direccion")}
          />
          {errors.direccion && <span className="text-xs text-red-500">{errors.direccion.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="text-sm font-medium text-zinc-900">Teléfono</label>
          <input
            id="telefono"
            type="text"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 border-zinc-300`}
            placeholder="+58-212-0000000"
            {...register("telefono")}
          />
          {errors.telefono && <span className="text-xs text-red-500">{errors.telefono.message}</span>}
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6 space-y-4">
        <h4 className="text-sm font-medium text-zinc-900">Configuración Fiscal de Retenciones</h4>
        
        <div className="flex items-start gap-3">
          <div className="flex h-6 items-center">
            <input
              id="agenteRetencionIVA"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-primary-600 focus:ring-primary-600"
              {...register("agenteRetencionIVA")}
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="agenteRetencionIVA" className="font-medium text-zinc-900">Agente de Retención de IVA</label>
            <p className="text-zinc-500">Habilita a la empresa para retener IVA a sus proveedores.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-6 items-center">
            <input
              id="agenteRetencionISLR"
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-primary-600 focus:ring-primary-600"
              {...register("agenteRetencionISLR")}
            />
          </div>
          <div className="text-sm leading-6">
            <label htmlFor="agenteRetencionISLR" className="font-medium text-zinc-900">Agente de Retención de ISLR</label>
            <p className="text-zinc-500">Marco de operaciones activas para retener Impuesto sobre la Renta.</p>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-6 space-y-4">
        <h4 className="text-sm font-medium text-zinc-900">Control de Correlativos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="proximoCorrelativoIVA" className="text-xs font-bold text-zinc-500 uppercase">Próx. Correlativo IVA</label>
            <input
              id="proximoCorrelativoIVA"
              type="number"
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Ej: 1"
              {...register("proximoCorrelativoIVA", { valueAsNumber: true })}
            />
            <span className="text-[10px] text-zinc-400">Ingrese solo el número consecutivo (ej. 1, 150). No incluya año ni mes.</span>
            {errors.proximoCorrelativoIVA && <span className="text-xs text-red-500 font-medium">{errors.proximoCorrelativoIVA.message}</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="proximoCorrelativoISLR" className="text-xs font-bold text-zinc-500 uppercase">Próx. Correlativo ISLR</label>
            <input
              id="proximoCorrelativoISLR"
              type="number"
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Ej: 1"
              {...register("proximoCorrelativoISLR", { valueAsNumber: true })}
            />
            <span className="text-[10px] text-zinc-400">Ingrese solo el número consecutivo (ej. 1, 150). No incluya año ni mes.</span>
            {errors.proximoCorrelativoISLR && <span className="text-xs text-red-500 font-medium">{errors.proximoCorrelativoISLR.message}</span>}
          </div>
        </div>
        <p className="text-xs text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100">
          <strong>Nota:</strong> El sistema generará automáticamente el número oficial (14 dígitos) anteponiendo el año y mes en curso. Solo especifique el número de secuencia.
        </p>
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
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : "Guardar Empresa"}
        </button>
      </div>
    </form>
  );
}
