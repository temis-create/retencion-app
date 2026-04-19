"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  data: any; // Comprobante con relaciones: empresa, proveedor, retencionesISLR (pago, periodoFiscal)
}

export function ComprobanteISLRPrint({ data }: Props) {
  const { empresa, proveedor, retencionesISLR } = data;

  // Totales
  const totales = retencionesISLR.reduce(
    (acc: any, curr: any) => {
      acc.totalPagado += Number(curr.pago.montoTotal);
      acc.totalBase += Number(curr.baseCalculoSnapshot);
      acc.totalRetenido += Number(curr.montoRetenido);
      return acc;
    },
    { totalPagado: 0, totalBase: 0, totalRetenido: 0 }
  );

  return (
    <div className="bg-white text-zinc-900 p-0 m-0 print:m-0 print:p-0">
      <style jsx global>{`
        @page {
          size: 21.59cm 13.97cm;
          margin: 0.8cm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
        .voucher-container {
          width: 100%;
          font-family: "Inter", Arial, sans-serif;
          font-size: 10px;
          line-height: 1.2;
        }
        .header-legal {
          font-size: 8px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }
        th, td {
          border: 0.5px solid #ccc;
          padding: 4px 6px;
          text-align: left;
        }
        th {
          background-color: #f7f7f7;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 8px;
        }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .border-t-2 { border-top: 2px solid #000; }
        .monospaced { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      `}</style>

      <div className="voucher-container">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h1 className="text-sm font-bold uppercase tracking-tight">Comprobante de Retención de Impuesto Sobre La Renta (ISLR)</h1>
            <p className="header-legal italic">
              Decreto N° 1.808 - Reglamento sobre Retenciones de ISLR / Gaceta Oficial N° 36.203
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 border border-indigo-200 rounded">
              COMPROBANTE N°: {data.numeroComprobante}
            </div>
            <p className="mt-1 text-[9px] text-zinc-500 font-medium">
              Fecha de Emisión: {format(new Date(data.fechaEmision), "dd/MM/yyyy", { locale: es })}
            </p>
          </div>
        </div>

        {/* Datos Principales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Agente */}
          <div className="p-3 border border-zinc-200 rounded-lg">
            <h3 className="font-bold border-b border-zinc-100 mb-2 pb-1 uppercase text-[8px] text-zinc-400 tracking-widest">
              Agente de Retención
            </h3>
            <p className="font-bold text-xs leading-tight">{empresa.nombreFiscal}</p>
            <p className="text-[10px] mt-1 font-mono">RIF: {empresa.rif}</p>
            <p className="text-[9px] text-zinc-500 leading-tight mt-1 truncate">{empresa.direccion || "Dirección Fiscal No Registrada"}</p>
          </div>

          {/* Proveedor */}
          <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50/50">
            <h3 className="font-bold border-b border-zinc-100 mb-2 pb-1 uppercase text-[8px] text-zinc-400 tracking-widest">
              Beneficiario / Sujeto Retenido
            </h3>
            <p className="font-bold text-xs leading-tight">{proveedor.nombre}</p>
            <p className="text-[10px] mt-1 font-mono">RIF: {proveedor.rif}</p>
            <p className="text-[9px] text-zinc-500 leading-tight mt-1 uppercase font-bold">
              Período Fiscal: {data.periodoFiscal.codigoPeriodo}
            </p>
          </div>
        </div>

        {/* Tabla de Detalle */}
        <table>
          <thead>
            <tr>
              <th>Fecha Pago</th>
              <th>Ref / N° Pago</th>
              <th>Concepto de Retención</th>
              <th className="text-right">Monto Pagado Bs.</th>
              <th className="text-right">Base Imponible Bs.</th>
              <th className="text-right">% Tarifa</th>
              <th className="text-right">Monto Retenido Bs.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {retencionesISLR.map((r: any) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap">{format(new Date(r.pago.fechaPago), "dd/MM/yyyy")}</td>
                <td className="monospaced text-[9px]">{r.pago.referencia || "S/Ref"}</td>
                <td className="text-[9px] leading-tight max-w-[200px]">
                   <span className="font-bold">[{r.codigoConceptoSnapshot}]</span> {r.descripcionConceptoSnapshot}
                </td>
                <td className="text-right monospaced">{Number(r.pago.montoTotal).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right monospaced">{Number(r.baseCalculoSnapshot).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right font-medium">
                  {(Number(r.tarifaAplicadaSnapshot)).toFixed(2)}%
                  {Number(r.sustraendoSnapshot) > 0 && (
                      <div className="text-[7px] text-rose-500">Sub: {Number(r.sustraendoSnapshot).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</div>
                  )}
                </td>
                <td className="text-right font-bold monospaced">{Number(r.montoRetenido).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 bg-zinc-50/30">
            <tr className="font-bold uppercase text-[9px]">
              <td colSpan={3} className="text-right pr-4">Totales del Comprobante:</td>
              <td className="text-right monospaced">{totales.totalPagado.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
              <td className="text-right monospaced">{totales.totalBase.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
              <td></td>
              <td className="text-right text-indigo-700 text-xs monospaced border-l border-zinc-200">
                {totales.totalRetenido.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Pie de firmas */}
        <div className="mt-10 grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-[7px] text-zinc-400 italic leading-snug">
               “EL AGENTE DE RETENCIÓN ESTÁ OBLIGADO A ENTREGAR AL CONTRIBUYENTE UN COMPROBANTE POR CADA RETENCIÓN QUE EFECTÚE, DONDE SE INDIQUE EL MONTO DE LO PAGADO O ABONADO EN CUENTA Y EL IMPUESTO RETENIDO.” - Art. 24 del Reglamento.
            </p>
            <div className="flex gap-10">
               <div className="flex-1 border-t-0.5 border-zinc-400 pt-1 text-center">
                  <p className="font-bold text-[9px]">Firma Agente de Retención</p>
                  <p className="text-[7px] text-zinc-500 mt-0.5">(Sello de la Empresa)</p>
               </div>
               <div className="flex-1 border-t-0.5 border-zinc-400 pt-1 text-center">
                  <p className="font-bold text-[9px]">Firma Beneficiario / Sujeto</p>
                  <p className="text-[7px] text-zinc-500 mt-0.5">Fecha Recibido: ___/___/______</p>
               </div>
            </div>
          </div>
          
          <div className="no-print flex flex-col items-end justify-start pt-4">
             <button 
                onClick={() => window.print()}
                className="bg-zinc-900 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all shadow-xl flex items-center gap-2 active:scale-95"
             >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                IMPRIMIR COMPROBANTE
             </button>
             <p className="text-[8px] text-zinc-400 mt-3 font-bold uppercase tracking-widest">
                Media Carta Horizontal (21.59 x 13.97 cm)
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
