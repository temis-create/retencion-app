"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-2 group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
    >
      <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-400 group-hover:text-red-500" />
      Cerrar sesión
    </button>
  );
}
