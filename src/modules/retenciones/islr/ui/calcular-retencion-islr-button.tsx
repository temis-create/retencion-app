"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { calcularRetencionISLRAction } from "../actions/calcular-retencion-islr";
import { Loader2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface Props {
  pagoId: string;
  disabled?: boolean;
}

export function CalcularRetencionISLRButton({ pagoId, disabled }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCalcular() {
    setIsLoading(true);
    try {
      const result = await calcularRetencionISLRAction(pagoId);
      
      if (result.success) {
        if (result.aplica) {
          toast.success("Retención ISLR calculada y guardada correctamente.");
        } else {
          toast.info(`No aplica retención ISLR: ${result.motivo || "Cumple criterios de exención"}`);
        }
        router.refresh();
      } else {
        toast.error(result.error || "Ocurrió un error al calcular la retención.");
      }
    } catch (e: any) {
      toast.error("Error inesperado al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCalcular}
      disabled={isLoading || disabled}
      variant="outline"
      size="sm"
      className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-all font-medium"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
      ) : (
        <Calculator className="h-4 w-4 text-indigo-500" />
      )}
      Calcular retención ISLR
    </Button>
  );
}
