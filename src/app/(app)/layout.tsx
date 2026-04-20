import { DashboardShell } from "@/modules/dashboard/ui/dashboard-shell";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated, otherwise redirect to login
  const user = await requireAuth();

  // Ignorar suspensión si es superadmin (para poder arreglar cosas)
  if ((user as any).rolGlobal === "SUPERADMIN" || (user as any).rolGlobal === "ADMIN_SAAS") {
    return <DashboardShell>{children}</DashboardShell>;
  }

  // Verificar estado de la organización
  if (!user.tenantId) {
    redirect("/login");
  }

  const org = await prisma.organizacion.findFirst({
    where: { id: user.tenantId },
    select: { estado: true }
  });

  if (org?.estado === "SUSPENDIDA") {
    redirect("/suspension");
  }

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
