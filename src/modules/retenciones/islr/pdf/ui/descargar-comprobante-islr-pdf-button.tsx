"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  comprobanteId: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  showText?: boolean;
}

export function DescargarComprobanteISLRPdfButton({ 
  comprobanteId, 
  variant = "primary", 
  className = "", 
  showText = true 
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/retenciones/islr/comprobantes/${comprobanteId}/pdf`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al generar el PDF");
      }

      // Obtener el blob y disparar descarga
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Intentar obtener el nombre del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `comprobante_islr_${comprobanteId.slice(0, 8)}.pdf`;
      if (contentDisposition && contentDisposition.includes('filename=')) {
        fileName = contentDisposition.split('filename=')[1].replace(/"/g, '');
      }

      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("PDF descargado correctamente");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "No se pudo descargar el PDF");
    } finally {
      setLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return "border border-indigo-200 text-indigo-700 hover:bg-indigo-50";
      case "ghost":
        return "text-zinc-500 hover:bg-zinc-100";
      case "secondary":
        return "bg-zinc-100 text-zinc-700 hover:bg-zinc-200";
      default:
        return "bg-indigo-600 text-white hover:bg-indigo-700";
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:scale-100 ${getVariantStyles()} ${className}`}
      title="Descargar Comprobante en PDF"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      {showText && (loading ? "Generando..." : "Descargar PDF")}
    </button>
  );
}
