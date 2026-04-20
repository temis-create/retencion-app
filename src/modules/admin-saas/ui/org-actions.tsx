"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  updateOrganizationStatusAction, 
  assignPlanAction 
} from "../actions/admin-saas.actions";
import { toast } from "sonner";
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Loader2,
  Package
} from "lucide-react";

interface OrgActionsProps {
  organizationId: string;
  currentStatus: string;
  currentPlanId?: string | null;
  availablePlans: any[];
}

export function OrganizationStatusToggle({ organizationId, currentStatus }: { organizationId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const isSuspended = currentStatus === "SUSPENDIDA";

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const result = await updateOrganizationStatusAction({
        id: organizationId,
        activo: isSuspended, // Si está suspendida, activar
        estado: isSuspended ? "ACTIVA" : "SUSPENDIDA"
      });

      if (result.success) {
        toast.success(isSuspended ? "Organización activada" : "Organización suspendida");
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Error al actualizar el estado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant={isSuspended ? "default" : "destructive"} 
      className={isSuspended ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}
      onClick={toggleStatus}
      disabled={loading}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isSuspended ? "Activar Organización" : "Suspender Organización"}
    </Button>
  );
}

export function PlanAssignmentAction({ organizationId, availablePlans, currentPlanId }: OrgActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  const assignPlan = async (plan: any) => {
    setLoading(true);
    try {
      // Fecha fin por defecto: 1 año
      const fechaFin = new Date();
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);

      const result = await assignPlanAction({
        organizationId,
        planId: plan.id,
        fechaFinPlan: fechaFin,
        limiteEmpresasOverride: plan.limiteEmpresas
      });

      if (result.success) {
        toast.success(`Plan ${plan.nombre} asignado correctamente`);
        setShowPlans(false);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Error al asignar plan");
    } finally {
      setLoading(false);
    }
  };

  if (!showPlans) {
    return (
        <Button 
            variant={currentPlanId ? "ghost" : "default"} 
            className={currentPlanId ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-bold" : "mt-4 bg-emerald-600 hover:bg-emerald-700"}
            onClick={() => setShowPlans(true)}
        >
            {currentPlanId ? "Cambiar Plan" : "Asignar Plan Ahora"}
        </Button>
    );
  }

  return (
    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Selecciona el nuevo plan
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setShowPlans(false)} className="text-xs">
            Cancelar
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {availablePlans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => assignPlan(plan)}
            disabled={loading}
            className={`flex flex-col items-start p-3 rounded-lg border text-left transition-all hover:border-emerald-500 hover:bg-emerald-50/50 ${plan.id === currentPlanId ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200 bg-white'}`}
          >
            <span className="text-sm font-bold text-slate-900">{plan.nombre}</span>
            <span className="text-[10px] text-slate-500">Límite: {plan.limiteEmpresas} emp.</span>
            <span className="text-xs font-bold text-emerald-700 mt-1">${Number(plan.precioReferencial).toFixed(0)}/mes</span>
          </button>
        ))}
      </div>
    </div>
  );
}
