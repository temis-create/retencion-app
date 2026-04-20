"use client";

import { useState } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { uploadEmpresaLogoAction } from "../actions/empresa-actions";
import { toast } from "sonner";

interface Props {
  empresaId: string;
  currentLogoUrl?: string | null;
}

export function EmpresaLogoUploader({ empresaId, currentLogoUrl }: Props) {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(currentLogoUrl);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo (Solo imágenes)
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor seleccione un archivo de imagen (PNG, JPG, SVG)");
      return;
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 2MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadEmpresaLogoAction(empresaId, formData);

    if (res.success) {
      setLogo(res.url);
      toast.success("Logo actualizado correctamente");
    } else {
      toast.error(res.error || "Error al cargar el logo");
    }
    setLoading(false);
  };

  return (
     <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center gap-4 group">
         <h2 className="text-sm font-bold text-zinc-900 self-start uppercase tracking-wider">Logo de la Empresa</h2>
         
         <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center group-hover:border-emerald-300 transition-colors">
            {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-2 bg-white transition-transform group-hover:scale-105" />
            ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <ImageIcon className="w-10 h-10 opacity-20" />
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">Sin Logo</span>
                </div>
            )}
            
            <div className={`absolute inset-0 bg-emerald-900/60 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${loading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {loading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-1 text-white scale-90 group-hover:scale-100 transition-transform">
                        <Upload className="w-6 h-6 bg-white/20 p-1.5 rounded-full" />
                        <span className="text-[10px] font-bold uppercase">{logo ? 'Cambiar Logo' : 'Subir Logo'}</span>
                        <input type="file" className="hidden" onChange={handleUpload} disabled={loading} accept="image/*" />
                    </label>
                )}
            </div>
         </div>
         
         <div className="text-[10px] text-zinc-400 font-medium text-center leading-normal max-w-[200px]">
            {logo ? 'Haz click sobre la imagen para cambiarla.' : 'Sube tu logo para que aparezca en los comprobantes fiscales.'}
         </div>
     </div>
  );
}
