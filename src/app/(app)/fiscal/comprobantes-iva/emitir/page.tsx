import { getTenantId } from "@/lib/auth";
import { getRetencionesIVAElegibles } from "@/modules/retenciones/iva/comprobantes/server/comprobante-iva.service";
import { EmitirComprobanteIVAForm } from "@/modules/retenciones/iva/comprobantes/ui/emitir-comprobante-iva-form";

export const metadata = {
  title: "Emitir Comprobante IVA — RetenSaaS",
};

export default async function EmitirComprobantePage() {
  const tenantId = await getTenantId();
  const retencionesElegibles = await getRetencionesIVAElegibles(tenantId);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">
          Emitir Comprobante de Retención IVA
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Selecciona las retenciones de IVA elegibles que deseas agrupar en un mismo comprobante legal.
        </p>
      </div>

      <EmitirComprobanteIVAForm retenciones={retencionesElegibles} />
    </div>
  );
}
