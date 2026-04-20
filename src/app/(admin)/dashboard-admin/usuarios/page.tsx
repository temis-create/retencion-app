import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { User, ShieldCheck, Mail } from "lucide-react";

export default async function AdminUsersPage() {
  const service = new AdminSaasService();
  const users = await service.listUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Usuarios</h1>
        <p className="text-slate-500">Listado global de usuarios registrados en la plataforma.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4">Nombre / Email</TableHead>
              <TableHead>Organización</TableHead>
              <TableHead>Rol Global</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <User className="h-4 w-4" />
                    </div>
                    <div>
                        <div className="font-semibold text-slate-900">{user.nombre}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm font-medium text-slate-700">{user.tenant.nombre}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium">
                    {user.rolGlobal === "SUPERADMIN" || user.rolGlobal === "ADMIN_SAAS" ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    ) : null}
                    <span className={user.rolGlobal !== "USUARIO" ? "text-emerald-700" : "text-slate-600"}>
                        {user.rolGlobal}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.activo ? "default" : "secondary"}
                    className={user.activo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                  >
                    {user.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
