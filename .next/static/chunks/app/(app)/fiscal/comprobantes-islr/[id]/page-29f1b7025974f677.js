(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6903,6108],{5620:function(e,t,r){Promise.resolve().then(r.t.bind(r,231,23)),Promise.resolve().then(r.bind(r,6883))},8030:function(e,t,r){"use strict";r.d(t,{Z:function(){return s}});var n=r(2265);/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),a=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let c=(0,n.forwardRef)((e,t)=>{let{color:r="currentColor",size:o=24,strokeWidth:c=2,absoluteStrokeWidth:s,className:l="",children:d,iconNode:u,...h}=e;return(0,n.createElement)("svg",{ref:t,...i,width:o,height:o,stroke:r,strokeWidth:s?24*Number(c)/Number(o):c,className:a("lucide",l),...h},[...u.map(e=>{let[t,r]=e;return(0,n.createElement)(t,r)}),...Array.isArray(d)?d:[d]])}),s=(e,t)=>{let r=(0,n.forwardRef)((r,i)=>{let{className:s,...l}=r;return(0,n.createElement)(c,{ref:i,iconNode:t,className:a("lucide-".concat(o(e)),s),...l})});return r.displayName="".concat(e),r}},9768:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r(8030).Z)("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]])},3274:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});/**
 * @license lucide-react v0.378.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=(0,r(8030).Z)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},6883:function(e,t,r){"use strict";r.d(t,{DescargarComprobanteISLRPdfButton:function(){return s}});var n=r(7437),o=r(2265),a=r(3274),i=r(9768),c=r(7776);function s(e){let{comprobanteId:t,variant:r="primary",className:s="",showText:l=!0}=e,[d,u]=(0,o.useState)(!1),h=async()=>{u(!0);try{let e=await fetch("/api/retenciones/islr/comprobantes/".concat(t,"/pdf"));if(!e.ok){let t=await e.json();throw Error(t.error||"Error al generar el PDF")}let r=await e.blob(),n=window.URL.createObjectURL(r),o=document.createElement("a");o.href=n;let a=e.headers.get("Content-Disposition"),i="comprobante_islr_".concat(t.slice(0,8),".pdf");a&&a.includes("filename=")&&(i=a.split("filename=")[1].replace(/"/g,"")),o.download=i,document.body.appendChild(o),o.click(),window.URL.revokeObjectURL(n),o.remove(),c.Am.success("PDF descargado correctamente")}catch(e){console.error(e),c.Am.error(e.message||"No se pudo descargar el PDF")}finally{u(!1)}};return(0,n.jsxs)("button",{onClick:h,disabled:d,className:"inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:scale-100 ".concat((()=>{switch(r){case"outline":return"border border-indigo-200 text-indigo-700 hover:bg-indigo-50";case"ghost":return"text-zinc-500 hover:bg-zinc-100";case"secondary":return"bg-zinc-100 text-zinc-700 hover:bg-zinc-200";default:return"bg-indigo-600 text-white hover:bg-indigo-700"}})()," ").concat(s),title:"Descargar Comprobante en PDF",children:[d?(0,n.jsx)(a.Z,{className:"h-4 w-4 animate-spin"}):(0,n.jsx)(i.Z,{className:"h-4 w-4"}),l&&(d?"Generando...":"Descargar PDF")]})}}},function(e){e.O(0,[231,7776,2971,7023,1744],function(){return e(e.s=5620)}),_N_E=e.O()}]);