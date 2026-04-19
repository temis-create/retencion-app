"use strict";(()=>{var e={};e.id=9672,e.ids=[9672],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78018:e=>{e.exports=require("puppeteer")},39491:e=>{e.exports=require("assert")},50852:e=>{e.exports=require("async_hooks")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},63477:e=>{e.exports=require("querystring")},12781:e=>{e.exports=require("stream")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},14915:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>S,patchFetch:()=>N,requestAsyncStorage:()=>j,routeModule:()=>b,serverHooks:()=>R,staticGenerationAsyncStorage:()=>w});var n={};r.r(n),r.d(n,{GET:()=>y});var o=r(49303),i=r(88716),a=r(60670),s=r(87070),l=r(95456),d=r(78018),c=r.n(d),p=r(13538),u=r(19510),f=r(89997);function m({data:e}){let{empresa:t,proveedor:r,retencionesISLR:n}=e,o=n.reduce((e,t)=>(e.totalPagado+=Number(t.pago.montoTotal),e.totalBase+=Number(t.baseCalculoSnapshot),e.totalRetenido+=Number(t.montoRetenido),e),{totalPagado:0,totalBase:0,totalRetenido:0});return(0,u.jsxs)("div",{style:{padding:"0",margin:"0",fontFamily:'"Inter", Arial, sans-serif',fontSize:"10px",color:"#18181b",backgroundColor:"white",width:"100%"},children:[u.jsx("style",{children:`
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
      `}),(0,u.jsxs)("div",{className:"voucher-container",children:[(0,u.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"},children:[(0,u.jsxs)("div",{style:{width:"65%"},children:[u.jsx("h1",{className:"title",children:"Comprobante de Retenci\xf3n de ISLR"}),u.jsx("p",{className:"header-legal",style:{fontStyle:"italic",marginTop:"4px"},children:"Decreto N\xb0 1.808 - Reglamento sobre Retenciones de ISLR / Gaceta Oficial N\xb0 36.203"})]}),(0,u.jsxs)("div",{style:{textAlign:"right",width:"35%"},children:[(0,u.jsxs)("div",{className:"badge",children:["COMPROBANTE N\xb0: ",e.numeroComprobante]}),(0,u.jsxs)("p",{style:{marginTop:"6px",fontSize:"9px",fontWeight:"bold",color:"#71717a"},children:["Emisi\xf3n: ",(0,f.WU)(new Date(e.fechaEmision),"dd/MM/yyyy")]})]})]}),(0,u.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"20px"},children:[(0,u.jsxs)("div",{className:"data-box",children:[u.jsx("h3",{className:"section-title",children:"Agente de Retenci\xf3n"}),u.jsx("p",{style:{fontWeight:"bold",fontSize:"13px",margin:"2px 0"},children:t.nombreFiscal}),(0,u.jsxs)("p",{style:{margin:"4px 0",fontSize:"11px",fontWeight:"bold"},className:"monospaced",children:["RIF: ",t.rif]}),u.jsx("p",{style:{fontSize:"9px",color:"#52525b",marginTop:"4px",lineHeight:"1.3"},children:t.direccion||"Direcci\xf3n Fiscal No Registrada"})]}),(0,u.jsxs)("div",{className:"data-box",style:{backgroundColor:"#fafafa"},children:[u.jsx("h3",{className:"section-title",children:"Beneficiario / Sujeto Retenido"}),u.jsx("p",{style:{fontWeight:"bold",fontSize:"13px",margin:"2px 0"},children:r.nombre}),(0,u.jsxs)("p",{style:{margin:"4px 0",fontSize:"11px",fontWeight:"bold"},className:"monospaced",children:["RIF: ",r.rif]}),(0,u.jsxs)("p",{style:{fontSize:"10px",fontWeight:"bold",color:"#1e1b4b",marginTop:"4px",textTransform:"uppercase"},children:["Per\xedodo Fiscal: ",e.periodoFiscal.codigoPeriodo]})]})]}),(0,u.jsxs)("table",{children:[u.jsx("thead",{children:(0,u.jsxs)("tr",{children:[u.jsx("th",{children:"Fecha Pago"}),u.jsx("th",{style:{width:"80px"},children:"Ref / N\xb0 Pago"}),u.jsx("th",{children:"Concepto de Retenci\xf3n"}),u.jsx("th",{className:"text-right",children:"Monto Pagado Bs."}),u.jsx("th",{className:"text-right",children:"Base Imponible Bs."}),u.jsx("th",{className:"text-right",children:"% Tarifa"}),u.jsx("th",{className:"text-right",children:"Retenido Bs."})]})}),u.jsx("tbody",{children:n.map(e=>(0,u.jsxs)("tr",{children:[u.jsx("td",{style:{whiteSpace:"nowrap"},children:(0,f.WU)(new Date(e.pago.fechaPago),"dd/MM/yyyy")}),u.jsx("td",{className:"monospaced",style:{fontSize:"8px"},children:e.pago.referencia||"S/Ref"}),(0,u.jsxs)("td",{style:{fontSize:"9px",lineHeight:"1.2"},children:[(0,u.jsxs)("span",{style:{fontWeight:"bold"},children:["[",e.codigoConceptoSnapshot,"]"]})," ",e.descripcionConceptoSnapshot]}),u.jsx("td",{className:"text-right monospaced",children:Number(e.pago.montoTotal).toLocaleString("de-DE",{minimumFractionDigits:2})}),u.jsx("td",{className:"text-right monospaced",children:Number(e.baseCalculoSnapshot).toLocaleString("de-DE",{minimumFractionDigits:2})}),(0,u.jsxs)("td",{className:"text-right",children:[Number(e.tarifaAplicadaSnapshot).toFixed(2),"%"]}),u.jsx("td",{className:"text-right monospaced",style:{fontWeight:"bold"},children:Number(e.montoRetenido).toLocaleString("de-DE",{minimumFractionDigits:2})})]},e.id))}),u.jsx("tfoot",{children:(0,u.jsxs)("tr",{style:{backgroundColor:"#fafafa",fontWeight:"bold",fontSize:"10px"},children:[u.jsx("td",{colSpan:3,className:"text-right uppercase",style:{paddingRight:"15px"},children:"Totales Bs."}),u.jsx("td",{className:"text-right monospaced",children:o.totalPagado.toLocaleString("de-DE",{minimumFractionDigits:2})}),u.jsx("td",{className:"text-right monospaced",children:o.totalBase.toLocaleString("de-DE",{minimumFractionDigits:2})}),u.jsx("td",{}),u.jsx("td",{className:"text-right monospaced",style:{color:"#4338ca",fontSize:"12px"},children:o.totalRetenido.toLocaleString("de-DE",{minimumFractionDigits:2})})]})})]}),(0,u.jsxs)("div",{style:{marginTop:"30px",display:"flex",justifyContent:"space-between"},children:[(0,u.jsxs)("div",{style:{width:"65%"},children:[u.jsx("p",{className:"footer-legal",children:"“EL AGENTE DE RETENCI\xd3N EST\xc1 OBLIGADO A ENTREGAR AL CONTRIBUYENTE UN COMPROBANTE POR CADA RETENCI\xd3N QUE EFECT\xdaE, DONDE SE INDIQUE EL MONTO DE LO PAGADO O ABONADO EN CUENTA Y EL IMPUESTO RETENIDO.” - Art. 24 del Reglamento de ISLR."}),(0,u.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"25px"},children:[(0,u.jsxs)("div",{className:"signature-line",children:[u.jsx("p",{style:{fontWeight:"bold",margin:"0",fontSize:"9px"},children:"Agente de Retenci\xf3n"}),u.jsx("p",{style:{fontSize:"7px",margin:"2px 0"},children:"(Sello de la Empresa)"})]}),(0,u.jsxs)("div",{className:"signature-line",children:[u.jsx("p",{style:{fontWeight:"bold",margin:"0",fontSize:"9px"},children:"Beneficiario / Sujeto"}),u.jsx("p",{style:{fontSize:"7px",margin:"2px 0"},children:"(Firma y Fecha Recibido)"})]})]})]}),(0,u.jsxs)("div",{style:{width:"30%",display:"flex",flexDirection:"column",alignItems:"flex-end",justifyContent:"flex-end"},children:[u.jsx("p",{style:{fontSize:"8px",color:"#a1a1aa",fontWeight:"bold",textTransform:"uppercase",letterSpacing:"0.1em"},children:"RetenSaaS Fiscal"}),(0,u.jsxs)("p",{style:{fontSize:"6px",color:"#d4d4d8"},children:["ID Doc: ",e.id.slice(0,8)]})]})]})]})]})}var h=r(71159),g=r.n(h);async function x(e,t){let{renderToStaticMarkup:n}=await r.e(3257).then(r.t.bind(r,43257,19)),o=await p._.comprobanteISLR.findFirst({where:{id:e,tenantId:t},include:{empresa:!0,proveedor:!0,periodoFiscal:!0,retencionesISLR:{include:{pago:{include:{pagoCompras:{include:{compra:{include:{tipoDocumento:!0}}}}}}}}}});if(!o)throw Error("Comprobante ISLR no encontrado o no pertenece al tenant.");let i=n(g().createElement(m,{data:o})),a=`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        ${i}
      </body>
    </html>
  `,s=await c().launch({headless:!0,args:["--no-sandbox","--disable-setuid-sandbox"]}),l=await s.newPage();await l.setContent(a,{waitUntil:"networkidle0"});let d=await l.pdf({width:"21.59cm",height:"13.97cm",printBackground:!0,margin:{top:"0cm",bottom:"0cm",left:"0cm",right:"0cm"}});return await s.close(),{buffer:d,numeroComprobante:o.numeroComprobante,rifEmpresa:o.empresa.rif}}async function y(e,{params:t}){try{await (0,l.mk)();let e=await (0,l.jM)();if(!t.id)return new s.NextResponse("ID de comprobante requerido",{status:400});let{buffer:r,numeroComprobante:n,rifEmpresa:o}=await x(t.id,e);return new s.NextResponse(r,{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="comprobante_islr_${n}_${o}.pdf"`,"Content-Length":r.length.toString()}})}catch(e){return console.error("[COMPROBANTE_ISLR_PDF_ERROR]",e),new s.NextResponse(JSON.stringify({error:e.message||"Error al generar el PDF"}),{status:500,headers:{"Content-Type":"application/json"}})}}let b=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/retenciones/islr/comprobantes/[id]/pdf/route",pathname:"/api/retenciones/islr/comprobantes/[id]/pdf",filename:"route",bundlePath:"app/api/retenciones/islr/comprobantes/[id]/pdf/route"},resolvedPagePath:"C:\\Users\\Usuario\\.gemini\\antigravity\\playground\\retencion-app\\src\\app\\api\\retenciones\\islr\\comprobantes\\[id]\\pdf\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:j,staticGenerationAsyncStorage:w,serverHooks:R}=b,S="/api/retenciones/islr/comprobantes/[id]/pdf/route";function N(){return(0,a.patchFetch)({serverHooks:R,staticGenerationAsyncStorage:w})}},58585:(e,t,r)=>{var n=r(61085);r.o(n,"notFound")&&r.d(t,{notFound:function(){return n.notFound}}),r.o(n,"redirect")&&r.d(t,{redirect:function(){return n.redirect}})},61085:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return a},RedirectType:function(){return n.RedirectType},notFound:function(){return o.notFound},permanentRedirect:function(){return n.permanentRedirect},redirect:function(){return n.redirect}});let n=r(83953),o=r(16399);class i extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class a extends URLSearchParams{append(){throw new i}delete(){throw new i}set(){throw new i}sort(){throw new i}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},16399:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{isNotFoundError:function(){return o},notFound:function(){return n}});let r="NEXT_NOT_FOUND";function n(){let e=Error(r);throw e.digest=r,e}function o(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8586:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RedirectStatusCode",{enumerable:!0,get:function(){return r}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(r||(r={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},83953:(e,t,r)=>{var n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RedirectType:function(){return n},getRedirectError:function(){return l},getRedirectStatusCodeFromError:function(){return m},getRedirectTypeFromError:function(){return f},getURLFromRedirectError:function(){return u},isRedirectError:function(){return p},permanentRedirect:function(){return c},redirect:function(){return d}});let o=r(54580),i=r(72934),a=r(8586),s="NEXT_REDIRECT";function l(e,t,r){void 0===r&&(r=a.RedirectStatusCode.TemporaryRedirect);let n=Error(s);n.digest=s+";"+t+";"+e+";"+r+";";let i=o.requestAsyncStorage.getStore();return i&&(n.mutableCookies=i.mutableCookies),n}function d(e,t){void 0===t&&(t="replace");let r=i.actionAsyncStorage.getStore();throw l(e,t,(null==r?void 0:r.isAction)?a.RedirectStatusCode.SeeOther:a.RedirectStatusCode.TemporaryRedirect)}function c(e,t){void 0===t&&(t="replace");let r=i.actionAsyncStorage.getStore();throw l(e,t,(null==r?void 0:r.isAction)?a.RedirectStatusCode.SeeOther:a.RedirectStatusCode.PermanentRedirect)}function p(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,r,n,o]=e.digest.split(";",4),i=Number(o);return t===s&&("replace"===r||"push"===r)&&"string"==typeof n&&!isNaN(i)&&i in a.RedirectStatusCode}function u(e){return p(e)?e.digest.split(";",3)[2]:null}function f(e){if(!p(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function m(e){if(!p(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(n||(n={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},95456:(e,t,r)=>{r.d(t,{Dl:()=>p,jM:()=>c,mk:()=>d,ts:()=>l});var n=r(75571),o=r(37078),i=r(58585),a=r(71615);async function s(){return await (0,n.getServerSession)(o.L)}async function l(){let e=await s();return e?.user}async function d(){let e=await l();return e||(0,i.redirect)("/login"),e}async function c(){let e=await l();if(!e||!e.tenantId)throw Error("Unauthorized");return e.tenantId}async function p(){let e=(0,a.cookies)(),t=e.get("empresaActivaId")?.value;if(t)return t;let r=await l();return r?.empresaActivaId||null}},13538:(e,t,r)=>{r.d(t,{_:()=>o});var n=r(53524);let o=globalThis.prisma??new n.PrismaClient({log:["query","error","warn"]})},37078:(e,t,r)=>{r.d(t,{L:()=>a});var n=r(53797),o=r(98691),i=r(13538);let a={providers:[(0,n.Z)({name:"Credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Email y contrase\xf1a requeridos.");let t=await i._.usuario.findMany({where:{email:e.email}});if(0===t.length)throw Error("Usuario no encontrado.");if(t.length>1)throw Error("Este usuario pertenece a m\xfaltiples organizaciones. Selecci\xf3n de organizaci\xf3n no implementada a\xfan.");let r=t[0];if(!r.activo)throw Error("Usuario inactivo.");if(!await o.ZP.compare(e.password,r.passwordHash))throw Error("Contrase\xf1a incorrecta.");let n=await i._.empresa.findFirst({where:{tenantId:r.tenantId,deletedAt:null},orderBy:{createdAt:"asc"}});return{id:r.id,email:r.email,name:r.nombre,tenantId:r.tenantId,empresaActivaId:n?.id||null}}})],callbacks:{jwt:async({token:e,user:t})=>(t&&(e.id=t.id,e.tenantId=t.tenantId,e.empresaActivaId=t.empresaActivaId),e),session:async({session:e,token:t})=>(t&&e.user&&(e.user.id=t.id,e.user.tenantId=t.tenantId,e.user.empresaActivaId=t.empresaActivaId),e)},pages:{signIn:"/login",signOut:"/logout"},session:{strategy:"jwt"}}}};var t=require("../../../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[9276,9656,9997,41],()=>r(14915));module.exports=n})();