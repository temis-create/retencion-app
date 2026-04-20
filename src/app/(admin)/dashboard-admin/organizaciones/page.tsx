import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import { AdminOrgsClient } from "./admin-orgs-client";

export default async function AdminOrgsPage() {
  const service = new AdminSaasService();
  const orgs = await service.listOrganizations();

  return (
    <div className="space-y-8">
      <AdminOrgsClient initialOrgs={orgs as any} />
    </div>
  );
}
