import { PlanFormUI } from "@/modules/admin-saas/ui/plan-form-ui";
import Link from "next/link";

export default function NewPlanPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard-admin/planes" className="text-sm text-slate-400 hover:text-emerald-600 transition-colors">
            &larr; Volver a Planes
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">Crear Nuevo Plan</h1>
        <p className="text-slate-500">Define una nueva modalidad de suscripción para el SaaS.</p>
      </div>

      <PlanFormUI />
    </div>
  );
}
