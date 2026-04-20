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
import { User, ShieldCheck, Mail, Settings2, ShieldAlert } from "lucide-react";
import { EditUserModal } from "@/modules/admin-saas/ui/edit-user-modal";

interface Props {
  initialUsers: any[];
}

export function AdminUsersClient({ initialUsers }: Props) {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-4">
           <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400">
              <User className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Usuarios Globales</h1>
              <p className="text-slate-500 font-medium italic">Listado maestro de cuentas registradas en toda la plataforma.</p>
           </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mt-8">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="py-4 font-bold uppercase text-[10px] tracking-widest text-slate-400">Nombre / Email</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Organización</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Rol Global</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Estado</TableHead>
              <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors font-black">
                        {user.nombre.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 leading-none">{user.nombre}</div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1.5 underline underline-offset-2 decoration-slate-200">
                            <Mail className="h-3 w-3" />
                            {user.email}
                        </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{user.tenant.nombre}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-bold">
                    {user.rolGlobal === "SUPERADMIN" || user.rolGlobal === "ADMIN_SAAS" ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    ) : (
                        <ShieldAlert className="h-4 w-4 text-slate-400" />
                    )}
                    <span className={user.rolGlobal !== "USUARIO" ? "text-emerald-700 uppercase text-[12px]" : "text-slate-600 uppercase text-[12px]"}>
                        {user.rolGlobal}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.activo ? "default" : "secondary"}
                    className={user.activo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-bold border-none" : "font-bold bg-slate-100 text-slate-400 border-none"}
                  >
                    {user.activo ? "ACTIVO" : "INACTIVO"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(user)}
                        className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 font-bold h-9 px-4 rounded-xl border border-transparent hover:border-indigo-100 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <Settings2 className="w-4 h-4 mr-2" />
                        Gestionar
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
      />
    </>
  );
}
