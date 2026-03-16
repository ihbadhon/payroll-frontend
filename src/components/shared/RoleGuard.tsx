"use client";

import { useAuth } from "@/store/auth.context";
import { Role } from "@/config/permissions";
import { getUserRoleName } from "@/utils/auth-role";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLoader from "./PageLoader";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

/**
 * Client-side role guard — second security layer after middleware.
 * Renders children only when the authenticated user's role is in allowedRoles.
 * Redirects to /unauthorized otherwise.
 *
 * Usage:
 *   <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.HR]}>
 *     {children}
 *   </RoleGuard>
 */
export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const userRole = getUserRoleName(user);
  const isAllowed =
    allowedRoles.length === 0 ||
    (!!userRole && allowedRoles.some((role) => role === userRole));

  useEffect(() => {
    if (!isLoading && !isAllowed) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAllowed, router]);

  if (isLoading) return <PageLoader />;
  if (!isAllowed) return null; // avoid flash before redirect

  return <>{children}</>;
}
