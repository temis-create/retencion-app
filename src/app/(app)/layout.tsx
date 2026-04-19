import { DashboardShell } from "@/modules/dashboard/ui/dashboard-shell";
import { requireAuth } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated, otherwise redirect to login
  await requireAuth();

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
