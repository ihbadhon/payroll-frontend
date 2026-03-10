import AppShell from "@/components/layout/AppShell";
import RoleGuard from "@/components/shared/RoleGuard";
import { ROLES } from "@/config/permissions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]}>{children}</RoleGuard>
    </AppShell>
  );
}
