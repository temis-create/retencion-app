"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  data: any; // Comprobante con relaciones
}

export function ComprobanteIVAPrint({ data }: Props) {
  useEffect(() => {
    // Auto trigger print if wanted, or let user click
    // For MVP we just show the view and user can window.print()
  }, []);

  const { empresa, proveedor, retencionesIVA } = data;
  const firstRetencion = retencionesIVA[0];
  const periodo = firstRetencion?.periodoFiscal;

  // Totales
  const totales = retencionesIVA.reduce(
    (acc: any, curr: any) => {
      acc.total += Number(curr.compra.totalFactura);
      acc.base += Number(curr.compra.montoBase);
      acc.ivaCausado += Number(curr.compra.impuestoIVA);
      acc.ivaRetenido += Number(curr.montoRetenido);
      return acc;
    },
    { total: 0, base: 0, ivaCausado: 0, ivaRetenido: 0 }
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
          margin-top: 5px;
        }
        th, td {
          border: 0.5px solid #ccc;
          padding: 3px 5px;
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
      `}</style>

      <div className="voucher-container">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h1 className="text-sm font-bold uppercase">Comprobante de Retencin de IVA</h1>
            <p className="header-legal">
              Ley del IVA - Art. 11 / Providencia Administrativa SNAT/2015/0049
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 border border-indigo-200 rounded">
              COMPROBANTE N: {data.numeroComprobante}
            </div>
            <p className="mt-1 text-[9px] text-zinc-500">
              Fecha de Emisin: {format(new Date(data.fechaEmision), "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        {/* Datos Principales */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Agente */}
          <div className="p-2 border border-zinc-200 rounded">
            <h3 className="font-bold border-b border-zinc-100 mb-1 pb-1 uppercase text-[8px] text-zinc-500 tracking-wider">
              Agente de Retencin
            </h3>
            <p className="font-bold text-xs">{empresa.nombreFiscal}</p>
            <p>RIF: {empresa.rif}</p>
            <p className="text-[9px] text-zinc-600 leading-tight mt-0.5">{empresa.direccion}</p>
          </div>

          {/* Proveedor */}
          <div className="p-2 border border-zinc-200 rounded">
            <h3 className="font-bold border-b border-zinc-100 mb-1 pb-1 uppercase text-[8px] text-zinc-500 tracking-wider">
              Proveedor / Sujeto Retenido
            </h3>
            <p className="font-bold text-xs">{proveedor.nombre}</p>
            <p>RIF: {proveedor.rif}</p>
            <p className="text-[9px] text-zinc-600 leading-tight mt-0.5">
              Estado de Perodo: {periodo?.codigoPeriodo}
            </p>
          </div>
        </div>

        {/* Tabla de Detalle */}
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Factura / Doc.</th>
              <th>N Control</th>
              <th>Tipo</th>
              <th>Afecta</th>
              <th className="text-right">Total Bs.</th>
              <th className="text-right">Base Bs.</th>
              <th className="text-right">% IVA</th>
              <th className="text-right">IVA Bs.</th>
              <th className="text-right">Retenido Bs.</th>
            </tr>
          </thead>
          <tbody>
            {retencionesIVA.map((r: any) => (
              <tr key={r.id}>
                <td>{format(new Date(r.compra.fechaFactura), "dd/MM/yy")}</td>
                <td>{r.compra.numeroFactura}</td>
                <td>{r.compra.numeroControl}</td>
                <td>{r.compra.tipoDocumento.codigo}</td>
                <td>{r.compra.documentoAfectado?.numeroFactura || "—"}</td>
                <td className="text-right">{Number(r.compra.totalFactura).toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right">{Number(r.compra.montoBase).toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right">{Number(r.porcentajeRetencionSnapshot).toFixed(0)}%</td>
                <td className="text-right">{Number(r.compra.impuestoIVA).toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right font-bold">{Number(r.montoRetenido).toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-zinc-50 font-bold">
              <td colSpan={5} className="text-right uppercase text-[8px]">Totales Bs.</td>
              <td className="text-right">{totales.total.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              <td className="text-right">{totales.base.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              <td></td>
              <td className="text-right">{totales.ivaCausado.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              <td className="text-right text-indigo-700 underline underline-offset-2">
                {totales.ivaRetenido.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Pie Legal y firmas */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[7px] text-zinc-400 italic leading-snug">
              Este comprobante se emite en funcin de lo establecido en el Artculo 11 de la Ley de Impuesto al Valor Agregado y la Providencia Administrativa SNAT/2015/0049 que regula la Retencin del Impuesto al Valor Agregado.
            </p>
            <div className="flex gap-4">
               <div className="flex-1 border-t border-zinc-400 pt-1 text-center">
                  <p className="font-bold">Agente de Retencin</p>
                  <p className="text-[8px]">(Firma y Sello)</p>
               </div>
               <div className="flex-1 border-t border-zinc-400 pt-1 text-center">
                  <p className="font-bold">Proveedor / Recibido</p>
                  <p className="text-[8px]">(Firma y Fecha)</p>
               </div>
            </div>
          </div>
          
          <div className="no-print flex flex-col items-end justify-center">
             <button 
                onClick={() => window.print()}
                className="bg-zinc-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-zinc-800 transition-colors shadow-lg flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir Comprobante
             </button>
             <p className="text-[8px] text-zinc-400 mt-2">
                Presione CTRL + P si el botn no funciona
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
