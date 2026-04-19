import Link from "next/link";
import { ArrowLeft, Edit2, AlertCircle, Building2, User2, FileText, Calendar, ReceiptText, ShieldCheck, CreditCard } from "lucide-react";
import { RetencionIVACard } from "@/modules/retenciones/iva/ui/retencion-iva-card";
import { CalcularRetencionIVAButton } from "@/modules/retenciones/iva/ui/calcular-retencion-iva-button";
import { EmitirComprobanteIndividualButton } from "@/modules/retenciones/iva/comprobantes/ui/emitir-comprobante-individual-button";

type CompraDetail = {
  id: string;
  numeroFactura: string | null;
  numeroControl: string | null;
  fechaFactura: Date;
  montoExento: any;
  montoBase: any;
  impuestoIVA: any;
  totalFactura: any;
  estado: "REGISTRADA" | "ANULADA";
  tipoAjuste: string | null;
  motivoAjuste: string | null;
  // Campos fiscales extendidos
  naturalezaIVA: "GRAVADA" | "EXENTA" | "EXONERADA" | "NO_SUJETA";
  esViatico: boolean;
  esGastoReembolsable: boolean;
  esServicioPublicoDomiciliario: boolean;
  esOperacionArticulo2RetencionTotal: boolean;
  tienePercepcionAnticipadaIVA: boolean;
  ivaDiscriminado: boolean;
  cumpleRequisitosFormales: boolean;
  valorUTSnapshot: any;
  montoOperacionUTSnapshot: any;

  createdAt: Date;
  updatedAt: Date;
  empresa: { id: string; nombreFiscal: string };
  proveedor: { id: string; nombre: string; rif: string };
  tipoDocumento: { codigo: string; descripcion: string };
  periodoFiscal: { codigoPeriodo: string; estado: string };
  documentoAfectado?: {
    id: string;
    numeroFactura: string | null;
    tipoDocumento: { codigo: string; descripcion: string };
  } | null;
  retencionIVA?: any;
};

function formatMonto(val: any) {
  return Number(val).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatFecha(date: Date | string) {
  return new Date(date).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-3 border-b border-zinc-100 last:border-0">
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="text-sm text-zinc-900">{value}</dd>
    </div>
  );
}

export function CompraDetail({ compra }: { compra: CompraDetail }) {
  const periodoCerrado = compra.periodoFiscal.estado === "CERRADO";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/compras"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al listado
        </Link>
        <div className="flex gap-2">
          {!periodoCerrado && !compra.retencionIVA?.comprobanteIVAId && compra.estado === "REGISTRADA" && (
            <CalcularRetencionIVAButton compraId={compra.id} />
          )}
          {!periodoCerrado && !!compra.retencionIVA && !compra.retencionIVA.comprobanteIVAId && compra.estado === "REGISTRADA" && (
            <EmitirComprobanteIndividualButton retencionId={compra.retencionIVA.id} />
          )}
          {!periodoCerrado && (
            <Link
              href={`/compras/${compra.id}/editar`}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Editar
            </Link>
          )}
        </div>
      </div>

      {/* Alerta período cerrado */}
      {periodoCerrado && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Este documento pertenece al período fiscal{" "}
            <strong>{compra.periodoFiscal.codigoPeriodo}</strong>, que está{" "}
            <strong>cerrado</strong>. No puede ser editado.
          </p>
        </div>
      )}

      {/* Estado del documento */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <ReceiptText className="h-5 w-5 text-zinc-400" />
            <h2 className="text-base font-semibold text-zinc-900">
              {compra.tipoDocumento.codigo} — {compra.numeroFactura || "Sin número"}
            </h2>
          </div>
          <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ${
              compra.estado === "REGISTRADA"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                : "bg-red-50 text-red-700 ring-red-600/20"
            }`}
          >
            {compra.estado === "REGISTRADA" ? "Registrada" : "Anulada"}
          </span>
        </div>

        <dl className="px-6 py-4">
          <Row label="N° Control" value={compra.numeroControl || "—"} />
          <Row label="Fecha de factura" value={formatFecha(compra.fechaFactura)} />
          <Row label="Tipo de documento" value={`${compra.tipoDocumento.codigo} — ${compra.tipoDocumento.descripcion}`} />
          <Row
            label="Período fiscal"
            value={
              <span className="inline-flex items-center gap-1.5">
                <span className="font-mono">{compra.periodoFiscal.codigoPeriodo}</span>
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${
                    periodoCerrado
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {periodoCerrado ? "Cerrado" : "Abierto"}
                </span>
              </span>
            }
          />
        </dl>
      </div>

      {/* Clasificación Fiscal Avanzada */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-900">Clasificación Fiscal Avanzada (IVA)</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Naturaleza</span>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ${
                compra.naturalezaIVA === "GRAVADA" 
                  ? "bg-blue-50 text-blue-700 ring-blue-600/20" 
                  : "bg-amber-50 text-amber-700 ring-amber-600/20"
              }`}>
                {compra.naturalezaIVA}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Formalidades</span>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${
                compra.ivaDiscriminado 
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" 
                  : "bg-red-50 text-red-700 ring-red-600/20"
              }`}>
                {compra.ivaDiscriminado ? "IVA Discriminado" : "Sin Desglose IVA"}
              </span>
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${
                compra.cumpleRequisitosFormales 
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" 
                  : "bg-red-50 text-red-700 ring-red-600/20"
              }`}>
                {compra.cumpleRequisitosFormales ? "Requisitos OK" : "Falta Formato"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Contexto Operativo</span>
            <div className="flex flex-wrap gap-2">
              {compra.esViatico && <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-200 uppercase">Viático</span>}
              {compra.esGastoReembolsable && <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-200 uppercase">Reembolsable</span>}
              {compra.esServicioPublicoDomiciliario && <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-200 uppercase">Serv. Público</span>}
              {compra.esOperacionArticulo2RetencionTotal && <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200 uppercase">Art. 2</span>}
              {compra.tienePercepcionAnticipadaIVA && <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200 uppercase">Percepción</span>}
              {!compra.esViatico && !compra.esGastoReembolsable && !compra.esServicioPublicoDomiciliario && !compra.esOperacionArticulo2RetencionTotal && !compra.tienePercepcionAnticipadaIVA && (
                <span className="text-sm text-zinc-400 font-medium">Estándar</span>
              )}
            </div>
          </div>
        </div>

        {compra.valorUTSnapshot && (
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
               <span>Valor UT (Snapshot): Bs. {formatMonto(compra.valorUTSnapshot)}</span>
               {compra.montoOperacionUTSnapshot && (
                 <>
                   <span>·</span>
                   <span className="font-semibold text-zinc-700">{Number(compra.montoOperacionUTSnapshot).toFixed(4)} UT</span>
                 </>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Empresa y Proveedor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-700">Empresa</h3>
          </div>
          <p className="text-sm font-medium text-zinc-900">{compra.empresa.nombreFiscal}</p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <User2 className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-700">Proveedor</h3>
          </div>
          <p className="text-sm font-medium text-zinc-900">{compra.proveedor.nombre}</p>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">{compra.proveedor.rif}</p>
        </div>
      </div>

      {/* Documento afectado */}
      {compra.documentoAfectado && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">Documento afectado</h3>
          </div>
          <p className="text-sm text-amber-700">
            {compra.documentoAfectado.tipoDocumento.codigo} —{" "}
            {compra.documentoAfectado.numeroFactura || "S/N"}
          </p>
          {compra.tipoAjuste && (
            <p className="mt-1 text-xs text-amber-600">
              Tipo de ajuste: <strong>{compra.tipoAjuste}</strong>
              {compra.motivoAjuste && ` · ${compra.motivoAjuste}`}
            </p>
          )}
        </div>
      )}

      {/* Montos y Retención */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Montos */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
            <h3 className="text-sm font-semibold text-zinc-700">Montos (Bs.)</h3>
          </div>
          <div className="px-6 py-4 flex-1 flex flex-col">
            <dl className="space-y-0 flex-1">
              <Row label="Base exenta" value={<span className="font-mono">{formatMonto(compra.montoExento)}</span>} />
              <Row label="Base imponible" value={<span className="font-mono">{formatMonto(compra.montoBase)}</span>} />
              <Row label="IVA" value={<span className="font-mono">{formatMonto(compra.impuestoIVA)}</span>} />
            </dl>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-200">
              <span className="text-sm font-semibold text-zinc-700">Total factura</span>
              <span className="text-lg font-bold text-zinc-900 font-mono">
                {formatMonto(compra.totalFactura)}
              </span>
            </div>
          </div>
        </div>

        <RetencionIVACard retencionIVA={compra.retencionIVA} />
      </div>

      {/* Historial de Pagos y Saldo */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-zinc-900 text-sm">Historial de Pagos y Saldo</h3>
          </div>
          {(() => {
            const totalPagado = (compra as any).pagoCompras?.reduce((sum: number, pc: any) => sum + Number(pc.montoAplicado), 0) || 0;
            const saldo = Number(compra.totalFactura) - totalPagado;
            return (
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                saldo <= 0.01 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}>
                {saldo <= 0.01 ? "Pagada" : `Saldo Pendiente: Bs. ${formatMonto(saldo)}`}
              </div>
            );
          })()}
        </div>
        
        <div className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/50 border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3">Fecha Pago</th>
                <th className="px-6 py-3">Referencia</th>
                <th className="px-6 py-3">Evento</th>
                <th className="px-6 py-3 text-right">Monto Aplicado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {((compra as any).pagoCompras?.length || 0) === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-400">
                    No hay pagos registrados para esta compra.
                  </td>
                </tr>
              ) : (
                (compra as any).pagoCompras?.map((pc: any) => (
                  <tr key={pc.pago.id} className="hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {formatFecha(pc.pago.fechaPago)}
                    </td>
                    <td className="px-6 py-4 font-mono">
                      {pc.pago.referencia || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {pc.pago.tipoEventoRetencion === "PAGO_EFECTIVO" ? "Pago" : "Abono"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      Bs. {formatMonto(pc.montoAplicado)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Creado: {formatFecha(compra.createdAt)}
        </span>
        <span>·</span>
        <span>Actualizado: {formatFecha(compra.updatedAt)}</span>
      </div>
    </div>
  );
}
