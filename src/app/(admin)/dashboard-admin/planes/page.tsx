import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Package, Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminPlansPage() {
  const service = new AdminSaasService();
  const plans = await service.listPlans();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Planes de Suscripción</h1>
          <p className="text-slate-500">Configura la oferta comercial de la plataforma.</p>
        </div>
        <Link href="/dashboard-admin/planes/nuevo">
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Crear Plan
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4">Nombre del Plan</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Límite Empresas</TableHead>
              <TableHead>Precio Ref.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-500 italic">No hay planes definidos aún.</TableCell>
                </TableRow>
            ) : (
                plans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-emerald-600" />
                            <span className="font-semibold text-slate-900">{plan.nombre}</span>
                        </div>
                        </TableCell>
                        <TableCell>
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-700">
                            {plan.codigo}
                        </code>
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                        {plan.limiteEmpresas} empresas
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                        ${Number(plan.precioReferencial).toFixed(2)}
                        </TableCell>
                        <TableCell>
                        <Badge 
                            variant={plan.activo ? "default" : "secondary"}
                            className={plan.activo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                        >
                            {plan.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-emerald-700 hover:bg-emerald-50">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
