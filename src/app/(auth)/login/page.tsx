import { LoginForm } from "@/modules/auth/ui/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">RetenSaaS</h1>
        <p className="text-slate-500 text-sm mb-8">Gestión de Retenciones Fiscales</p>
        
        <LoginForm />
        
        <p className="mt-8 text-xs text-slate-400 text-center">
          &copy; 2026 RetenSaaS. Todos los derechos reservados.
        </p>
      </div>
    </main>
  );
}
