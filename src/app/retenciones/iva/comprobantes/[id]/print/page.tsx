import { notFound } from "next/navigation";
import { getTenantId, requireAuth } from "@/lib/auth";
import { getComprobanteIVAById } from "@/modules/retenciones/iva/comprobantes/server/comprobante-iva.service";
import { ComprobanteIVAPrint } from "@/modules/retenciones/iva/comprobantes/ui/comprobante-iva-print";

interface Props {
  params: { id: string };
}

export default async function ComprobanteIVAPrintPage({ params }: Props) {
  // Manual auth check since we are outside (app) layout
  await requireAuth();
  
  const tenantId = await getTenantId();
  const data = await getComprobanteIVAById(params.id, tenantId);

  if (!data) {
    notFound();
  }

  // Pre-calculate if it's exportable/printable?
  // Spec: Before printing: comprobante exists, belongs to tenant, has retenciones, has correlative.
  // Our service already filters by tenant and includes retenciones.
  if (data.retencionesIVA.length === 0) {
    return <div className="p-10 text-center">Este comprobante no tiene retenciones asociadas.</div>;
  }

  return <ComprobanteIVAPrint data={data} />;
}
