"use client";

import { signOut } from "next-auth/react";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 flex items-center justify-center rounded-full">
          <LogOut className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-900 font-outfit">Cerrar Sesión</h1>
          <p className="text-zinc-500">
            ¿Estás seguro de que deseas salir de RetenSaaS?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            asChild
            className="w-full"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Sí, salir
          </Button>
        </div>
      </div>
    </div>
  );
}
