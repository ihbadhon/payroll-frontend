"use client";

import { useAuth } from "@/store/auth.context";
import { ROLES } from "@/config/permissions";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import PageLoader from "@/components/shared/PageLoader";

const ADMIN_ROLES: string[] = [ROLES.SUPER_ADMIN, ROLES.HR, ROLES.FINANCE];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  const role = user?.role?.name ?? "";

  if (ADMIN_ROLES.includes(role)) {
    return <AdminDashboard />;
  }

  // Employee (and any future roles without admin access)
  return <EmployeeDashboard />;
}
