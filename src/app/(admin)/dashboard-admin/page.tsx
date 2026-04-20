import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import { 
  Building2, 
  Users, 
  Files, 
  Download, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const service = new AdminSaasService();
  const kpis = await service.getDashboardKPIs();

  const stats = [
    { name: "Organizaciones", value: kpis.totalOrgs, icon: Building2, color: "text-blue-600" },
    { name: "Org. Activas", value: kpis.activeOrgs, icon: CheckCircle2, color: "text-emerald-600" },
    { name: "Org. Suspendidas", value: kpis.suspendedOrgs, icon: AlertCircle, color: "text-rose-600" },
    { name: "Usuarios Totales", value: kpis.totalUsers, icon: Users, color: "text-indigo-600" },
    { name: "Empresas Registradas", value: kpis.totalEmpresas, icon: Building2, color: "text-cyan-600" },
    { name: "Comprobantes IVA", value: kpis.totalIvaComprobantes, icon: Files, color: "text-orange-600" },
    { name: "Comprobantes ISLR", value: kpis.totalIslrComprobantes, icon: Files, color: "text-amber-600" },
    { name: "Exportaciones", value: kpis.totalExportaciones, icon: Download, color: "text-violet-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Administrativo</h1>
        <p className="text-slate-500">Resumen operativo de la plataforma SaaS.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-slate-200/60 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.name}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-80`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Placeholder for future charts or activity feed */}
        <Card className="border-slate-200/60">
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 text-center py-10">Buzón de actividad próximamente.</p>
            </CardContent>
        </Card>
        <Card className="border-slate-200/60">
            <CardHeader>
                <CardTitle>Nuevas Organizaciones</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 text-center py-10">Listado de onboardings recientes próximamente.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
