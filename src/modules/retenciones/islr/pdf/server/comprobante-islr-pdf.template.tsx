import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  data: any; // Comprobante con relaciones: empresa, proveedor, retencionesISLR (pago, etc.)
}

export function ComprobanteISLRPdfTemplate({ data }: Props) {
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
    <div style={{
      padding: '0',
      margin: '0',
      fontFamily: '"Inter", Arial, sans-serif',
      fontSize: '10px',
      color: '#18181b',
      backgroundColor: 'white',
      width: '100%',
    }}>
      <style>{`
        @page {
          size: 21.59cm 13.97cm;
          margin: 0.8cm;
        }
        .voucher-container {
          width: 100%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
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
        .uppercase { text-transform: uppercase; }
        .header-legal {
          font-size: 8px;
          color: #666;
        }
        .title {
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0;
          letter-spacing: -0.025em;
        }
        .badge {
          font-size: 12px;
          font-weight: bold;
          color: #4338ca;
          background-color: #eef2ff;
          padding: 6px 14px;
          border: 1px solid #c7d2fe;
          border-radius: 6px;
          display: inline-block;
        }
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #f4f4f5;
          margin-bottom: 6px;
          padding-bottom: 4px;
          text-transform: uppercase;
          font-size: 8px;
          color: #71717a;
          letter-spacing: 0.05em;
        }
        .data-box {
          padding: 10px;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          width: 48%;
          display: inline-block;
          vertical-align: top;
        }
        .monospaced {
           font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
        }
        .footer-legal {
          font-size: 7px;
          color: #a1a1aa;
          font-style: italic;
          line-height: normal;
          margin-top: 30px;
        }
        .signature-line {
          border-top: 1px solid #a1a1aa;
          padding-top: 6px;
          text-align: center;
          width: 45%;
          margin-top: 20px;
        }
      `}</style>

      <div className="voucher-container">
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ width: '65%' }}>
            <h1 className="title">Comprobante de Retención de ISLR</h1>
            <p className="header-legal" style={{ fontStyle: 'italic', marginTop: '4px' }}>
              Decreto N° 1.808 - Reglamento sobre Retenciones de ISLR / Gaceta Oficial N° 36.203
            </p>
          </div>
          <div style={{ textAlign: 'right', width: '35%' }}>
            <div className="badge">
              COMPROBANTE N°: {data.numeroComprobante}
            </div>
            <p style={{ marginTop: '6px', fontSize: '9px', fontWeight: 'bold', color: '#71717a' }}>
              Emisión: {format(new Date(data.fechaEmision), "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        {/* Datos en dos columnas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Agente */}
          <div className="data-box">
            <h3 className="section-title">Agente de Retención</h3>
            <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '2px 0' }}>{empresa.nombreFiscal}</p>
            <p style={{ margin: '4px 0', fontSize: '11px', fontWeight: 'bold' }} className="monospaced">RIF: {empresa.rif}</p>
            <p style={{ fontSize: '9px', color: '#52525b', marginTop: '4px', lineHeight: '1.3' }}>{empresa.direccion || "Dirección Fiscal No Registrada"}</p>
          </div>

          {/* Proveedor */}
          <div className="data-box" style={{ backgroundColor: '#fafafa' }}>
            <h3 className="section-title">Beneficiario / Sujeto Retenido</h3>
            <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '2px 0' }}>{proveedor.nombre}</p>
            <p style={{ margin: '4px 0', fontSize: '11px', fontWeight: 'bold' }} className="monospaced">RIF: {proveedor.rif}</p>
            <p style={{ fontSize: '10px', fontWeight: 'bold', color: '#1e1b4b', marginTop: '4px', textTransform: 'uppercase' }}>
              Período Fiscal: {data.periodoFiscal.codigoPeriodo}
            </p>
          </div>
        </div>

        {/* Tabla */}
        <table>
          <thead>
            <tr>
              <th>Fecha Pago</th>
              <th style={{ width: '80px' }}>Ref / N° Pago</th>
              <th>Concepto de Retención</th>
              <th className="text-right">Monto Pagado Bs.</th>
              <th className="text-right">Base Imponible Bs.</th>
              <th className="text-right">% Tarifa</th>
              <th className="text-right">Retenido Bs.</th>
            </tr>
          </thead>
          <tbody>
            {retencionesISLR.map((r: any) => (
              <tr key={r.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{format(new Date(r.pago.fechaPago), "dd/MM/yyyy")}</td>
                <td className="monospaced" style={{ fontSize: '8px' }}>{r.pago.referencia || "S/Ref"}</td>
                <td style={{ fontSize: '9px', lineHeight: '1.2' }}>
                   <span style={{ fontWeight: 'bold' }}>[{r.codigoConceptoSnapshot}]</span> {r.descripcionConceptoSnapshot}
                </td>
                <td className="text-right monospaced">{Number(r.pago.montoTotal).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right monospaced">{Number(r.baseCalculoSnapshot).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
                <td className="text-right">
                  {(Number(r.tarifaAplicadaSnapshot)).toFixed(2)}%
                </td>
                <td className="text-right monospaced" style={{ fontWeight: 'bold' }}>{Number(r.montoRetenido).toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#fafafa', fontWeight: 'bold', fontSize: '10px' }}>
              <td colSpan={3} className="text-right uppercase" style={{ paddingRight: '15px' }}>Totales Bs.</td>
              <td className="text-right monospaced">{totales.totalPagado.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
              <td className="text-right monospaced">{totales.totalBase.toLocaleString("de-DE", { minimumFractionDigits: 2 })}</td>
              <td></td>
              <td className="text-right monospaced" style={{ color: '#4338ca', fontSize: '12px' }}>
                {totales.totalRetenido.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Pie */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '65%' }}>
            <p className="footer-legal">
               “EL AGENTE DE RETENCIÓN ESTÁ OBLIGADO A ENTREGAR AL CONTRIBUYENTE UN COMPROBANTE POR CADA RETENCIÓN QUE EFECTÚE, DONDE SE INDIQUE EL MONTO DE LO PAGADO O ABONADO EN CUENTA Y EL IMPUESTO RETENIDO.” - Art. 24 del Reglamento de ISLR.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
               <div className="signature-line">
                  <p style={{ fontWeight: 'bold', margin: '0', fontSize: '9px' }}>Agente de Retención</p>
                  <p style={{ fontSize: '7px', margin: '2px 0' }}>(Sello de la Empresa)</p>
               </div>
               <div className="signature-line">
                  <p style={{ fontWeight: 'bold', margin: '0', fontSize: '9px' }}>Beneficiario / Sujeto</p>
                  <p style={{ fontSize: '7px', margin: '2px 0' }}>(Firma y Fecha Recibido)</p>
               </div>
            </div>
          </div>
          
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
             <p style={{ fontSize: '8px', color: '#a1a1aa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RetenSaaS Fiscal</p>
             <p style={{ fontSize: '6px', color: '#d4d4d8' }}>ID Doc: {data.id.slice(0,8)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
