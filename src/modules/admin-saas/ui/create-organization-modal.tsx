"use client";

import { useState } from "react";
import { X, Plus, Building2, User, Key, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { createOrganizationAction } from "../actions/saas-management";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrganizationModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    rif: "",
    emailContacto: "",
    adminNombre: "",
    adminEmail: "",
    adminPassword: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await createOrganizationAction(formData);

    if (res.success) {
      toast.success("Organización creada exitosamente");
      onClose();
    } else {
      toast.error(res.error || "Error al crear la organización");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <Building2 className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-900 leading-none">Nueva Organización</h3>
                <p className="text-xs text-slate-500 mt-1">Registre un nuevo cliente en la plataforma.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <span className="w-4 h-[1px] bg-slate-200"></span>
                Datos de la Organización
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre Fiscal</Label>
                  <Input 
                    id="nombre"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej. Inversiones 123, C.A."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rif">RIF</Label>
                  <Input 
                    id="rif"
                    required
                    value={formData.rif}
                    onChange={(e) => setFormData({...formData, rif: e.target.value})}
                    placeholder="J-12345678-9"
                  />
                </div>
             </div>
             <div className="space-y-1.5">
                <Label htmlFor="emailContacto">Email de Contacto</Label>
                <Input 
                  id="emailContacto"
                  type="email"
                  value={formData.emailContacto}
                  onChange={(e) => setFormData({...formData, emailContacto: e.target.value})}
                  placeholder="admin@empresa.com"
                />
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
             <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <span className="w-4 h-[1px] bg-slate-200"></span>
                Usuario Administrador Inicial
             </div>

             <div className="space-y-1.5">
                <Label htmlFor="adminNombre">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="adminNombre"
                    className="pl-10"
                    required
                    value={formData.adminNombre}
                    onChange={(e) => setFormData({...formData, adminNombre: e.target.value})}
                    placeholder="Nombre del encargado"
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="adminEmail">Email de Acceso</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      id="adminEmail"
                      className="pl-10"
                      type="email"
                      required
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                      placeholder="usuario@login.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="adminPassword">Contraseña</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      id="adminPassword"
                      className="pl-10"
                      type="password"
                      required
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                      placeholder="Mín. 6 caracteres"
                    />
                  </div>
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Crear Organización
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
