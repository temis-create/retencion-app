import { LoginForm } from "@/modules/auth/ui/login-form";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shadow-emerald-200 shadow-lg group-hover:bg-emerald-700 transition-colors">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">RetenSaaS</span>
        </Link>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-emerald-100/50 w-full max-w-md flex flex-col items-center border border-slate-100">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bienvenido</h1>
          <p className="text-slate-500 text-sm mt-2">Ingresa tus credenciales para acceder a tu panel fiscal</p>
        </div>
        
        <LoginForm />
        
        <p className="mt-10 text-xs text-slate-400 text-center">
            Diseñado para la excelencia fiscal en Venezuela.<br />
          &copy; {new Date().getFullYear()} RetenSaaS. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
