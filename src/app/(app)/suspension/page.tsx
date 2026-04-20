import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuspensionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <ShieldAlert className="h-12 w-12" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Cuenta Suspendida</h1>
      <p className="mb-8 max-w-md text-slate-600">
        Tu organización se encuentra suspendida de manera temporal. Por favor, contacta a soporte o al administrador de tu cuenta para regularizar tu situación comercial.
      </p>
      <div className="flex gap-4">
        <Link href="mailto:soporte@retensaas.com">
          <Button className="bg-rose-600 hover:bg-rose-700">Contactar Soporte</Button>
        </Link>
        <Link href="/login">
          <Button variant="ghost">Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  );
}
