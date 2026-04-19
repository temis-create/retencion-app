"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { compraSchema, CompraFormValues } from "../server/compra.schema";
import { createCompraAction, updateCompraAction } from "../actions/compra-actions";
import { checkPeriodoFiscalAbiertoAction } from "@/modules/fiscal/periodos/actions/periodo-fiscal-actions";

type EmpresaBasica = { id: string; nombreFiscal: string };
type ProveedorBasico = { id: string; nombre: string; rif: string; empresaId: string };
type TipoDocumentoBasico = { id: string; codigo: string; descripcion: string };
type AlicuotaBasica = { id: string; nombre: string; porcentaje: any };
type CompraBasica = { id: string; numeroFactura: string | null; tipoDocumento: { codigo: string } };

interface CompraFormProps {
  initialData?: CompraFormValues & { id?: string };
  empresas: EmpresaBasica[];
  proveedores: ProveedorBasico[];
  tiposDocumento: TipoDocumentoBasico[];
  alicuotas: AlicuotaBasica[];
  comprasDisponibles: CompraBasica[]; // para documento afectado
  periodosCerrados?: boolean; // si true, bloquea edición
  defaultEmpresaId?: string;
}

const CODIGOS_AJUSTE = ["NC", "ND"];

function inputClass(hasError: boolean) {
  return `w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${
    hasError ? "border-red-400 bg-red-50" : "border-zinc-300"
  }`;
}

export function CompraForm({
  initialData,
  empresas,
  proveedores,
  tiposDocumento,
  alicuotas = [],
  comprasDisponibles,
  periodosCerrados = false,
  defaultEmpresaId,
}: CompraFormProps) {
  const isEditing = !!initialData?.id;
  const router = useRouter();
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Validación temprana de período fiscal ──────────────────────
  const [periodoWarning, setPeriodoWarning] = useState<string | null>(null);
  const [checkingPeriodo, setCheckingPeriodo] = useState(false);
  const [periodoValido, setPeriodoValido] = useState<boolean | null>(null);
  const [periodoInfo, setPeriodoInfo] = useState<{ id: string; codigoPeriodo: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompraFormValues>({
    resolver: zodResolver(compraSchema) as any,
    defaultValues: {
      empresaId: initialData?.empresaId || defaultEmpresaId || (empresas.length === 1 ? empresas[0].id : ""),
      proveedorId: initialData?.proveedorId || "",
      tipoDocumentoId: initialData?.tipoDocumentoId || "",
      tipoDocumentoCodigo: initialData?.tipoDocumentoCodigo || "",
      documentoAfectadoId: initialData?.documentoAfectadoId || null,
      numeroFactura: initialData?.numeroFactura || "",
      numeroControl: initialData?.numeroControl || "",
      fechaFactura: initialData?.fechaFactura
        ? initialData.fechaFactura.toString().slice(0, 10)
        : "",
      porcentajeAlicuotaSnapshot: initialData?.porcentajeAlicuotaSnapshot ?? null,
      montoExento: initialData?.montoExento ?? 0,
      montoBase: initialData?.montoBase ?? 0,
      impuestoIVA: initialData?.impuestoIVA ?? 0,
      totalFactura: initialData?.totalFactura ?? 0,
      tipoAjuste: initialData?.tipoAjuste ?? null,
      motivoAjuste: initialData?.motivoAjuste ?? "",
      naturalezaIVA: initialData?.naturalezaIVA || "GRAVADA",
      esViatico: initialData?.esViatico ?? false,
      esGastoReembolsable: initialData?.esGastoReembolsable ?? false,
      esServicioPublicoDomiciliario: initialData?.esServicioPublicoDomiciliario ?? false,
      esOperacionArticulo2RetencionTotal: initialData?.esOperacionArticulo2RetencionTotal ?? false,
      tienePercepcionAnticipadaIVA: initialData?.tienePercepcionAnticipadaIVA ?? false,
      ivaDiscriminado: initialData?.ivaDiscriminado ?? true,
      cumpleRequisitosFormales: initialData?.cumpleRequisitosFormales ?? true,
    },
  });

  const empresaIdSeleccionada = watch("empresaId");
  const tipoDocumentoIdSeleccionado = watch("tipoDocumentoId");
  const fechaFacturaWatch = watch("fechaFactura");

  // Filtrar proveedores según empresa seleccionada
  const proveedoresFiltrados = proveedores.filter(
    (p) => p.empresaId === empresaIdSeleccionada
  );

  // Detectar si el tipo seleccionado es ajuste (NC/ND)
  const tipoSeleccionado = tiposDocumento.find(
    (t) => t.id === tipoDocumentoIdSeleccionado
  );
  const esAjuste = tipoSeleccionado
    ? CODIGOS_AJUSTE.includes(tipoSeleccionado.codigo)
    : false;

  // Sincronizar tipoDocumentoCodigo para el refinement del schema
  useEffect(() => {
    if (tipoSeleccionado) {
      setValue("tipoDocumentoCodigo", tipoSeleccionado.codigo);
    }
  }, [tipoSeleccionado, setValue]);

  // Resetear proveedor solo cuando el usuario realmente cambia la empresa,
  // preservando el valor inicial en modo edición.
  const prevEmpresaId = useRef<string | undefined>(initialData?.empresaId);

  useEffect(() => {
    if (empresaIdSeleccionada !== prevEmpresaId.current) {
      setValue("proveedorId", "");
      prevEmpresaId.current = empresaIdSeleccionada;
    }
  }, [empresaIdSeleccionada, setValue]);

  // ── Verificar período fiscal al cambiar empresa o fecha ──────────
  const verificarPeriodoFiscal = useCallback(
    async (empresaId: string, fecha?: string) => {
      if (!empresaId) {
        setPeriodoWarning(null);
        setPeriodoValido(null);
        setPeriodoInfo(null);
        return;
      }
      setCheckingPeriodo(true);
      setPeriodoWarning(null);
      try {
        const res = await checkPeriodoFiscalAbiertoAction(empresaId, fecha || undefined);
        if (!res.abierto) {
          setPeriodoWarning(res.mensaje ?? "No se pudo verificar el período fiscal.");
          setPeriodoValido(false);
          setPeriodoInfo(null);
        } else {
          setPeriodoWarning(null);
          setPeriodoValido(true);
          setPeriodoInfo(res.periodo ?? null);
        }
      } catch {
        setPeriodoWarning("Error al verificar el período fiscal.");
        setPeriodoValido(false);
        setPeriodoInfo(null);
      } finally {
        setCheckingPeriodo(false);
      }
    },
    []
  );

  // Al cambiar empresa: verificar inmediatamente (sin fecha)
  useEffect(() => {
    if (isEditing) return; // En edición, el período ya fue validado
    verificarPeriodoFiscal(empresaIdSeleccionada, fechaFacturaWatch || undefined);
  }, [empresaIdSeleccionada, verificarPeriodoFiscal, isEditing]);

  // Al cambiar fecha: refinar la verificación con la fecha
  useEffect(() => {
    if (isEditing) return;
    if (!empresaIdSeleccionada || !fechaFacturaWatch) return;
    verificarPeriodoFiscal(empresaIdSeleccionada, fechaFacturaWatch);
  }, [fechaFacturaWatch, empresaIdSeleccionada, verificarPeriodoFiscal, isEditing]);

  // --- Auto Cálculo IVA ---
  const montoBaseWatch = watch("montoBase");
  const porcentajeAlicuotaWatch = watch("porcentajeAlicuotaSnapshot");
  const montoExentoWatch = watch("montoExento");
  const impuestoIVAWatch = watch("impuestoIVA");

  const prevBase = useRef(montoBaseWatch);
  const prevAlicuota = useRef(porcentajeAlicuotaWatch);
  const prevExento = useRef(montoExentoWatch);
  const prevIva = useRef(impuestoIVAWatch);

  useEffect(() => {
    if (
      montoBaseWatch !== prevBase.current ||
      porcentajeAlicuotaWatch !== prevAlicuota.current
    ) {
      if (porcentajeAlicuotaWatch != null) {
        const alic = Number(porcentajeAlicuotaWatch);
        const base = Number(montoBaseWatch) || 0;
        const calcIva = Number((base * (alic / 100)).toFixed(2));
        setValue("impuestoIVA", calcIva, { shouldValidate: true });
        
        const exento = Number(montoExentoWatch) || 0;
        setValue("totalFactura", Number((exento + base + calcIva).toFixed(2)), { shouldValidate: true });
      }
      prevBase.current = montoBaseWatch;
      prevAlicuota.current = porcentajeAlicuotaWatch;
      prevIva.current = watch("impuestoIVA"); 
    }
  }, [montoBaseWatch, porcentajeAlicuotaWatch, montoExentoWatch, setValue]);

  useEffect(() => {
    if (montoExentoWatch !== prevExento.current || impuestoIVAWatch !== prevIva.current) {
        const exento = Number(montoExentoWatch) || 0;
        const base = Number(montoBaseWatch) || 0;
        const iva = Number(impuestoIVAWatch) || 0;
        setValue("totalFactura", Number((exento + base + iva).toFixed(2)), { shouldValidate: true });
        
        prevExento.current = montoExentoWatch;
        prevIva.current = impuestoIVAWatch;
    }
  }, [montoExentoWatch, impuestoIVAWatch, montoBaseWatch, setValue]);
  // ------------------------

  const onSubmit = async (data: CompraFormValues) => {
    setIsSubmitting(true);
    setGlobalError("");

    let res;
    if (isEditing) {
      res = await updateCompraAction(initialData.id!, data);
    } else {
      res = await createCompraAction(data);
    }

    if (!res.success) {
      setGlobalError(res.error || "Ocurrió un error inesperado.");
      setIsSubmitting(false);
    } else {
      router.push("/compras");
      router.refresh();
    }
  };

  if (periodosCerrados && isEditing) {
    return (
      <div className="max-w-3xl bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-amber-800">
            Edición bloqueada — Período fiscal cerrado
          </h3>
          <p className="mt-1 text-sm text-amber-700">
            Esta compra pertenece a un período fiscal cerrado. No es posible modificarla.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-3 text-sm font-medium text-amber-800 hover:underline"
          >
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-4xl bg-white p-8 rounded-xl border border-zinc-200 shadow-sm"
    >
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* ── Alerta temprana de período fiscal ─────────── */}
      {periodoWarning && !isEditing && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 p-4 rounded-lg text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Período fiscal no disponible</p>
            <p className="mt-0.5">{periodoWarning}</p>
            <p className="mt-1.5 text-xs text-amber-600">
              Puede abrir un período desde el módulo{" "}
              <a href="/fiscal/periodos" className="underline font-medium hover:text-amber-800">
                Períodos Fiscales
              </a>.
            </p>
          </div>
        </div>
      )}

      {/* ── Empresa y Proveedor ─────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
          Partes del documento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="empresaId" className="text-sm font-medium text-zinc-700">
              Empresa <span className="text-red-500">*</span>
            </label>
            <select id="empresaId" className={inputClass(!!errors.empresaId)} {...register("empresaId")}>
              <option value="">Seleccione empresa...</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombreFiscal}
                </option>
              ))}
            </select>
            {errors.empresaId && (
              <p className="text-xs text-red-500">{errors.empresaId.message}</p>
            )}
            {checkingPeriodo && (
              <p className="text-xs text-zinc-400 animate-pulse">Verificando período fiscal...</p>
            )}
            {!checkingPeriodo && periodoValido && periodoInfo && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Período activo: <span className="font-semibold">{periodoInfo.codigoPeriodo}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="proveedorId" className="text-sm font-medium text-zinc-700">
              Proveedor <span className="text-red-500">*</span>
            </label>
            <select id="proveedorId" className={inputClass(!!errors.proveedorId)} {...register("proveedorId")}>
              <option value="">
                {empresaIdSeleccionada
                  ? proveedoresFiltrados.length === 0
                    ? "Sin proveedores en esta empresa"
                    : "Seleccione proveedor..."
                  : "Seleccione empresa primero"}
              </option>
              {proveedoresFiltrados.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.rif}
                </option>
              ))}
            </select>
            {errors.proveedorId && (
              <p className="text-xs text-red-500">{errors.proveedorId.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Tipo de documento ────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
          Tipo documental
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tipoDocumentoId" className="text-sm font-medium text-zinc-700">
              Tipo de documento <span className="text-red-500">*</span>
            </label>
            <select
              id="tipoDocumentoId"
              className={inputClass(!!errors.tipoDocumentoId)}
              {...register("tipoDocumentoId")}
            >
              <option value="">Seleccione tipo...</option>
              {tiposDocumento.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.codigo} — {t.descripcion}
                </option>
              ))}
            </select>
            {errors.tipoDocumentoId && (
              <p className="text-xs text-red-500">{errors.tipoDocumentoId.message}</p>
            )}
          </div>

          {/* Documento afectado — solo para NC/ND */}
          {esAjuste && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="documentoAfectadoId" className="text-sm font-medium text-zinc-700">
                Documento afectado <span className="text-red-500">*</span>
              </label>
              <select
                id="documentoAfectadoId"
                className={inputClass(!!errors.documentoAfectadoId)}
                {...register("documentoAfectadoId")}
              >
                <option value="">Seleccione factura...</option>
                {comprasDisponibles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.tipoDocumento.codigo} · {c.numeroFactura || "S/N"}
                  </option>
                ))}
              </select>
              {errors.documentoAfectadoId && (
                <p className="text-xs text-red-500">{errors.documentoAfectadoId.message}</p>
              )}
              <p className="text-xs text-zinc-500">
                Indica la factura original que afecta esta nota.
              </p>
            </div>
          )}
        </div>

        {/* Ajuste opcional */}
        {esAjuste && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tipoAjuste" className="text-sm font-medium text-zinc-700">
                Tipo de ajuste
              </label>
              <select
                id="tipoAjuste"
                className={inputClass(false)}
                {...register("tipoAjuste")}
              >
                <option value="">Sin clasificar</option>
                <option value="ANULACION">Anulación</option>
                <option value="DESCUENTO">Descuento</option>
                <option value="DEVOLUCION">Devolución</option>
                <option value="ERROR_PRECIO">Error de precio</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="motivoAjuste" className="text-sm font-medium text-zinc-700">
                Motivo del ajuste
              </label>
              <input
                id="motivoAjuste"
                type="text"
                className={inputClass(false)}
                placeholder="Descripción breve..."
                {...register("motivoAjuste")}
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Datos del documento ──────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
          Datos del documento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="numeroFactura" className="text-sm font-medium text-zinc-700">
              N° de factura <span className="text-red-500">*</span>
            </label>
            <input
              id="numeroFactura"
              type="text"
              className={inputClass(!!errors.numeroFactura)}
              placeholder="00001234"
              {...register("numeroFactura")}
            />
            {errors.numeroFactura && (
              <p className="text-xs text-red-500">{errors.numeroFactura.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="numeroControl" className="text-sm font-medium text-zinc-700">
              N° de control
            </label>
            <input
              id="numeroControl"
              type="text"
              className={inputClass(false)}
              placeholder="00-00001234"
              {...register("numeroControl")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fechaFactura" className="text-sm font-medium text-zinc-700">
              Fecha de factura <span className="text-red-500">*</span>
            </label>
            <input
              id="fechaFactura"
              type="date"
              className={inputClass(!!errors.fechaFactura)}
              {...register("fechaFactura")}
            />
            {errors.fechaFactura && (
              <p className="text-xs text-red-500">{errors.fechaFactura.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Montos ──────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
          Montos (Bs.)
        </h3>
        <p className="text-xs text-zinc-500">
          Total = Base exenta + Base imponible + IVA. El IVA y el total se calculan de manera automática pero pueden ajustarse individualmente hasta ±1 Bs de diferencia.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="flex flex-col gap-1.5 border-r border-zinc-100 pr-4">
            <label htmlFor="montoExento" className="text-sm font-medium text-zinc-700">
              Base exenta
            </label>
            <input
              id="montoExento"
              type="number"
              step="0.01"
              min="0"
              className={inputClass(!!errors.montoExento)}
              {...register("montoExento", { valueAsNumber: true })}
            />
            {errors.montoExento && (
              <p className="text-xs text-red-500">{errors.montoExento.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="montoBase" className="text-sm font-medium text-zinc-700">
              Base imponible
            </label>
            <input
              id="montoBase"
              type="number"
              step="0.01"
              min="0"
              className={inputClass(!!errors.montoBase)}
              {...register("montoBase", { valueAsNumber: true })}
            />
            {errors.montoBase && (
              <p className="text-xs text-red-500">{errors.montoBase.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 lg:col-span-2">
            <label htmlFor="porcentajeAlicuotaSnapshot" className="text-sm font-medium text-zinc-700">
              Alícuota IVA
            </label>
            <select
              id="porcentajeAlicuotaSnapshot"
              className={inputClass(!!errors.porcentajeAlicuotaSnapshot)}
              {...register("porcentajeAlicuotaSnapshot", { 
                setValueAs: (v) => v === "" || isNaN(v) ? null : Number(v) 
              })}
            >
              <option value="">Ninguna</option>
              <option value="0">0% (Exento)</option>
              {alicuotas.map((a) => (
                <option key={a.id} value={Number(a.porcentaje)}>
                  {a.nombre}
                </option>
              ))}
            </select>
            {errors.porcentajeAlicuotaSnapshot && (
              <p className="text-xs text-red-500">{errors.porcentajeAlicuotaSnapshot.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 border-r border-zinc-100 pr-4">
            <label htmlFor="impuestoIVA" className="text-sm font-medium text-zinc-700">
              IVA
            </label>
            <input
              id="impuestoIVA"
              type="number"
              step="0.01"
              min="0"
              className={inputClass(!!errors.impuestoIVA)}
              {...register("impuestoIVA", { valueAsNumber: true })}
            />
            {errors.impuestoIVA && (
              <p className="text-xs text-red-500">{errors.impuestoIVA.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="totalFactura" className="text-sm font-medium text-zinc-700">
              Total <span className="text-red-500">*</span>
            </label>
            <input
              id="totalFactura"
              type="number"
              step="0.01"
              min="0"
              className={inputClass(!!errors.totalFactura)}
              {...register("totalFactura", { valueAsNumber: true })}
            />
            {errors.totalFactura && (
              <p className="text-xs text-red-500">{errors.totalFactura.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Clasificación fiscal avanzada ── */}
      <details className="group border border-zinc-200 rounded-lg overflow-hidden">
        <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-semibold text-zinc-800 bg-zinc-50 hover:bg-zinc-100 transition-colors">
          Clasificación fiscal avanzada IVA
          <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="p-5 border-t border-zinc-200 bg-white space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 focus-within:relative">
              <label htmlFor="naturalezaIVA" className="text-sm font-medium text-zinc-900">
                Naturaleza IVA
              </label>
              <select
                id="naturalezaIVA"
                className={inputClass(false)}
                {...register("naturalezaIVA")}
              >
                <option value="GRAVADA">Gravada</option>
                <option value="EXENTA">Exenta</option>
                <option value="EXONERADA">Exonerada</option>
                <option value="NO_SUJETA">No Sujeta</option>
              </select>
              {watch("naturalezaIVA") !== "GRAVADA" && (
                <p className="text-xs text-amber-600 mt-1 flex items-start gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>No aplicará retención de IVA según la naturaleza seleccionada.</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-zinc-300 text-primary-600 focus:ring-primary-500 mt-0.5" {...register("ivaDiscriminado")} />
                <div>
                   <span className="text-sm font-medium text-zinc-900 leading-tight">IVA discriminado en factura</span>
                   {!watch("ivaDiscriminado") && <p className="text-xs mt-1 text-amber-600 font-medium">Factura sin desglose visual causa retención del 100%.</p>}
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-zinc-300 text-primary-600 focus:ring-primary-500 mt-0.5" {...register("cumpleRequisitosFormales")} />
                <div>
                   <span className="text-sm font-medium text-zinc-900 leading-tight">Cumple requisitos formales tributarios</span>
                   {!watch("cumpleRequisitosFormales") && <p className="text-xs mt-1 text-amber-600 font-medium">Factura sin formalidades causa retención del 100%.</p>}
                </div>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-4 border-t border-zinc-100">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded-sm border-zinc-300 text-primary-600 focus:ring-primary-500" {...register("esViatico")} />
                <span className="text-sm text-zinc-700 hover:text-zinc-900">Operación pagada como viático de empleado</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded-sm border-zinc-300 text-primary-600 focus:ring-primary-500" {...register("esGastoReembolsable")} />
                <span className="text-sm text-zinc-700 hover:text-zinc-900">Gasto reembolsable</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded-sm border-zinc-300 text-primary-600 focus:ring-primary-500" {...register("esServicioPublicoDomiciliario")} />
                <span className="text-sm text-zinc-700 hover:text-zinc-900">Servicio público domiciliario o afín</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded-sm border-zinc-300 text-primary-600 focus:ring-primary-500" {...register("tienePercepcionAnticipadaIVA")} />
                <span className="text-sm text-zinc-700 hover:text-zinc-900">Percepción anticipada de IVA (Importación)</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
                <input type="checkbox" className="rounded-sm border-zinc-300 text-primary-600 focus:ring-primary-500" {...register("esOperacionArticulo2RetencionTotal")} />
                <span className="text-sm text-zinc-700 hover:text-zinc-900">Operación del Art. 2 (Metales/piedras preciosas)</span>
             </label>
          </div>
        </div>
      </details>

      {/* ── Acciones ─────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 active:scale-[0.98] transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (periodoValido === false && !isEditing)}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Compra" : "Registrar Compra"}
        </button>
      </div>
    </form>
  );
}
