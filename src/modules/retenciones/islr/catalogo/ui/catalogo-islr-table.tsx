"use client";

import { cn } from "@/lib/utils";
import { Info, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CatalogoISLRDetail } from "./catalogo-islr-detail";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  conceptos: any[];
}

export function CatalogoISLRTable({ conceptos }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedConcepto, setSelectedConcepto] = useState<any | null>(null);

  const orderBy = searchParams.get("orderBy") || "concepto";
  const orderDir = searchParams.get("orderDir") || "asc";

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (orderBy === field) {
      params.set("orderDir", orderDir === "asc" ? "desc" : "asc");
    } else {
      params.set("orderBy", field);
      params.set("orderDir", "asc");
    }
    router.push(`?${params.toString()}`);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (orderBy !== field) return <ArrowUpDown className="ml-2 h-3 w-3 text-slate-300 group-hover/head:text-slate-400" />;
    return orderDir === "asc" ? <ArrowUp className="ml-2 h-3 w-3 text-emerald-600" /> : <ArrowDown className="ml-2 h-3 w-3 text-emerald-600" />;
  };

  const formatBs = (val: any) => {
    return Number(val).toLocaleString('es-VE', { minimumFractionDigits: 2 });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead 
                className="w-[130px] py-4 cursor-pointer group/head select-none"
                onClick={() => handleSort('codigoSeniat')}
            >
                <div className="flex items-center">
                    Cód / Num
                    <SortIcon field="codigoSeniat" />
                </div>
            </TableHead>
            <TableHead 
                className="cursor-pointer group/head select-none"
                onClick={() => handleSort('concepto')}
            >
                <div className="flex items-center">
                    Concepto de Retención
                    <SortIcon field="concepto" />
                </div>
            </TableHead>
            <TableHead>Sujeto</TableHead>
            <TableHead 
                className="text-center cursor-pointer group/head select-none"
                onClick={() => handleSort('baseImponiblePorcentaje')}
            >
                <div className="flex items-center justify-center">
                    Base %
                    <SortIcon field="baseImponiblePorcentaje" />
                </div>
            </TableHead>
            <TableHead 
                className="text-center cursor-pointer group/head select-none"
                onClick={() => handleSort('porcentajeRetencion')}
            >
                <div className="flex items-center justify-center">
                    Porcentaje
                    <SortIcon field="porcentajeRetencion" />
                </div>
            </TableHead>
            <TableHead className="text-right">Sustraendo</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conceptos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20 text-slate-400 italic">
                No se encontraron conceptos que coincidan con la búsqueda.
              </TableCell>
            </TableRow>
          ) : (
            conceptos.map((c) => (
              <TableRow 
                key={c.id} 
                className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                onClick={() => setSelectedConcepto(c)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-emerald-600">{c.codigoSeniat || '---'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.numeral}{c.literal ? ` - ${c.literal}` : ''}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {c.concepto}
                    </span>
                    {c.requiereCalculoEspecial && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100 mt-1 text-[9px] h-4 py-0">
                        CÁLCULO ESPECIAL
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                        "text-[10px] font-bold px-1.5 py-0",
                        c.sujeto === 'PNR' ? "bg-blue-50 text-blue-700" :
                        c.sujeto === 'PJD' ? "bg-emerald-50 text-emerald-700" :
                        "bg-slate-100 text-slate-600"
                    )}
                  >
                    {c.sujeto}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-sm text-slate-600">
                    {c.baseImponiblePorcentaje ? `${Number(c.baseImponiblePorcentaje)}%` : '---'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {c.tipoTarifa === "TARIFA_2" ? (
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">TARIFA 2</span>
                  ) : (
                    <span className="font-bold text-slate-900">{Number(c.porcentajeRetencion)}%</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-xs font-medium text-slate-600">
                    {c.sustraendoBs > 0 ? `Bs. ${formatBs(c.sustraendoBs)}` : '---'}
                  </span>
                </TableCell>
                <TableCell>
                    <Info className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {selectedConcepto && (
        <CatalogoISLRDetail 
            concepto={selectedConcepto} 
            onClose={() => setSelectedConcepto(null)} 
        />
      )}
    </div>
  );
}
