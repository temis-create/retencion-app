"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanFormSchema, PlanForm } from "../server/admin-saas.schema";
import { upsertPlanAction } from "../actions/admin-saas.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PlanFormUI({ initialData }: { initialData?: PlanForm }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PlanForm>({
    resolver: zodResolver(PlanFormSchema),
    defaultValues: initialData || {
      nombre: "",
      codigo: "",
      descripcion: "",
      precioReferencial: 0,
      limiteEmpresas: 1,
      limiteUsuarios: 10,
      activo: true,
    }
  });

  const onSubmit = async (data: PlanForm) => {
    setIsSubmitting(true);
    setError(null);
    const res = await upsertPlanAction(data);
    if (res.success) {
      router.push("/dashboard-admin/planes");
      router.refresh();
    } else {
      setError(res.error || "Error al guardar el plan");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
      {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-sm">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>Nombre del Plan</Label>
            <Input {...register("nombre")} placeholder="Ej: Pro" />
            {errors.nombre && <p className="text-xs text-rose-500">{errors.nombre.message}</p>}
        </div>
        <div className="space-y-2">
            <Label>Código (Único)</Label>
            <Input {...register("codigo")} placeholder="Ej: PRO_2025" />
            {errors.codigo && <p className="text-xs text-rose-500">{errors.codigo.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea {...register("descripcion")} placeholder="Describe los beneficios del plan..." />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
            <Label>Precio ($)</Label>
            <Input type="number" step="0.01" {...register("precioReferencial", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
            <Label>Límite Empresas</Label>
            <Input type="number" {...register("limiteEmpresas", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
            <Label>Límite Usuarios</Label>
            <Input type="number" {...register("limiteUsuarios", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="activo" {...register("activo")} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
        <Label htmlFor="activo">Plan Activo (Disponible para asignar)</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700">
            {isSubmitting ? "Guardando..." : "Guardar Plan"}
        </Button>
      </div>
    </form>
  );
}
