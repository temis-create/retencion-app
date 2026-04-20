"use client";

import { useTransition } from "react";
import { Building2 } from "lucide-react";
import { setEmpresaActivaAction } from "../actions/empresa-activa-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Empresa {
  id: string;
  nombreFiscal: string;
  rif: string;
  logoUrl?: string | null;
}

interface Props {
  empresas: Empresa[];
  empresaActivaId?: string | null;
}

export function EmpresaSelector({ empresas, empresaActivaId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    
    startTransition(async () => {
      try {
        await setEmpresaActivaAction(id);
        toast.success("Empresa activa cambiada");
      } catch (error: any) {
        toast.error(error.message || "Error al cambiar empresa");
      }
    });
  };

  const empresaActiva = empresas.find((e) => e.id === empresaActivaId) || empresas[0];

  if (empresas.length === 0) return null;
  
  // Si solo hay una empresa, mostramos el nombre estático
  if (empresas.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-600">
        {empresas[0].logoUrl ? (
          <img src={empresas[0].logoUrl} className="h-6 w-6 object-contain" alt="Logo" />
        ) : (
          <Building2 className="h-4 w-4 text-zinc-400" />
        )}
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase text-zinc-400 leading-none">Empresa</span>
          <span className="text-xs font-semibold truncate max-w-[150px]">
            {empresas[0].nombreFiscal}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2 group">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:border-indigo-300 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/10",
        isPending && "opacity-50 cursor-wait"
      )}>
        {empresaActiva.logoUrl ? (
          <img src={empresaActiva.logoUrl} className="h-6 w-6 object-contain" alt="Logo" />
        ) : (
          <Building2 className="h-4 w-4 text-indigo-500" />
        )}
        <div className="flex flex-col">
           <span className="text-[9px] font-bold uppercase text-zinc-400 leading-none">Empresa Activa</span>
           <select
             value={empresaActivaId || empresas[0].id}
             onChange={handleSelect}
             disabled={isPending}
             className="bg-transparent text-sm font-semibold outline-none cursor-pointer pr-4 appearance-none -ml-0.5"
             style={{ backgroundImage: 'none' }}
           >
             {empresas.map((empresa) => (
               <option key={empresa.id} value={empresa.id}>
                 {empresa.nombreFiscal}
               </option>
             ))}
           </select>
        </div>
        
        {/* Ícono de flecha personalizado ya que quitamos el appearance-none default */}
        <div className="pointer-events-none absolute right-2 text-zinc-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
