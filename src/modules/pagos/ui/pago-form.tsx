"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, Trash2, Calculator, Info } from "lucide-react";
import { pagoSchema, PagoFormValues } from "../server/pago.schema";
import { createPagoAction, getComprasPendientesAction } from "../actions/pago-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConceptoISLRSelector } from "../islr-selector/ui/concepto-islr-selector";
import { Sparkles as SparklesIcon } from "lucide-react"; // Usamos alias si hay colisión, pero Sparkles es usada en el componente

interface Props {
  empresas: { id: string; nombreFiscal: string }[];
  proveedores: { id: string; nombre: string; rif: string; empresaId: string; tipoPersona: string; tipoResidencia: string }[];
  conceptosISLR: { id: number; codigoSeniat: string | null; concepto: string; sujeto: string }[];
  defaultEmpresaId?: string;
}

export function PagoForm({ empresas, proveedores, conceptosISLR, defaultEmpresaId }: Props) {
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comprasPendientes, setComprasPendientes] = useState<any[]>([]);
  const [loadingCompras, setLoadingCompras] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PagoFormValues>({
    resolver: zodResolver(pagoSchema) as any,
    defaultValues: {
      empresaId: defaultEmpresaId || (empresas.length === 1 ? empresas[0].id : ""),
      proveedorId: "",
      conceptoISLRId: "",
      fechaPago: new Date().toISOString().split("T")[0],
      montoTotal: 0,
      referencia: "",
      tipoEventoRetencion: "PAGO_EFECTIVO",
      aplicaciones: [],
    },
  });

  // Asegurar que el valor por defecto se sincronice y se marque como válido
  useEffect(() => {
    const initialId = defaultEmpresaId || (empresas.length === 1 ? empresas[0].id : "");
    if (initialId) {
      setValue("empresaId", initialId, { 
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true 
      });
    }
  }, [defaultEmpresaId, empresas, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "aplicaciones",
  });

  const empresaId = watch("empresaId");
  const proveedorId = watch("proveedorId");
  const montoTotal = watch("montoTotal");
  const aplicaciones = watch("aplicaciones");

  // Filtrar proveedores por empresa
  const proveedoresFiltrados = proveedores.filter((p) => p.empresaId === empresaId);

  const selectedProveedor = proveedores.find(p => p.id === proveedorId);

  // Cargar compras pendientes al cambiar proveedor y LIMPIAR aplicaciones previas
  useEffect(() => {
    // Limpiar aplicaciones de forma segura
    setValue("aplicaciones", []);

    if (empresaId && proveedorId) {
      setLoadingCompras(true);
      getComprasPendientesAction(empresaId, proveedorId).then((res) => {
        if (res.success) {
          setComprasPendientes(res.data || []);
        }
        setLoadingCompras(false);
      });
    } else {
      setComprasPendientes([]);
    }
  }, [empresaId, proveedorId, setValue]);

  const apps = watch("aplicaciones") || [];
  const sumaAplicada = apps.reduce((sum, a) => sum + (Number(a.montoAplicado) || 0), 0);

  // Efecto para capturar errores de Zod y mostrarlos arriba con detalle extremo
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      if (errors.empresaId) return setGlobalError(errors.empresaId.message || "Seleccione una empresa.");
      if (errors.proveedorId) return setGlobalError(errors.proveedorId.message || "Seleccione un proveedor.");
      if (errors.conceptoISLRId) return setGlobalError(errors.conceptoISLRId.message || "Seleccione un concepto.");
      if (errors.montoTotal) return setGlobalError(errors.montoTotal.message || "Monto total inválido.");
      
      if (errors.aplicaciones) {
        if (Array.isArray(errors.aplicaciones)) {
          const errorIndex = errors.aplicaciones.findIndex(e => e !== undefined);
          if (errorIndex !== -1) {
            const itemError = errors.aplicaciones[errorIndex] as any;
            if (itemError?.montoAplicado) {
              return setGlobalError(`Factura #${errorIndex + 1}: ${itemError.montoAplicado.message}`);
            }
            if (itemError?.compraId) {
              return setGlobalError(`Factura #${errorIndex + 1}: ID de compra ausente o inválido (${itemError.compraId.type}).`);
            }
          }
        } else {
           return setGlobalError((errors.aplicaciones as any).message || "Debe añadir al menos una factura.");
        }
      }
      
      setGlobalError("Revise los campos del formulario.");
    } else {
      setGlobalError("");
    }
  }, [errors]);

  const onSubmit = async (data: PagoFormValues) => {
    console.log("Submitting data:", data);
    // Validar suma vs total con margen de céntimos
    if (Math.abs(sumaAplicada - data.montoTotal) > 0.011) {
      setGlobalError(`El monto total (${data.montoTotal}) no coincide con la suma aplicada (${sumaAplicada.toFixed(2)}). Diferencia: ${(data.montoTotal - sumaAplicada).toFixed(2)}`);
      return;
    }

    setIsSubmitting(true);
    setGlobalError("");
    
    try {
      const res = await createPagoAction(data);
      if (!res.success) {
        setGlobalError(res.error || "Error inesperado al grabar el pago.");
        setIsSubmitting(false);
      } else {
        toast.success("Pago registrado con éxito");
        router.push("/fiscal/pagos");
        router.refresh();
      }
    } catch (err) {
      setGlobalError("Error crítico de conexión o servidor.");
      setIsSubmitting(false);
    }
  };

  const addAplicacion = (compraId: string) => {
    const compra = comprasPendientes.find(c => c.id === compraId);
    if (!compra) return;

    // Verificar si ya está agregada
    if (aplicaciones.some(a => a.compraId === compraId)) {
        toast.error("Esta compra ya ha sido agregada");
        return;
    }

    // Calcular cuánto falta por distribuir del monto total
    const yaDistribuido = aplicaciones.reduce((sum, a) => sum + a.montoAplicado, 0);
    const restante = Math.max(0, montoTotal - yaDistribuido);
    
    // Aplicar lo que falte o el saldo de la compra, lo que sea menor
    const montoASugerir = Math.min(restante, compra.saldo);

    append({
      compraId,
      montoAplicado: Number(montoASugerir.toFixed(2)),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* 1. Datos del Pago */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-100">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">Emisor y Receptor</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">Empresa</label>
            <select {...register("empresaId")} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm">
              <option value="">Seleccione empresa...</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>{e.nombreFiscal}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">Proveedor</label>
            <select {...register("proveedorId")} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm">
              <option value="">Seleccione proveedor...</option>
              {proveedoresFiltrados.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.rif})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">Datos Financieros</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Fecha</label>
              <input type="date" {...register("fechaPago")} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Monto Total (Bs.)</label>
              <input 
                type="number" 
                step="0.01" 
                {...register("montoTotal", { valueAsNumber: true })} 
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm font-bold text-indigo-600 bg-indigo-50/30" 
              />
            </div>
          </div>

          {/* Reemplazo por Selector Inteligente */}
          <ConceptoISLRSelector 
            proveedorId={proveedorId}
            onResolved={(id) => {
              setValue("conceptoISLRId", id ? id.toString() : "", {
                shouldValidate: true
              });
            }}
            error={errors.conceptoISLRId?.message}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">Evento de Retención</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" value="PAGO_EFECTIVO" {...register("tipoEventoRetencion")} />
                    Pago en Efectivo/Bancos
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" value="ABONO_EN_CUENTA" {...register("tipoEventoRetencion")} />
                    Abono en Cuenta
                </label>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Distribución de Compras */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-indigo-500" />
                Aplicación a Documentos (Facturas)
            </h3>
            {proveedorId && (
                <div className="text-xs text-zinc-500 italic">
                    {loadingCompras ? "Buscando facturas..." : `${comprasPendientes.length} facturas pendientes`}
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de compras disponibles */}
            <div className="lg:col-span-1 space-y-3">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Facturas Pendientes</p>
                <div className="max-h-[300px] overflow-y-auto border border-zinc-100 rounded-lg divide-y divide-zinc-50">
                    {comprasPendientes.length === 0 ? (
                        <div className="p-4 text-center text-xs text-zinc-400">
                            No hay compras con saldo para este proveedor.
                        </div>
                    ) : (
                        comprasPendientes.map(compra => (
                            <div key={compra.id} className="p-3 hover:bg-zinc-50 transition-colors flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-700">{compra.tipoDocumento.codigo} {compra.numeroFactura}</span>
                                    <span className="text-[10px] text-zinc-500">Saldo: Bs. {compra.saldo.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addAplicacion(compra.id)}
                                    className="p-1 px-2 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                                >
                                    <Plus className="h-3 w-3" />
                                    Añadir
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Aplicaciones actuales */}
            <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Distribución del Pago</p>
                    <div className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded",
                        Math.abs(aplicaciones.reduce((sum, a) => sum + a.montoAplicado, 0) - montoTotal) < 0.01 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-amber-100 text-amber-700"
                    )}>
                        Suma: Bs. {aplicaciones.reduce((sum, a) => sum + Number(a.montoAplicado || 0), 0).toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div className="space-y-2">
                    {fields.length === 0 && (
                        <div className="p-8 border-2 border-dashed border-zinc-100 rounded-xl text-center text-zinc-400 text-sm">
                            Selecciona facturas de la izquierda para distribuir el pago.
                        </div>
                    )}
                    {fields.map((field, index) => {
                        const compra = comprasPendientes.find(c => c.id === watch(`aplicaciones.${index}.compraId`));
                        return (
                            <div key={field.id} className="flex items-center gap-4 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                                <div className="flex-1">
                                    <input
                                        type="hidden"
                                        {...register(`aplicaciones.${index}.compraId` as const)}
                                    />
                                    <p className="text-xs font-bold text-zinc-700">
                                        {compra?.tipoDocumento.codigo} {compra?.numeroFactura}
                                    </p>
                                    <p className="text-[10px] text-zinc-500">Saldo total: Bs. {compra?.saldo?.toLocaleString("de-DE")}</p>
                                </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Abonar</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register(`aplicaciones.${index}.montoAplicado` as const, { valueAsNumber: true })}
                                            className={`border rounded px-2 py-1 text-sm font-bold w-32 focus:ring-2 focus:ring-indigo-500/20 ${
                                                errors.aplicaciones?.[index]?.montoAplicado ? "border-red-500 bg-red-50" : "border-zinc-300"
                                            }`}
                                        />
                                        {errors.aplicaciones?.[index]?.montoAplicado && (
                                            <p className="text-[10px] text-red-600 font-medium">
                                                {errors.aplicaciones[index]?.montoAplicado?.message || "Monto requerido"}
                                            </p>
                                        )}
                                    </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                {fields.length > 0 && (
                    <div className="bg-indigo-50/50 rounded-lg p-4 flex gap-3 mt-4">
                        <Info className="h-5 w-5 text-indigo-500 shrink-0" />
                        <p className="text-sm text-indigo-700">
                            Estás distribuyendo el pago en <strong>{fields.length}</strong> documentos. 
                            Asegúrate de que la suma coincida con el <strong>Monto Total</strong> ingresado arriba.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </section>

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
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registrando..." : "Registrar Pago ISLR"}
        </button>
      </div>
    </form>
  );
}
