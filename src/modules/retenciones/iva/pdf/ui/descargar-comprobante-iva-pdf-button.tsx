"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Asumiendo que existe shadcn Button
import { toast } from "sonner";

interface Props {
  comprobanteId: string;
  numeroComprobante?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showText?: boolean;
  className?: string;
}

export function DescargarComprobanteIVAPdfButton({ 
  comprobanteId, 
  numeroComprobante,
  variant = "outline",
  showText = true,
  className
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/retenciones/iva/comprobantes/${comprobanteId}/pdf`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al descargar el PDF");
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `comprobante_iva_${numeroComprobante || 'descarga'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("PDF generado y descargado correctamente");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "No se pudo generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      className={className}
      onClick={handleDownload}
      disabled={loading}
      title="Descargar PDF"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {showText && "Descargar PDF"}
    </Button>
  );
}
