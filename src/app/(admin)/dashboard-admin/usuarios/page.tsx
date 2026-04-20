import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import { AdminUsersClient } from "./admin-users-client";

export default async function AdminUsersPage() {
  const service = new AdminSaasService();
  const users = await service.listUsers();

  return (
    <div className="space-y-8">
      <AdminUsersClient initialUsers={users as any} />
    </div>
  );
}
