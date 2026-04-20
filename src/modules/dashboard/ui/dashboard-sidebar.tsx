"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  FileText, 
  Landmark,
  Download,
  Receipt,
  ChevronDown,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/modules/auth/ui/logout-button";

const navigation = [
  { name: "Principal", isHeader: true },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  
  { name: "Catálogos", isHeader: true },
  { name: "Empresas", href: "/empresas", icon: Building2 },
  { name: "Proveedores", href: "/proveedores", icon: Users },
  
  { name: "Operaciones", isHeader: true },
  { name: "Compras", href: "/compras", icon: ShoppingCart },
  
  { name: "Retenciones", isHeader: true },
  { 
    name: "IVA", 
    icon: Receipt,
    children: [
      { name: "Cálculos", href: "/fiscal/retenciones-iva" },
      { name: "Comprobantes", href: "/fiscal/comprobantes-iva" },
      { name: "Exportar TXT", href: "/fiscal/exportaciones-iva" },
    ]
  },
  { 
    name: "ISLR", 
    icon: FileText,
    children: [
      { name: "Pagos y Cálculos", href: "/fiscal/pagos" },
      { name: "Comprobantes", href: "/fiscal/comprobantes-islr" },
      { name: "Exportar Archivo", href: "/fiscal/declaraciones-islr" },
      { name: "Catálogo de Conceptos", href: "/retenciones/islr/catalogo" },
    ]
  },
  
  { name: "Configuración", isHeader: true },
  { name: "Períodos Fiscales", href: "/fiscal/periodos", icon: Landmark },
];

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<string[]>(["IVA", "ISLR"]);

  const toggleItem = (name: string) => {
    setOpenItems(prev => 
      prev.includes(name) 
        ? prev.filter(i => i !== name) 
        : [...prev, name]
    );
  };

  return (
    <div className="flex h-full min-h-[100dvh] w-64 flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-zinc-200">
        <span className="text-xl font-bold tracking-tight text-emerald-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center rounded-md font-bold">R</div>
          RetenSaaS
        </span>
      </div>

      
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            if (item.isHeader) {
              return (
                <div key={item.name} className="pt-4 pb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-3">
                    {item.name}
                  </p>
                </div>
              );
            }

            const isActive = item.href ? pathname === item.href : item.children?.some(child => pathname === child.href);
            const isOpen = openItems.includes(item.name);

            if (item.children) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleItem(item.name)}
                    className={cn(
                      "w-full group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <div className="flex items-center">
                      {(() => {
                        const Icon = (item as any).icon;
                        return Icon ? <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-emerald-500" : "text-zinc-400")} /> : null;
                      })()}
                      {item.name}
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="ml-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "block rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                            pathname === child.href ? "text-emerald-700 bg-emerald-50/50" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={item.name} className="relative group">
                {(item as any).disabled ? (
                  <div className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-400 cursor-not-allowed opacity-60">
                    {(() => {
                      const Icon = (item as any).icon;
                      return Icon ? <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-300" /> : null;
                    })()}
                    {item.name}
                    {(item as any).badge && (
                      <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 tracking-tighter">
                        {(item as any).badge}
                      </span>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    {(() => {
                      const Icon = (item as any).icon;
                      return Icon ? <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-emerald-500" : "text-zinc-400 group-hover:text-zinc-600")} /> : null;
                    })()}
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}

          {(user?.rolGlobal === "SUPERADMIN" || user?.rolGlobal === "ADMIN_SAAS") && (
            <div className="pt-6 mt-6 border-t border-zinc-200">
               <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 px-3 mb-2">
                Zona de Administración
              </p>
              <Link
                href="/dashboard-admin"
                className="group flex items-center rounded-md px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <div className="mr-3 h-5 w-5 flex-shrink-0 flex items-center justify-center rounded bg-rose-100">
                  <ShieldCheck className="h-3 w-3" />
                </div>
                Panel Admin SaaS
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-zinc-900">{user?.name}</span>
            <span className="truncate text-[10px] text-zinc-400 uppercase font-bold tracking-tight">
              Tenant: {user?.tenantId?.slice(0, 8)}
            </span>
          </div>
        </div>
        
        <LogoutButton />
      </div>
    </div>
  );
}
