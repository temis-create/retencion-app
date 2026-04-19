"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ISLRCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (term: string) => {
    router.push(pathname + "?" + createQueryString("search", term));
  };

  const handleFilter = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value));
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Buscar</label>
        <input
          type="text"
          placeholder="Concepto, código, numeral..."
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Sujeto</label>
        <select
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={searchParams.get("sujeto") || ""}
          onChange={(e) => handleFilter("sujeto", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="PNR">PNR</option>
          <option value="PNNR">PNNR</option>
          <option value="PJD">PJD</option>
          <option value="PJND">PJND</option>
        </select>
      </div>

      <div className="w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Tarifa</label>
        <select
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={searchParams.get("tipoTarifa") || ""}
          onChange={(e) => handleFilter("tipoTarifa", e.target.value)}
        >
          <option value="">Todas</option>
          <option value="PORCENTAJE">Porcentaje</option>
          <option value="TARIFA_2">Tarifa 2</option>
        </select>
      </div>

      <div className="w-[150px]">
        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Estado</label>
        <select
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          value={searchParams.get("activo") || ""}
          onChange={(e) => handleFilter("activo", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>
    </div>
  );
}
