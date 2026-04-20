"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

export function CatalogoISLRFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sujeto, setSujeto] = useState(searchParams.get("sujeto") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      
      if (sujeto) params.set("sujeto", sujeto);
      else params.delete("sujeto");

      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, sujeto, router, searchParams]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
          Buscar concepto o código
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ej: Honorarios, 001..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
                <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full md:w-48">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
          Sujeto
        </label>
        <select
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
          value={sujeto}
          onChange={(e) => setSujeto(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="PNR">PNR (Residente)</option>
          <option value="PNNR">PNNR (No Residente)</option>
          <option value="PJD">PJD (Domiciliada)</option>
          <option value="PJND">PJND (No Domiciliada)</option>
        </select>
      </div>

      <button
        onClick={() => {
            setSearch("");
            setSujeto("");
        }}
        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100 h-[38px]"
      >
        Limpiar
      </button>
    </div>
  );
}
