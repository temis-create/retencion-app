import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/auth/server/auth.config";
import { redirect } from "next/navigation";
import { RolGlobal } from "@prisma/client";
import Link from "next/link";
import { 
  BarChart3, 
  Building2, 
  Users, 
  Settings, 
  LayoutDashboard,
  ShieldCheck,
  Package,
  Calculator
} from "lucide-react";
import { LogoutButton } from "@/modules/auth/ui/logout-button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const rolGlobal = (session?.user as any)?.rolGlobal;

  if (rolGlobal !== RolGlobal.SUPERADMIN && rolGlobal !== RolGlobal.ADMIN_SAAS) {
    redirect("/login");
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard-admin", icon: LayoutDashboard },
    { name: "Organizaciones", href: "/dashboard-admin/organizaciones", icon: Building2 },
    { name: "Usuarios", href: "/dashboard-admin/usuarios", icon: Users },
    { name: "Planes", href: "/dashboard-admin/planes", icon: Package },
    { name: "Unidad Tributaria", href: "/dashboard-admin/unidad-tributaria", icon: Calculator },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Admin SaaS</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-20 px-4 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-emerald-600 transition-colors">
            <span>&larr;</span>
            Volver a la App
          </Link>
          <div className="border-t border-slate-100 pt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}
