import { notFound } from "next/navigation";
import { getTenantId } from "@/lib/auth";
import { getProveedorById } from "@/modules/proveedores/server/proveedor.service";
import { ProveedorDetail } from "@/modules/proveedores/ui/proveedor-detail";

export default async function DetalleProveedorPage({ params }: { params: { id: string } }) {
  const tenantId = await getTenantId();
  const proveedor = await getProveedorById(params.id, tenantId);

  if (!proveedor) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ProveedorDetail proveedor={proveedor as any} />
    </div>
  );
}
