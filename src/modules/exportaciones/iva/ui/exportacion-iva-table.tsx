"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  History, 
  FileCheck, 
  User, 
  Calendar, 
  Layers,
  ArrowRight
} from "lucide-react";

interface ExportacionRecord {
  id: string;
  fechaGeneracion: Date;
  cantidadRegistros: number;
  montoTotal: any; // Decimal de Prisma
  tipo: string;
  estado: string;
  usuario: { nombre: string };
  periodoFiscal: { codigoPeriodo: string };
}

interface ExportacionIVATableProps {
  records: ExportacionRecord[];
}

export function ExportacionIVATable({ records }: ExportacionIVATableProps) {
  if (records.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-dashed border-zinc-300 flex flex-col items-center justify-center text-center">
        <History className="w-12 h-12 text-zinc-300 mb-3" />
        <h3 className="text-lg font-medium text-zinc-900">Sin historial</h3>
        <p className="text-zinc-500 max-w-xs mx-auto">
          An no has generado exportaciones para esta empresa.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <History className="w-5 h-5 text-zinc-500" />
        <h2 className="text-lg font-semibold text-zinc-900">Historial de Exportaciones</h2>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Perodo</th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Registros</th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Monto Total</th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-900">
                        {format(new Date(record.fechaGeneracion), "dd MMM yyyy", { locale: es })}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {format(new Date(record.fechaGeneracion), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-700">{record.periodoFiscal.codigoPeriodo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-700">{record.cantidadRegistros}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-zinc-900">
                      Bs. {Number(record.montoTotal).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 uppercase">
                          {record.usuario.nombre.substring(0, 2)}
                       </div>
                       <span className="text-sm text-zinc-600">{record.usuario.nombre}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
