"use client";

import { useState, useEffect } from "react";
import { X, User, Key, Loader2, Mail, Shield, ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import { updateUserAction } from "../actions/saas-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function EditUserModal({ isOpen, onClose, user }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    password: "",
    activo: true,
    rolGlobal: "USUARIO",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        password: "", // No mostramos el pass actual
        activo: user.activo,
        rolGlobal: user.rolGlobal,
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await updateUserAction(formData);

    if (res.success) {
      toast.success("Usuario actualizado correctamente");
      onClose();
    } else {
      toast.error(res.error || "Error al actualizar el usuario");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <User className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-900 leading-none">Editar Usuario</h3>
                <p className="text-xs text-slate-500 mt-1">Gestión de credenciales y accesos.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
             <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="nombre"
                    className="pl-10"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>
             </div>

             <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="email"
                    className="pl-10"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
             </div>

             <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Cambiar Contraseña</Label>
                    <span className="text-[10px] text-slate-400 font-medium italic">Dejar vacío para mantener actual</span>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="password"
                    className="pl-10 border-indigo-100 focus:border-indigo-500"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Escriba nueva clave..."
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                    <Label>Rol Global</Label>
                    <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={formData.rolGlobal}
                            onChange={(e) => setFormData({...formData, rolGlobal: e.target.value})}
                            className="w-full h-10 pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="USUARIO">Usuario (Estándar)</option>
                            <option value="ADMIN_SAAS">Administrador SaaS</option>
                            <option value="SUPERADMIN">Super Admin</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Estado de Cuenta</Label>
                    <div className="flex items-center h-10 px-3 bg-slate-50 border border-slate-200 rounded-md">
                        <input 
                            id="activo"
                            type="checkbox"
                            checked={formData.activo}
                            onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        />
                        <Label htmlFor="activo" className="ml-3 cursor-pointer">
                            {formData.activo ? "Cuenta Activa" : "Cuenta Suspendida"}
                        </Label>
                    </div>
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
