"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { proveedorSchema, ProveedorFormValues } from "../server/proveedor.schema";
import { createProveedorAction, updateProveedorAction } from "../actions/proveedor-actions";

type EmpresaBasica = {
  id: string;
  nombreFiscal: string;
};

interface ProveedorFormProps {
  initialData?: ProveedorFormValues & { id?: string; rifValidadoPortalFiscalAt?: Date | null };
  empresas: EmpresaBasica[];
  defaultEmpresaId?: string;
}

export function ProveedorForm({ initialData, empresas, defaultEmpresaId }: ProveedorFormProps) {
  const isEditing = !!initialData?.id;
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema) as any,
    defaultValues: {
      empresaId: initialData?.empresaId || defaultEmpresaId || (empresas.length === 1 ? empresas[0].id : ""),
      nombre: initialData?.nombre || "",
      rif: initialData?.rif || "",
      tipoPersona: initialData?.tipoPersona || "JURIDICA",
      tipoResidencia: initialData?.tipoResidencia || "DOMICILIADO",
      tipoContribuyente: initialData?.tipoContribuyente || "ORDINARIO",
      porcentajeRetencionIVA: initialData?.porcentajeRetencionIVA || 75,
      esAgentePercepcionIVA: initialData?.esAgentePercepcionIVA ?? false,
      rubroPercepcionIVA: initialData?.rubroPercepcionIVA ?? "",
      proveedorMarcadoRetencion100: initialData?.proveedorMarcadoRetencion100 ?? false,
      rifRegistrado: initialData?.rifRegistrado ?? true,
    }
  });



  const onSubmit = async (data: ProveedorFormValues) => {
    setIsSubmitting(true);
    setGlobalError("");
    
    let res;
    if (isEditing) {
      res = await updateProveedorAction(initialData.id!, data);
    } else {
      res = await createProveedorAction(data);
    }

    if (!res.success) {
      setGlobalError(res.error || "Ocurrió un error inesperado.");
      setIsSubmitting(false);
    } else {
      router.push("/proveedores");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
      {globalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {globalError}
        </div>
      )}

      {/* Empresa Selection */}
      <div className="border-b border-zinc-200 pb-6 mb-6">
        <label htmlFor="empresaId" className="block text-sm font-medium text-zinc-900 mb-2">
          Empresa Operativa <span className="text-red-500">*</span>
        </label>
        <select
          id="empresaId"
          className={`w-full max-w-md border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.empresaId ? 'border-red-500' : 'border-zinc-300'}`}
          {...register("empresaId")}
        >
          <option value="" disabled>Seleccione una empresa...</option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.nombreFiscal}</option>
          ))}
        </select>
        {errors.empresaId && <p className="mt-1 text-xs text-red-500">{errors.empresaId.message}</p>}
        <p className="mt-2 text-xs text-zinc-500">
          El proveedor estará segmentado bajo las operaciones fiscales de esta empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className="text-sm font-medium text-zinc-900">Razón Social / Nombre <span className="text-red-500">*</span></label>
          <input
            id="nombre"
            type="text"
            className={`border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${errors.nombre ? 'border-red-500' : 'border-zinc-300'}`}
            placeholder="Proveedor C.A."
            {...register("nombre")}
          />
          {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
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
      </div>

      <div className="border-t border-zinc-200 pt-6 space-y-6">
        <h4 className="text-sm font-medium text-zinc-900">Clasificación Fiscal</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="tipoPersona" className="text-sm font-medium text-zinc-900">Tipo de Persona</label>
            <select
              id="tipoPersona"
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              {...register("tipoPersona")}
            >
              <option value="JURIDICA">Jurídica</option>
              <option value="NATURAL">Natural</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tipoResidencia" className="text-sm font-medium text-zinc-900">Tipo de Residencia</label>
            <select
              id="tipoResidencia"
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              {...register("tipoResidencia")}
            >
              <option value="DOMICILIADO">Domiciliado</option>
              <option value="NO_DOMICILIADO">No Domiciliado</option>
              <option value="RESIDENTE">Residente</option>
              <option value="NO_RESIDENTE">No Residente</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tipoContribuyente" className="text-sm font-medium text-zinc-900">Tipo de Contribuyente</label>
            <select
              id="tipoContribuyente"
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              {...register("tipoContribuyente")}
            >
              <option value="ORDINARIO">Ordinario</option>
              <option value="ESPECIAL">Especial</option>
              <option value="FORMAL">Formal</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="porcentajeRetencionIVA" className="text-sm font-medium text-zinc-900">Porcentaje Retención IVA</label>
            <select
              id="porcentajeRetencionIVA"
              className="border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              {...register("porcentajeRetencionIVA", { valueAsNumber: true })}
            >
              <option value={75}>75%</option>
              <option value={100}>100%</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Clasificación fiscal avanzada ── */}
      <details className="group border border-zinc-200 rounded-lg overflow-hidden mt-6">
        <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-semibold text-zinc-800 bg-zinc-50 hover:bg-zinc-100 transition-colors">
          Clasificación fiscal avanzada IVA
          <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="p-5 border-t border-zinc-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 cursor-pointer mt-1">
              <input 
                type="checkbox" 
                className="rounded border-zinc-300 text-primary-600 focus:ring-primary-500 mt-0.5" 
                {...register("esAgentePercepcionIVA")} 
              />
              <span className="text-sm font-medium text-zinc-900 leading-tight">¿Es Agente de Percepción IVA?</span>
            </label>
            <p className="text-xs text-zinc-500 pl-6 leading-relaxed">Úselo solo si el proveedor actúa como agente de percepción en rubros específicos (tabaco, alcohol, etc).</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="rubroPercepcionIVA" className={`text-sm font-medium text-zinc-900 ${!watch("esAgentePercepcionIVA") ? "opacity-50" : ""}`}>Rubro de percepción</label>
            <select
              id="rubroPercepcionIVA"
              className={`border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed ${!watch("esAgentePercepcionIVA") ? "opacity-50" : ""}`}
              disabled={!watch("esAgentePercepcionIVA")}
              {...register("rubroPercepcionIVA")}
            >
              <option value="">Seleccione rubro...</option>
              <option value="BEBIDAS_ALCOHOLICAS">Bebidas alcohólicas</option>
              <option value="FOSFOROS">Fósforos</option>
              <option value="CIGARRILLOS">Cigarrillos</option>
              <option value="TABACOS">Tabacos</option>
              <option value="DERIVADOS_TABACO">Derivados del Tabaco</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 cursor-pointer mt-1">
              <input 
                type="checkbox" 
                className="rounded border-zinc-300 text-primary-600 focus:ring-primary-500 mt-0.5" 
                {...register("proveedorMarcadoRetencion100")} 
              />
              <span className="text-sm font-medium text-zinc-900 leading-tight">Proveedor marcado para Retención 100%</span>
            </label>
            <p className="text-xs text-zinc-500 pl-6 leading-relaxed">Indica que el proveedor debe ser retenido al 100% según verificación en el Portal Fiscal.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 cursor-pointer mt-1">
              <input 
                type="checkbox" 
                className="rounded border-zinc-300 text-primary-600 focus:ring-primary-500 mt-0.5" 
                {...register("rifRegistrado")} 
              />
              <span className="text-sm font-medium text-zinc-900 leading-tight">RIF Registrado y válido</span>
            </label>
            <p className="text-xs text-zinc-500 pl-6 leading-relaxed">Desmarcar solo si se conoce que el proveedor no está inscrito correctamente en el RIF (causa retención 100%).</p>
          </div>

          {initialData?.rifValidadoPortalFiscalAt && (
             <div className="flex flex-col md:col-span-2 mt-2">
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-md flex items-center gap-2">
                   <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                   Última verificación en Portal Fiscal: {new Date(initialData.rifValidadoPortalFiscalAt).toLocaleDateString()}
                </p>
             </div>
          )}
        </div>
      </details>

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
          {isSubmitting ? "Guardando..." : "Guardar Proveedor"}
        </button>
      </div>
    </form>
  );
}
