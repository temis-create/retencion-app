import { notFound } from "next/navigation";
import { getTenantId } from "@/lib/auth";
import { getCompraById } from "@/modules/compras/server/compra.service";
import { CompraDetail } from "@/modules/compras/ui/compra-detail";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Compra ${params.id.slice(0, 8)}… — RetenSaaS`,
  };
}

export default async function CompraDetailPage({ params }: Props) {
  const tenantId = await getTenantId();
  const compra = await getCompraById(params.id, tenantId);

  if (!compra) notFound();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <CompraDetail compra={compra as any} />
    </div>
  );
}
