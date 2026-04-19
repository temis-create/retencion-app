import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  data: any; // Comprobante con relaciones: empresa, proveedor, retencionesIVA (con compra, tipoDocumento, etc.)
}

export function ComprobanteIVAPdfTemplate({ data }: Props) {
  const { empresa, proveedor, retencionesIVA } = data;
  
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
    <div style={{
      padding: '0',
      margin: '0',
      fontFamily: '"Inter", Arial, sans-serif',
      fontSize: '10px',
      color: '#18181b', // zinc-900
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
        }
        .badge {
          font-size: 12px;
          font-weight: bold;
          color: #4338ca; /* indigo-700 */
          background-color: #eef2ff; /* indigo-50 */
          padding: 4px 12px;
          border: 1px solid #c7d2fe; /* indigo-200 */
          border-radius: 4px;
          display: inline-block;
        }
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #f4f4f5; /* zinc-100 */
          margin-bottom: 4px;
          padding-bottom: 4px;
          text-transform: uppercase;
          font-size: 8px;
          color: #71717a; /* zinc-500 */
          letter-spacing: 0.05em;
        }
        .data-box {
          padding: 8px;
          border: 1px solid #e4e4e7; /* zinc-200 */
          border-radius: 4px;
          width: 48%;
          display: inline-block;
          vertical-align: top;
        }
        .flex-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .footer-legal {
          font-size: 7px;
          color: #a1a1aa; /* zinc-400 */
          font-style: italic;
          line-height: normal;
          margin-top: 24px;
        }
        .signature-line {
          border-top: 1px solid #a1a1aa;
          padding-top: 4px;
          text-align: center;
          width: 45%;
          margin-top: 16px;
        }
      `}</style>

      <div className="voucher-container">
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 className="title">Comprobante de Retención de IVA</h1>
            <p className="header-legal">
              Ley del IVA - Art. 11 / Providencia Administrativa SNAT/2015/0049
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="badge">
              COMPROBANTE Nº: {data.numeroComprobante}
            </div>
            <p style={{ marginTop: '4px', fontSize: '9px', color: '#71717a' }}>
              Fecha de Emisión: {format(new Date(data.fechaEmision), "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        {/* Datos en dos columnas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          {/* Agente */}
          <div className="data-box">
            <h3 className="section-title">Agente de Retención</h3>
            <p style={{ fontWeight: 'bold', fontSize: '12px', margin: '2px 0' }}>{empresa.nombreFiscal}</p>
            <p style={{ margin: '2px 0' }}>RIF: {empresa.rif}</p>
            <p style={{ fontSize: '9px', color: '#52525b', marginTop: '2px', lineHeight: '1.2' }}>{empresa.direccion}</p>
          </div>

          {/* Proveedor */}
          <div className="data-box">
            <h3 className="section-title">Proveedor / Sujeto Retenido</h3>
            <p style={{ fontWeight: 'bold', fontSize: '12px', margin: '2px 0' }}>{proveedor.nombre}</p>
            <p style={{ margin: '2px 0' }}>RIF: {proveedor.rif}</p>
            <p style={{ fontSize: '9px', color: '#52525b', marginTop: '2px' }}>
              Período Fiscal: {retencionesIVA[0]?.periodoFiscal?.codigoPeriodo}
            </p>
          </div>
        </div>

        {/* Tabla */}
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Factura / Doc.</th>
              <th>Nº Control</th>
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
                <td className="text-right" style={{ fontWeight: 'bold' }}>{Number(r.montoRetenido).toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#fafafa', fontWeight: 'bold' }}>
              <td colSpan={5} className="text-right uppercase" style={{ fontSize: '8px' }}>Totales Bs.</td>
              <td className="text-right">{totales.total.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              <td className="text-right">{totales.base.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              <td></td>
              <td className="text-right">{totales.ivaCausado.toLocaleString("es-VE", { minimumFractionDigits: 2 })}</td>
              <td className="text-right" style={{ color: '#4338ca', textDecoration: 'underline' }}>
                {totales.ivaRetenido.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Pie */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '60%' }}>
            <p className="footer-legal">
              Este comprobante se emite en función de lo establecido en el Artículo 11 de la Ley de Impuesto al Valor Agregado y la Providencia Administrativa SNAT/2015/0049 que regula la Retención del Impuesto al Valor Agregado.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
               <div className="signature-line">
                  <p style={{ fontWeight: 'bold', margin: '0' }}>Agente de Retención</p>
                  <p style={{ fontSize: '8px', margin: '0' }}>(Firma y Sello)</p>
               </div>
               <div className="signature-line">
                  <p style={{ fontWeight: 'bold', margin: '0' }}>Proveedor / Recibido</p>
                  <p style={{ fontSize: '8px', margin: '0' }}>(Firma y Fecha)</p>
               </div>
            </div>
          </div>
          
          <div style={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
             <p style={{ fontSize: '7px', color: '#a1a1aa' }}>Generado por RetenSaaS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
