"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { emitirComprobanteIVAAction } from "../actions/emitir-comprobante-iva";
import { toast } from "sonner";
import { EmisionConfirmacionModal } from "./emision-confirmacion-modal";

interface Props {
  retencionId: string;
}

export function EmitirComprobanteIndividualButton({ retencionId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleEmitir = async () => {
    setLoading(true);
    try {
      const res = await emitirComprobanteIVAAction([retencionId]);
      if (res.success && res.data) {
        toast.success("Comprobante emitido con éxito");
        router.push(`/fiscal/comprobantes-iva/${res.data.id}`);
        router.refresh();
      } else if (!res.success) {
        toast.error(res.error || "Error al emitir el comprobante");
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        Emitir Comprobante
      </button>

      <EmisionConfirmacionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleEmitir}
        loading={loading}
      />
    </>
  );
}
