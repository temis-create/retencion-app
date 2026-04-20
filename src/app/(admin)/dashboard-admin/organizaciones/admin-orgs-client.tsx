"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, ShieldCheck, Plus, Building2 } from "lucide-react";
import Link from "next/link";
import { CreateOrganizationModal } from "@/modules/admin-saas/ui/create-organization-modal";

interface Props {
  initialOrgs: any[];
}

export function AdminOrgsClient({ initialOrgs }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
             <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400">
                <Building2 className="w-8 h-8" />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Organizaciones</h1>
                <p className="text-slate-500 font-medium italic">Gestión global de clientes y suscripciones (Tenants).</p>
             </div>
        </div>
        <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-100 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nueva Organización
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4 font-bold uppercase text-[10px] tracking-widest text-slate-400">Organización</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Estado</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Plan</TableHead>
              <TableHead className="text-center font-bold uppercase text-[10px] tracking-widest text-slate-400">Empresas</TableHead>
              <TableHead className="text-center font-bold uppercase text-[10px] tracking-widest text-slate-400">Usuarios</TableHead>
              <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialOrgs.map((org) => (
              <TableRow key={org.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-5">
                  <div className="font-bold text-slate-900">{org.nombre}</div>
                  <div className="text-xs text-slate-500 font-medium tracking-tight mt-0.5">{org.rif}</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={org.estado === "ACTIVA" ? "default" : "destructive"}
                    className={org.estado === "ACTIVA" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold border-none" : "font-bold border-none"}
                  >
                    {org.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  {org.plan ? (
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      {org.plan.nombre}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Sin plan asignado</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-black text-slate-700">
                  {org._count.empresas}
                  {org.limiteEmpresas && (
                    <span className="text-xs text-slate-400 font-normal"> / {org.limiteEmpresas}</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-black text-slate-700">
                  {org._count.usuarios}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard-admin/organizaciones/${org.id}`}>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-bold rounded-lg border border-transparent hover:border-indigo-100 transition-all">
                      <Eye className="mr-2 h-4 w-4" />
                      Detalles
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateOrganizationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
