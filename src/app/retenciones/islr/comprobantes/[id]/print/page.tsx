import { notFound } from "next/navigation";
import { getTenantId, requireAuth } from "@/lib/auth";
import { getComprobanteISLRById } from "@/modules/retenciones/islr/comprobantes/server/comprobante-islr.service";
import { ComprobanteISLRPrint } from "@/modules/retenciones/islr/comprobantes/ui/comprobante-islr-print";

interface Props {
  params: { id: string };
}

export default async function ComprobanteISLRPrintPage({ params }: Props) {
  // Manual auth check since we are outside (app) layout
  await requireAuth();
  
  const tenantId = await getTenantId();
  const data = await getComprobanteISLRById(params.id, tenantId);

  if (!data) {
    notFound();
  }

  if (data.retencionesISLR.length === 0) {
    return <div className="p-10 text-center">Este comprobante no tiene retenciones asociadas.</div>;
  }

  return <ComprobanteISLRPrint data={data} />;
}
