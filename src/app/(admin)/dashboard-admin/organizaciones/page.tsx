import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, ShieldCheck, ShieldAlert } from "lucide-react";

export default async function AdminOrgsPage() {
  const service = new AdminSaasService();
  const orgs = await service.listOrganizations();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Organizaciones (Tenants)</h1>
          <p className="text-slate-500">Gestión de clientes y suscripciones.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4">Organización</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-center">Empresas</TableHead>
              <TableHead className="text-center">Usuarios</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.map((org) => (
              <TableRow key={org.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-4">
                  <div className="font-semibold text-slate-900">{org.nombre}</div>
                  <div className="text-xs text-slate-500">{org.rif}</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={org.estado === "ACTIVA" ? "default" : "destructive"}
                    className={org.estado === "ACTIVA" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                  >
                    {org.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  {org.plan ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      {org.plan.nombre}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Sin plan asignado</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {org._count.empresas}
                  {org.limiteEmpresas && (
                    <span className="text-xs text-slate-400 font-normal"> / {org.limiteEmpresas}</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {org._count.usuarios}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard-admin/organizaciones/${org.id}`}>
                    <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
