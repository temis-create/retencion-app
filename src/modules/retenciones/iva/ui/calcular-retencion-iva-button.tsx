"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { calcularRetencionIVAAction } from "../actions/calcular-retencion-iva";
import { Loader2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface Props {
  compraId: string;
}

export function CalcularRetencionIVAButton({ compraId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleCalcular() {
    setIsLoading(true);
    try {
      const result = await calcularRetencionIVAAction(compraId);
      if (result.success) {
        if ('aplica' in result && result.aplica) {
          const res = (result as any).resultado;
          const desc = res?.motivoDescripcion ?? "";
          toast.success(
            `Retención IVA calculada: ${res?.porcentajeRetencion ?? "—"}% — ${desc}`
          );
        } else {
          const res = (result as any).resultado;
          const desc = res?.motivoDescripcion ?? "Motivo no especificado";
          toast.info(`No aplica retención: ${desc}`);
        }
        router.refresh();
      } else {
        toast.error(result.error || "Ocurrió un error al calcular la retención.");
      }
    } catch (e: any) {
      toast.error("Error inesperado de red o servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCalcular}
      disabled={isLoading}
      variant="outline"
      className="gap-2 shadow-sm text-sm"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Calculator className="h-4 w-4" />
      )}
      Calcular retención IVA
    </Button>
  );
}
