"use strict";(()=>{var e={};e.id=4645,e.ids=[4645],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78018:e=>{e.exports=require("puppeteer")},39491:e=>{e.exports=require("assert")},50852:e=>{e.exports=require("async_hooks")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},63477:e=>{e.exports=require("querystring")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},28788:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>A,patchFetch:()=>F,requestAsyncStorage:()=>w,routeModule:()=>y,serverHooks:()=>N,staticGenerationAsyncStorage:()=>v});var i={};r.r(i),r.d(i,{GET:()=>j});var a=r(49303),n=r(88716),o=r(60670),s=r(87070),l=r(75571),d=r(37078),c=r(78018),p=r.n(c),m=r(13538),x=r(19510),h=r(89997);function u({data:e}){let{empresa:t,proveedor:r,retencionesIVA:i}=e,a=i.reduce((e,t)=>(e.total+=Number(t.compra.totalFactura),e.base+=Number(t.compra.montoBase),e.ivaCausado+=Number(t.compra.impuestoIVA),e.ivaRetenido+=Number(t.montoRetenido),e),{total:0,base:0,ivaCausado:0,ivaRetenido:0});return(0,x.jsxs)("div",{style:{padding:"0",margin:"0",fontFamily:'"Inter", Arial, sans-serif',fontSize:"10px",color:"#18181b",backgroundColor:"white",width:"100%"},children:[x.jsx("style",{children:`
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
      `}),(0,x.jsxs)("div",{className:"voucher-container",children:[(0,x.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"},children:[(0,x.jsxs)("div",{children:[x.jsx("h1",{className:"title",children:"Comprobante de Retenci\xf3n de IVA"}),x.jsx("p",{className:"header-legal",children:"Ley del IVA - Art. 11 / Providencia Administrativa SNAT/2015/0049"})]}),(0,x.jsxs)("div",{style:{textAlign:"right"},children:[(0,x.jsxs)("div",{className:"badge",children:["COMPROBANTE N\xba: ",e.numeroComprobante]}),(0,x.jsxs)("p",{style:{marginTop:"4px",fontSize:"9px",color:"#71717a"},children:["Fecha de Emisi\xf3n: ",(0,h.WU)(new Date(e.fechaEmision),"dd/MM/yyyy")]})]})]}),(0,x.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"16px"},children:[(0,x.jsxs)("div",{className:"data-box",children:[x.jsx("h3",{className:"section-title",children:"Agente de Retenci\xf3n"}),x.jsx("p",{style:{fontWeight:"bold",fontSize:"12px",margin:"2px 0"},children:t.nombreFiscal}),(0,x.jsxs)("p",{style:{margin:"2px 0"},children:["RIF: ",t.rif]}),x.jsx("p",{style:{fontSize:"9px",color:"#52525b",marginTop:"2px",lineHeight:"1.2"},children:t.direccion})]}),(0,x.jsxs)("div",{className:"data-box",children:[x.jsx("h3",{className:"section-title",children:"Proveedor / Sujeto Retenido"}),x.jsx("p",{style:{fontWeight:"bold",fontSize:"12px",margin:"2px 0"},children:r.nombre}),(0,x.jsxs)("p",{style:{margin:"2px 0"},children:["RIF: ",r.rif]}),(0,x.jsxs)("p",{style:{fontSize:"9px",color:"#52525b",marginTop:"2px"},children:["Per\xedodo Fiscal: ",i[0]?.periodoFiscal?.codigoPeriodo]})]})]}),(0,x.jsxs)("table",{children:[x.jsx("thead",{children:(0,x.jsxs)("tr",{children:[x.jsx("th",{children:"Fecha"}),x.jsx("th",{children:"Factura / Doc."}),x.jsx("th",{children:"N\xba Control"}),x.jsx("th",{children:"Tipo"}),x.jsx("th",{children:"Afecta"}),x.jsx("th",{className:"text-right",children:"Total Bs."}),x.jsx("th",{className:"text-right",children:"Base Bs."}),x.jsx("th",{className:"text-right",children:"% IVA"}),x.jsx("th",{className:"text-right",children:"IVA Bs."}),x.jsx("th",{className:"text-right",children:"Retenido Bs."})]})}),x.jsx("tbody",{children:i.map(e=>(0,x.jsxs)("tr",{children:[x.jsx("td",{children:(0,h.WU)(new Date(e.compra.fechaFactura),"dd/MM/yy")}),x.jsx("td",{children:e.compra.numeroFactura}),x.jsx("td",{children:e.compra.numeroControl}),x.jsx("td",{children:e.compra.tipoDocumento.codigo}),x.jsx("td",{children:e.compra.documentoAfectado?.numeroFactura||"—"}),x.jsx("td",{className:"text-right",children:Number(e.compra.totalFactura).toLocaleString("es-VE",{minimumFractionDigits:2})}),x.jsx("td",{className:"text-right",children:Number(e.compra.montoBase).toLocaleString("es-VE",{minimumFractionDigits:2})}),(0,x.jsxs)("td",{className:"text-right",children:[Number(e.porcentajeRetencionSnapshot).toFixed(0),"%"]}),x.jsx("td",{className:"text-right",children:Number(e.compra.impuestoIVA).toLocaleString("es-VE",{minimumFractionDigits:2})}),x.jsx("td",{className:"text-right",style:{fontWeight:"bold"},children:Number(e.montoRetenido).toLocaleString("es-VE",{minimumFractionDigits:2})})]},e.id))}),x.jsx("tfoot",{children:(0,x.jsxs)("tr",{style:{backgroundColor:"#fafafa",fontWeight:"bold"},children:[x.jsx("td",{colSpan:5,className:"text-right uppercase",style:{fontSize:"8px"},children:"Totales Bs."}),x.jsx("td",{className:"text-right",children:a.total.toLocaleString("es-VE",{minimumFractionDigits:2})}),x.jsx("td",{className:"text-right",children:a.base.toLocaleString("es-VE",{minimumFractionDigits:2})}),x.jsx("td",{}),x.jsx("td",{className:"text-right",children:a.ivaCausado.toLocaleString("es-VE",{minimumFractionDigits:2})}),x.jsx("td",{className:"text-right",style:{color:"#4338ca",textDecoration:"underline"},children:a.ivaRetenido.toLocaleString("es-VE",{minimumFractionDigits:2})})]})})]}),(0,x.jsxs)("div",{style:{marginTop:"24px",display:"flex",justifyContent:"space-between"},children:[(0,x.jsxs)("div",{style:{width:"60%"},children:[x.jsx("p",{className:"footer-legal",children:"Este comprobante se emite en funci\xf3n de lo establecido en el Art\xedculo 11 de la Ley de Impuesto al Valor Agregado y la Providencia Administrativa SNAT/2015/0049 que regula la Retenci\xf3n del Impuesto al Valor Agregado."}),(0,x.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"20px"},children:[(0,x.jsxs)("div",{className:"signature-line",children:[x.jsx("p",{style:{fontWeight:"bold",margin:"0"},children:"Agente de Retenci\xf3n"}),x.jsx("p",{style:{fontSize:"8px",margin:"0"},children:"(Firma y Sello)"})]}),(0,x.jsxs)("div",{className:"signature-line",children:[x.jsx("p",{style:{fontWeight:"bold",margin:"0"},children:"Proveedor / Recibido"}),x.jsx("p",{style:{fontSize:"8px",margin:"0"},children:"(Firma y Fecha)"})]})]})]}),x.jsx("div",{style:{width:"35%",display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"flex-end"},children:x.jsx("p",{style:{fontSize:"7px",color:"#a1a1aa"},children:"Generado por RetenSaaS"})})]})]})]})}var g=r(71159),f=r.n(g);async function b(e,t){let{renderToStaticMarkup:i}=await r.e(3257).then(r.t.bind(r,43257,19)),a=await m._.comprobanteIVA.findFirst({where:{id:e,tenantId:t},include:{empresa:!0,proveedor:!0,retencionesIVA:{include:{compra:{include:{tipoDocumento:!0,documentoAfectado:!0}},periodoFiscal:!0}}}});if(!a)throw Error("Comprobante no encontrado o no pertenece al tenant");let n=i(f().createElement(u,{data:a})),o=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        ${n}
      </body>
    </html>
  `,s=await p().launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox"]}),l=await s.newPage();await l.setContent(o,{waitUntil:"networkidle0"});let d=await l.pdf({width:"21.59cm",height:"13.97cm",printBackground:!0,margin:{top:"0cm",bottom:"0cm",left:"0cm",right:"0cm"}});return await s.close(),{buffer:d,numeroComprobante:a.numeroComprobante,rifEmpresa:a.empresa.rif}}async function j(e,{params:t}){try{let e=await (0,l.getServerSession)(d.L),r=e?.user?.tenantId;if(!r)return s.NextResponse.json({error:"No autorizado"},{status:401});let{id:i}=t,{buffer:a,numeroComprobante:n,rifEmpresa:o}=await b(i,r),c=(o||"").replace(/[^a-zA-Z0-9]/g,""),p=(n||"").replace(/[^a-zA-Z0-9]/g,"_"),m=`comprobante_iva_${c}_${p}.pdf`;return new s.NextResponse(a,{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${m}"`}})}catch(e){return console.error("Error generando PDF:",e),s.NextResponse.json({error:e.message||"Error interno al generar PDF"},{status:500})}}let y=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/retenciones/iva/comprobantes/[id]/pdf/route",pathname:"/api/retenciones/iva/comprobantes/[id]/pdf",filename:"route",bundlePath:"app/api/retenciones/iva/comprobantes/[id]/pdf/route"},resolvedPagePath:"C:\\Users\\Usuario\\.gemini\\antigravity\\playground\\retencion-app\\src\\app\\api\\retenciones\\iva\\comprobantes\\[id]\\pdf\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:w,staticGenerationAsyncStorage:v,serverHooks:N}=y,A="/api/retenciones/iva/comprobantes/[id]/pdf/route";function F(){return(0,o.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:v})}},13538:(e,t,r)=>{r.d(t,{_:()=>a});var i=r(53524);let a=globalThis.prisma??new i.PrismaClient({log:["query","error","warn"]})},37078:(e,t,r)=>{r.d(t,{L:()=>o});var i=r(53797),a=r(98691),n=r(13538);let o={providers:[(0,i.Z)({name:"Credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Email y contrase\xf1a requeridos.");let t=await n._.usuario.findMany({where:{email:e.email}});if(0===t.length)throw Error("Usuario no encontrado.");if(t.length>1)throw Error("Este usuario pertenece a m\xfaltiples organizaciones. Selecci\xf3n de organizaci\xf3n no implementada a\xfan.");let r=t[0];if(!r.activo)throw Error("Usuario inactivo.");if(!await a.ZP.compare(e.password,r.passwordHash))throw Error("Contrase\xf1a incorrecta.");let i=await n._.empresa.findFirst({where:{tenantId:r.tenantId,deletedAt:null},orderBy:{createdAt:"asc"}});return{id:r.id,email:r.email,name:r.nombre,tenantId:r.tenantId,empresaActivaId:i?.id||null}}})],callbacks:{jwt:async({token:e,user:t})=>(t&&(e.id=t.id,e.tenantId=t.tenantId,e.empresaActivaId=t.empresaActivaId),e),session:async({session:e,token:t})=>(t&&e.user&&(e.user.id=t.id,e.user.tenantId=t.tenantId,e.user.empresaActivaId=t.empresaActivaId),e)},pages:{signIn:"/login",signOut:"/logout"},session:{strategy:"jwt"}}}};var t=require("../../../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[9276,9656,9997,41],()=>r(28788));module.exports=i})();