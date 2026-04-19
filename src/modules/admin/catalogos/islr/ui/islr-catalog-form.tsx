"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConceptoISLRSchema, ConceptoISLRFormValues } from "../server/islr-catalog.schema";
import { updateConceptoAction } from "../actions/islr-catalog-actions";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  concepto: any;
  onClose: () => void;
}

export function ISLRCatalogForm({ concepto, onClose }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConceptoISLRFormValues>({
    resolver: zodResolver(ConceptoISLRSchema) as any,
    defaultValues: {
      id: concepto.id,
      codigoSeniat: concepto.codigoSeniat,
      numeral: concepto.numeral,
      literal: concepto.literal,
      concepto: concepto.concepto,
      sujeto: concepto.sujeto,
      tipoTarifa: concepto.tipoTarifa,
      baseImponiblePorcentaje: concepto.baseImponiblePorcentaje ? Number(concepto.baseImponiblePorcentaje) : null,
      porcentajeRetencion: concepto.porcentajeRetencion ? Number(concepto.porcentajeRetencion) : null,
      montoMinimoBs: concepto.montoMinimoBs ? Number(concepto.montoMinimoBs) : 0,
      sustraendoBs: concepto.sustraendoBs ? Number(concepto.sustraendoBs) : 0,
      usaMontoMinimo: !!concepto.usaMontoMinimo,
      usaSustraendo: !!concepto.usaSustraendo,
      requiereCalculoEspecial: !!concepto.requiereCalculoEspecial,
      formulaEspecial: concepto.formulaEspecial,
      notas: concepto.notas,
      activo: !!concepto.activo,
    },
  });

  const requiereCalculoEspecial = watch("requiereCalculoEspecial");
  const tipoTarifa = watch("tipoTarifa");

  const onSubmit = async (data: ConceptoISLRFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateConceptoAction(concepto.id, data);
      if (result.success) {
        toast.success("Concepto actualizado con éxito");
        onClose();
      } else {
        toast.error(result.error || "Error al actualizar el concepto");
      }
    } catch (error) {
      toast.error("Error de red o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Editar Concepto ISLR</h2>
            <p className="text-sm text-gray-500">ID: {concepto.id} | Código SENIAT: {concepto.codigoSeniat || 'N/A'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Identificación */}
          <section>
            <h3 className="text-sm font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Identificación (Solo Lectura)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Concepto</label>
                <div className="mt-1 text-sm font-medium text-gray-800">{concepto.concepto}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Sujeto</label>
                <div className="mt-1 text-sm font-medium text-gray-800">{concepto.sujeto}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Numeral / Literal</label>
                <div className="mt-1 text-sm font-medium text-gray-800">{concepto.numeral} {concepto.literal ? `/ ${concepto.literal}` : ''}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Tarifa Base</label>
                <div className="mt-1 text-sm font-medium text-gray-800">{concepto.tipoTarifa}</div>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-gray-400 italic">* Estos campos son normativos y no se permiten editar en esta vista.</p>
          </section>

          {/* Configuración de Cálculo */}
          <section>
            <h3 className="text-sm font-semibold text-green-600 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
              Configuración de Cálculo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Imponible %</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20"
                  {...register("baseImponiblePorcentaje", { valueAsNumber: true })}
                />
              </div>

              {tipoTarifa === "PORCENTAJE" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Retención %</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20"
                    {...register("porcentajeRetencion", { valueAsNumber: true })}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto Mínimo Bs.</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20"
                  {...register("montoMinimoBs", { valueAsNumber: true })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sustraendo Bs.</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20"
                  {...register("sustraendoBs", { valueAsNumber: true })}
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="usaMin" {...register("usaMontoMinimo")} className="w-4 h-4 text-blue-600" />
                    <label htmlFor="usaMin" className="text-sm font-medium text-gray-700">Usa Minimo</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="usaSust" {...register("usaSustraendo")} className="w-4 h-4 text-blue-600" />
                    <label htmlFor="usaSust" className="text-sm font-medium text-gray-700">Usa Sustraendo</label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cálculo Especial */}
          <section className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 mb-4">
              <input type="checkbox" id="reqCalc" {...register("requiereCalculoEspecial")} className="w-4 h-4 text-amber-600" />
              <label htmlFor="reqCalc" className="text-sm font-bold text-amber-800">Requiere Cálculo Especial</label>
            </div>
            
            {requiereCalculoEspecial && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-amber-900">Fórmula / Lógica Especial</label>
                <textarea
                  className="w-full px-3 py-2 border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-500/20 text-sm font-mono h-20"
                  placeholder="Ej: PAGO / ((IVA_RATE / 100) + 1)"
                  {...register("formulaEspecial")}
                />
                <p className="text-[10px] text-amber-600">Especifique aquí la lógica técnica para motores de cálculo.</p>
              </div>
            )}
          </section>

          {/* Otros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Estado Administrativo</label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <input type="checkbox" id="formActivo" {...register("activo")} className="w-5 h-5 text-blue-600" />
                <label htmlFor="formActivo" className="text-sm font-semibold">Concepto Habilitado</label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas Administrativas</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500/20 text-sm h-16"
                {...register("notas")}
              />
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
