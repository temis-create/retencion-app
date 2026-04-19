import Link from "next/link";
import { PlusCircle, FileText, ShoppingCart, Users, CreditCard } from "lucide-react";

export function QuickActions() {
  const actions = [
    { title: "Registrar Proveedor", href: "/proveedores", icon: Users, color: "text-blue-500", bg: "bg-blue-50 hover:bg-blue-100" },
    { title: "Registrar Compra", href: "/compras", icon: ShoppingCart, color: "text-primary-500", bg: "bg-primary-50 hover:bg-primary-100" },
    { title: "Registrar Pago", href: "/pagos", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50 hover:bg-emerald-100" },
    { title: "Retenciones IVA", href: "/fiscal/retenciones-iva", icon: FileText, color: "text-amber-500", bg: "bg-amber-50 hover:bg-amber-100" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link 
          key={action.title} 
          href={action.href}
          className={`group flex items-center gap-3 rounded-lg p-4 font-medium transition-colors ${action.bg} active:scale-[0.98] border border-transparent hover:border-zinc-200`}
        >
          <action.icon className={`h-5 w-5 ${action.color}`} />
          <span className="text-sm text-zinc-800">{action.title}</span>
        </Link>
      ))}
    </div>
  );
}
