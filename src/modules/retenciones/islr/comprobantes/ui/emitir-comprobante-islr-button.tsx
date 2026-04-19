"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { emitirComprobanteISLRAction } from "../actions/emitir-comprobante-islr";
import { Loader2, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface Props {
  retencionIds: string[];
  pagoId?: string; // Para revalidar la página del pago
  disabled?: boolean;
}

export function EmitirComprobanteISLRButton({ retencionIds, pagoId, disabled }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  async function handleEmitir() {
    setIsLoading(true);
    setShowModal(false);
    try {
      const result = await emitirComprobanteISLRAction(
        retencionIds, 
        pagoId ? `/fiscal/pagos/${pagoId}` : undefined
      );
      
      if (result.success) {
        toast.success(`Comprobante ${result.numero} emitido satisfactoriamente.`);
        router.refresh();
      } else {
        toast.error(result.error || "Ocurrió un error al emitir el comprobante.");
      }
    } catch (e: any) {
      toast.error("Error inesperado en la conexión.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={isLoading || disabled || retencionIds.length === 0}
        variant="default"
        size="sm"
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-bold w-full transition-all"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileCheck className="h-4 w-4" />
        )}
        Emitir Comprobante ISLR
      </Button>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleEmitir}
        loading={isLoading}
        title="Emisión Fiscal ISLR"
        description="Estás a punto de formalizar el comprobante legal de retención. Esta acción es definitiva y bloqueará cualquier recálculo fiscal sobre este pago."
        confirmText="Confirmar Emisión"
        variant="success"
      />
    </>
  );
}
