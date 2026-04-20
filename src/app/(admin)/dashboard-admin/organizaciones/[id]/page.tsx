import { AdminSaasService } from "@/modules/admin-saas/server/admin-saas.service";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrganizationStatusToggle, PlanAssignmentAction } from "@/modules/admin-saas/ui/org-actions";

export default async function AdminOrgDetailPage({ params }: { params: { id: string } }) {
  const service = new AdminSaasService();
  const [org, availablePlans] = await Promise.all([
    service.getOrganizationDetail(params.id),
    service.listPlans()
  ]);

  if (!org) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/dashboard-admin/organizaciones" className="text-slate-400 hover:text-emerald-600 transition-colors">
                &larr; Volver
            </Link>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{org.nombre}</h1>
                <p className="text-slate-500">ID: {org.id}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200 text-slate-600">
                Editar Datos
            </Button>
            <OrganizationStatusToggle 
                organizationId={org.id} 
                currentStatus={org.estado} 
            />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* General Info Card */}
        <Card className="border-slate-200/60 shadow-sm col-span-1">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    Información General
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">RIF</div>
                    <div className="text-sm font-semibold text-slate-900">{org.rif}</div>
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Estado de Cuenta</div>
                    <Badge 
                        variant={org.estado === "ACTIVA" ? "default" : "destructive"}
                        className={org.estado === "ACTIVA" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                    >
                        {org.estado}
                    </Badge>
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Email Contacto</div>
                    <div className="text-sm text-slate-600 font-medium">{org.emailContacto || "No definido"}</div>
                </div>
                <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Creado en</div>
                    <div className="text-sm text-slate-600 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(org.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="border-slate-200/60 shadow-sm col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Suscripción Actual
                </CardTitle>
                <PlanAssignmentAction 
                    organizationId={org.id} 
                    availablePlans={availablePlans} 
                    currentPlanId={org.plan?.id} 
                    currentStatus={org.estado}
                />
            </CardHeader>
            <CardContent>
                {org.plan ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Plan</div>
                                <div className="text-xl font-bold text-emerald-700">{org.plan.nombre}</div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Vigencia</div>
                                <div className="text-sm text-slate-600 font-medium">
                                    {org.fechaInicioPlan ? new Date(org.fechaInicioPlan).toLocaleDateString() : "-"} 
                                    {org.fechaFinPlan ? ` al ${new Date(org.fechaFinPlan).toLocaleDateString()}` : " (Sin fin definido)"}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Límite de Empresas</div>
                                <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <span className={org.empresas.length >= (org.limiteEmpresas || 0) ? "text-rose-600" : "text-emerald-600"}>
                                        {org.empresas.length}
                                    </span>
                                    <span>/</span>
                                    <span>{org.limiteEmpresas || "Sin límite"}</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Uso de Recursos</div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-emerald-500 h-full transition-all" 
                                        style={{ width: `${Math.min(100, (org.empresas.length / (org.limiteEmpresas || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 font-medium">Esta organización no tiene un plan asignado.</p>
                        <PlanAssignmentAction 
                            organizationId={org.id} 
                            availablePlans={availablePlans} 
                            currentPlanId={null} 
                            currentStatus={org.estado}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Companies List */}
        <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold">Empresas Operativas</CardTitle>
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {org.empresas.length}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="pl-6 py-3">Empresa</TableHead>
                            <TableHead>RIF</TableHead>
                            <TableHead className="text-right pr-6">Creación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {org.empresas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-6 text-slate-400 italic">No hay empresas registradas.</TableCell>
                            </TableRow>
                        ) : (
                            org.empresas.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="pl-6 font-medium text-slate-800">{emp.nombreFiscal}</TableCell>
                                    <TableCell className="text-slate-500 font-mono text-xs">{emp.rif}</TableCell>
                                    <TableCell className="text-right pr-6 text-xs text-slate-400">
                                        {new Date(emp.createdAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* Users List */}
        <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold">Usuarios del Tenant</CardTitle>
                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {org.usuarios.length}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="pl-6 py-3">Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right pr-6">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {org.usuarios.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="pl-6 font-medium text-slate-800">{user.nombre}</TableCell>
                                <TableCell className="text-slate-600 text-xs">{user.email}</TableCell>
                                <TableCell className="text-right pr-6 text-xs text-slate-400">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
