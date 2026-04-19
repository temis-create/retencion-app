import { getCurrentUser } from "@/lib/auth";
import { getEmpresaActiva, getDashboardMetrics } from "@/lib/data";
import { StatCard } from "@/modules/dashboard/ui/stat-card";
import { QuickActions } from "@/modules/dashboard/ui/quick-actions";
import { Building2, Users, ShoppingCart, CreditCard, FileText, FileStack } from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const empresaActiva = await getEmpresaActiva();
  const metrics = await getDashboardMetrics(empresaActiva?.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Bienvenido, {user?.name}
        </h1>
        <p className="mt-2 text-zinc-500">
          Resumen general de tu cuenta y accesos principales.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Acciones Rápidas</h2>
        <QuickActions />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Resumen de Actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Empresas" 
            value={metrics.empresas} 
            icon={Building2} 
            description="Empresas registradas en tu organización"
          />
          <StatCard 
            title="Total Proveedores" 
            value={metrics.proveedores} 
            icon={Users} 
            description={empresaActiva ? `Registrados en ${empresaActiva.nombreFiscal}` : "En todas tus empresas"}
          />
          <StatCard 
            title="Compras Registradas" 
            value={metrics.compras} 
            icon={ShoppingCart} 
          />
          <StatCard 
            title="Pagos Realizados" 
            value={metrics.pagos} 
            icon={CreditCard} 
          />
          <StatCard 
            title="Retenciones IVA" 
            value={metrics.retencionesIVA} 
            icon={FileText} 
            description="Comprobantes de IVA calculados"
          />
          <StatCard 
            title="Retenciones ISLR" 
            value={metrics.retencionesISLR} 
            icon={FileStack} 
            description="Comprobantes de ISLR calculados"
          />
        </div>
      </section>
      
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-blue-900">Información del Sistema</h3>
        <p className="text-sm text-blue-800">
          Actualmente el sistema está operando en la modalidad <strong>MVP</strong>. 
          Estás navegando bajo el entorno de organización <strong>{user?.tenantId}</strong>.
        </p>
      </section>
    </div>
  );
}
